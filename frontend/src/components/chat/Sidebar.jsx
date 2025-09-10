import React from 'react';

export const Sidebar = ({ 
  currentTheme, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  handleNewChat, 
  chats, 
  setChats, 
  handleDeleteChat, 
  setIsProfileOpen 
}) => {
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
        className={`fixed md:relative inset-y-0 left-0 z-30 w-[280px] transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:translate-x-0 border-r shadow-xl`}
        style={{
          background: currentTheme.gradients.sidebar,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-3 md:hidden">
              <h2 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Chats</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                style={{ color: currentTheme.text }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center w-full px-3 py-3 rounded-md transition-all duration-200 border hover:opacity-90 group"
              style={{
                borderColor: currentTheme.border,
                background: 'transparent',
                color: currentTheme.text
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-grow overflow-y-auto px-2 py-2 space-y-1">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 group ${
                  chat.active ? 'bg-[#343541]' : 'hover:bg-[#2A2B32]'
                } relative`}
                style={{
                  color: currentTheme.text
                }}
                onClick={() => {
                  setChats(prev => prev.map(c => ({
                    ...c,
                    active: c.id === chat.id
                  })));
                }}
              >
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className={`text-xs ${chat.active ? 'text-white/70' : 'opacity-50'}`}>
                    {chat.timestamp}
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 p-1 rounded-lg transition-all duration-200 absolute right-2"
                  onClick={(e) => handleDeleteChat(chat.id, e)}
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
            className="p-4 border-t cursor-pointer hover:bg-opacity-80 transition-colors"
            style={{ borderColor: currentTheme.border }}
            onClick={() => setIsProfileOpen(true)}
          >
            <div
              className="flex items-center p-3 rounded-xl hover:shadow-md transition-all duration-200"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium mr-3">
                JD
              </div>
              <div className="flex-grow">
                <div className="font-medium">John Doe</div>
                <div className="text-sm opacity-50">john@example.com</div>
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
