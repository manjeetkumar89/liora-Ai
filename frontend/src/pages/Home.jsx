import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../theme';
import { Sidebar } from '../components/chat/Sidebar';
import { Header } from '../components/chat/Header';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { SystemPromptModal } from '../components/chat/SystemPromptModal';
import { ProfileModal } from '../components/chat/ProfileModal';
import { formatMessage } from '../utils/messageFormatter';

export const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: 'React Development Help', timestamp: 'Just now', active: true },
    { id: 2, title: 'AI Assistance', timestamp: '2 hours ago', active: false },
    { id: 3, title: 'Project Planning', timestamp: '1 day ago', active: false },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const simulateTyping = async (text) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    return text;
  };

  const generateAIResponse = async (userMessage) => {
    const responses = {
      'help me with react': 'React is a JavaScript library for building user interfaces. What specific aspect would you like to learn about? I can help with:\n\n1. Components and Props\n2. State Management\n3. Hooks\n4. Routing\n5. Performance Optimization',
      'write a blog post': "I'll help you write a blog post. First, let's determine:\n\n1. The main topic\n2. Target audience\n3. Key points to cover\n4. Desired length\n\nWhat topic would you like to write about?",
      'explain async/await': "Async/await is a way to handle asynchronous operations in JavaScript. Here's a simple explanation:\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch('api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n```\n\nWould you like me to explain more about how it works?",
      'create a color scheme': "I'll help you create a color scheme. Let's start with these modern combinations:\n\n1. 🎨 Primary: #19c37d\n2. 🌟 Accent: #4f46e5\n3. 🌑 Dark: #343541\n4. ⭐ Light: #ececf1\n\nWould you like to explore more color combinations or adjust these?"
    };

    const defaultResponse = "I understand you're asking about '" + userMessage + "'. Could you provide more details about what specific information or help you're looking for?";

    const matchingResponse = Object.entries(responses).find(([key]) =>
      userMessage.toLowerCase().includes(key.toLowerCase())
    );

    return matchingResponse ? matchingResponse[1] : defaultResponse;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
      };

      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');

      // Generate and add AI response
      const aiResponse = await generateAIResponse(inputMessage);
      const newAiMessage = {
        id: messages.length + 2,
        text: await simulateTyping(aiResponse),
        sender: 'ai',
      };

      setMessages(prev => [...prev, newAiMessage]);

      // Update chat list with new chat if it's the first message
      if (messages.length === 0) {
        const newChat = {
          id: chats.length + 1,
          title: inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : ''),
          active: true,
          timestamp: 'Just now'
        };
        setChats(prev => [newChat, ...prev.map(chat => ({ ...chat, active: false }))]);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    setChats(prev => prev.filter(chat => chat.id !== chatId));

    // If we're deleting the active chat, clear messages
    if (chats.find(chat => chat.id === chatId)?.active) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: currentTheme.background }}>
      <Sidebar
        currentTheme={currentTheme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleNewChat={handleNewChat}
        chats={chats}
        setChats={setChats}
        handleDeleteChat={handleDeleteChat}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="flex-1 flex flex-col relative">
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
        setSystemPrompt={setSystemPrompt}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentTheme={currentTheme}
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
