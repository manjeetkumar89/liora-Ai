import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


export const Sidebar = ({
  currentTheme,
  isSidebarOpen,
  setIsSidebarOpen,
  handleNewChat,
  chats,
  setActiveChatId,
  handleDeleteChat,
  setIsProfileOpen,
  clearMessages,
  fetchChatMessages
}) => {

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const setActiveChat = (chatId) => {
    setActiveChatId(chatId);
    dispatch(clearMessages());
    fetchChatMessages(chatId);
    setIsSidebarOpen(false);
  }
  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-30 w-[280px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out md:translate-x-0 border-r shadow-xl`}
        style={{
          background: currentTheme.gradients.sidebar,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Chats</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                style={{ color: currentTheme.text }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* New Chat Button */}

            <div class="relative flex w-full cursor-pointer items-center overflow-hidden rounded-xl p-[1.5px]">
              <div class=" animate-rotate absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(#0ea5e9_50deg,#522AF4_120deg)]" ></div>
              {/* <button class="relative z-10 block w-full rounded-xl bg-gray-800 px-6 py-3 text-white">
                My Button
              </button> */}
              <button
                onClick={handleNewChat}
                className="relative z-10 flex items-center justify-center w-full px-3 py-2 rounded-2xl border"
                style={{
                  borderColor: currentTheme.border,
                  backgroundColor: "#1C1D1F",
                  color: currentTheme.text
                }}
              >
                {/* <span className='absolute top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/3 hover:translate-x-3/4 w-32 h-16 bg-blue-800 rounded-full blur-2xl opacity-80 z-0'></span> */}

                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Chat
              </button>
            </div>


          </div>

          {/* Chat History */}
          <div className="flex-grow overflow-y-auto px-2 py-2 space-y-1">
            {chats.map(chat => (
              <div
                key={chat._id}
                className={`flex items-center overflow-hidden px-3 py-2 rounded-2xl cursor-pointer transition-all duration-200 group ${chat.active ? 'bg-gray-400/10 backdrop-blur-md border border-white/10 shadow-lg' : 'hover:bg-[#2A2B32]' /*bg-[#343541] bg-gradient-to-r from-[#343541] from-50% to-blue-600 to-150%*/
                  } relative`}
                style={{
                  color: currentTheme.text
                }}
                onClick={() => setActiveChat(chat._id)}
              >
                {chat.active ?
                  <>
                    <span className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/3 w-32 h-16 bg-blue-800 rounded-full blur-2xl opacity-80 z-0'></span>
                    <span className="absolute rounded-2xl bg-blue-400 blur-[0.8px] right-0 w-1 h-1/2 opacity-80"></span>
                  </> : null
                }

                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">{chat.title}</div>
                  {/* <div className={`text-xs ${chat.active ? 'text-white/70' : 'opacity-50'}`}>
                    {chat.lastActivity}
                  </div> */}
                </div>
                <button
                  className=" md:opacity-0 group-hover:opacity-100 hover:bg-white/10 p-1 rounded-lg transition-all duration-200 absolute right-2"
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  title="Delete chat"
                  style={{ color: currentTheme.text }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Profile Section */}
          <div
            className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
            style={{ borderColor: currentTheme.border }}
            onClick={() => setIsProfileOpen(true)}
          >
            <div
              className=" overflow-hidden flex items-center px-3 py-2 rounded-3xl hover:shadow-md transition-all duration-200 bg-gray-400/10 backdrop-blur-md border border-white/10 shadow-xl"
              style={{ color: currentTheme.text }}
            >
              <span className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/3 w-32 h-16 bg-blue-800 rounded-full blur-2xl opacity-80 z-0'></span>
              <div className="w-10 h-10 rounded-full bg-radial-[at_50%_75%] from-blue-400 to-blue-800 flex items-center justify-center text-white font-medium mr-3 ">
                {(user.fullName.firstName).charAt(0)}{(user.fullName.lastName).charAt(0)}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{user.fullName.firstName} {user.fullName.lastName}</div>
                <div className="text-sm opacity-50">{user.email}</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
