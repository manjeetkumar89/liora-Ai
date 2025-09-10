import React from 'react';

export const Header = ({
  currentTheme,
  isSidebarOpen,
  setIsSidebarOpen,
  setIsSystemPromptOpen
}) => {
  return (
    <div
      className="flex items-center px-6 py-4 border-b shadow-sm"
      style={{
        background: currentTheme.cardBg,
        borderColor: currentTheme.border,
        color: currentTheme.text
      }}
    >
      <button
        className="md:hidden mr-4 hover:bg-white/10 rounded-lg p-1 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Liora AI Chat</h1>
          <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: currentTheme.primary + '20',
              color: currentTheme.primary
            }}>
            Active
          </span>
        </div>
        <button
          onClick={() => setIsSystemPromptOpen(true)}
          className="flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 text-sm"
          style={{
            background: currentTheme.inputBg,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          System Prompt
        </button>
      </div>
    </div>
  );
};
