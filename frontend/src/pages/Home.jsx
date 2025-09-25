import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../theme';
import { Sidebar } from '../components/chat/Sidebar';
import { Header } from '../components/chat/Header';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { SystemPromptModal } from '../components/chat/SystemPromptModal';
import { ProfileModal } from '../components/chat/ProfileModal';
import { formatMessage } from '../utils/FormatMessage';
import {toast} from 'react-toastify';
import axiosBaseUrl from '../api/AxiosConfig';
import {
  selectMessages,
  selectChats,
  selectIsTyping,
  selectSystemPrompt,
  addMessage,
  setIsTyping,
  setSystemPrompt,
  addChat,
  deleteChat,
  clearMessages,
  setActiveChatId,
  setChats,
  setMessages
} from '../store/chatSlice';
import { logoutUser } from '../store/UserSlice';
import {io} from 'socket.io-client';
import { nanoid } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const chats = useSelector(selectChats);
  const isTyping = useSelector(selectIsTyping);
  const systemPrompt = useSelector(selectSystemPrompt);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [deletingChatId, setdeletingChatId] = useState(null);
  const [loading, setloading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChats = async()=>{
      const response = await axiosBaseUrl.get('/api/chat', {withCredentials:true});
      dispatch(setChats(response.data.chats));
    }
    fetchChats();

  }, [ dispatch])

  useEffect(() => {
    const temp = io(axiosBaseUrl.defaults.baseURL, {
      withCredentials: true,
    });

    // Listen for typing events from the server
    temp.on("ai-typing", () => {
      dispatch(setIsTyping(true));
    });

    temp.on("ai-stop-typing", () => {
      dispatch(setIsTyping(false));
    });

    temp.on("ai-response", (messagePayload) => {
      const aiMessage = {
        _id: nanoid(),
        content: messagePayload.content,
        role: "model"
      };
      dispatch(addMessage(aiMessage));
      dispatch(setIsTyping(false)); // Stop typing when message received
    });

    setSocket(temp);

    // Clean up on unmount
    return () => {
      temp.disconnect();
    };
  }, [dispatch]);
  
  

  // Close sidebar on mobile when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
   const currentTheme = theme.dark;


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newUserMessage = {
        _id: nanoid(),
        content: inputMessage,
        role: 'user',
      };

      let activeChat = chats.find(chat => chat.active);

      // Update chat list with new chat if it's the first message
      if (messages.length === 0 && !activeChat) {
        const newChatRes = await axiosBaseUrl.post('api/chat/', {title: inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : '')},{withCredentials:true});
        const newChat = {...newChatRes.data.chat, active: true};
        dispatch(addChat(newChat));
        dispatch(setActiveChatId(newChat._id));
        activeChat = newChat;
      }

      dispatch(addMessage(newUserMessage));
      setInputMessage('');

      // Use the updated activeChat (either existing or just created)
      const chatIdToSend = activeChat ? activeChat._id : chats.find(chat => chat.active)?._id;

      if (socket && chatIdToSend) {
        socket.emit("ai-message", {
          chatId: chatIdToSend,
          content: inputMessage.trim(),
        });
      }
    }
  };

  const handleNewChat = async() => {
    const title = prompt("enter chat title");
    const setActiveChatsInactive = chats.map(chat => ({...chat, active:false}));
    if(!title){
      dispatch(clearMessages());
      dispatch(setChats([...setActiveChatsInactive]));
      return;
    };
    const newChat = await axiosBaseUrl.post('/api/chat/', {title:title},{withCredentials:true});
    dispatch(addChat({...newChat.data.chat,active:true}))
    dispatch(clearMessages());
  };

  const handleDeleteChat = async(chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    setdeletingChatId(chatId);
    const response = await axiosBaseUrl.delete(`/api/chat/${chatId}`, {withCredentials:true});
    toast.success(response.data.message);
    dispatch(deleteChat(chatId));
  };

  const logoutHandler = async() =>{
    try {
      const response = await axiosBaseUrl.post('/api/auth/logout', {}, { withCredentials: true });
      toast.success(response.data.message);
      dispatch(logoutUser());
      dispatch(clearMessages());
    } catch (error) {
      console.error("logout failed",error);
    }
  };

  const fetchChatMessages = async(chatId)=>{
    try {
      const response = await axiosBaseUrl.get(`/api/chat/${chatId}`, {withCredentials:true});
      dispatch(setMessages(response.data.messages));
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }

  const deleteAccountHandler = async()=>{
    try {
      setloading(true);
      await axiosBaseUrl.delete('/api/auth/deleteAccount', {withCredentials : true});
      dispatch(logoutUser());
      toast.success("Account deleted");
      setloading(false);
      navigate('/login');
    } catch (error) {
      console.error("error deleting account : ", error)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: currentTheme.background }}>
      <Sidebar
        currentTheme={currentTheme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleNewChat={handleNewChat}
        chats={chats}
        handleDeleteChat={handleDeleteChat}
        setActiveChatId={(id) => dispatch(setActiveChatId(id))}
        setIsProfileOpen={setIsProfileOpen}
        clearMessages={clearMessages}
        fetchChatMessages={fetchChatMessages}
        deletingChatId={deletingChatId}
      />

      <div className="flex-1 flex flex-col relative">
        {/* <div className='absolute top-0 right-1/2 transform -translate-y-1/3 translate-x-1/2 w-[1000px] h-[800px] bg-radial-[at_50%_50%] from-cyan-400 from-20% via-sky-700 via-35% to-black to-100% rounded-full blur-3xl opacity-90 z-0'></div> */}
        <Header
          currentTheme={currentTheme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsSystemPromptOpen={setIsSystemPromptOpen}
        />

        <MessageList
          messages={messages}
          isTyping={isTyping}
          currentTheme={currentTheme}
          formatMessage={formatMessage}
          messagesEndRef={messagesEndRef}
          setInputMessage={setInputMessage}
        />

        <MessageInput
          currentTheme={currentTheme}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>

      <SystemPromptModal
        isOpen={isSystemPromptOpen}
        onClose={() => setIsSystemPromptOpen(false)}
        currentTheme={currentTheme}
        systemPrompt={systemPrompt}
        setSystemPrompt={(prompt) => dispatch(setSystemPrompt(prompt))}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentTheme={currentTheme}
        logoutHandler={logoutHandler}
        deleteAccountHandler={deleteAccountHandler}
        loading={loading}
      />

      <style>
        {`
          @keyframes messageIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes rotate{
            0% { 
              transform: rotate(0deg) 
            }
            100% { 
              transform: rotate(360deg)
            }
          }

          .animate-rotate {
            animation: rotate 8s linear infinite;
          }
          .animate-messageIn {
            animation: messageIn 0.5s ease-out forwards;
          }
          .animate-pop {
            animation: pop 0.3s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
