import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const Message = ({ message, formatMessage, currentTheme }) => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-messageIn`}>
      {message.role === 'model' && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 shadow-lg animate-pop border"
          //style={{ background: currentTheme.gradients.purple }}
        >
          AI
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[80%] py-1 px-5 group rounded-4xl transition-all duration-300  ${message.role==='user' ? 'rounded-tr-sm bg-cyan-400/20' : 'rounded-tl-sm bg-gray-500/20 ' }`}
        style={{
          //background: currentTheme.cardBg,
          color: currentTheme.text,
        }}
      >
        <div className="prose prose-invert max-w-none">
          {formatMessage(message.content)}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {message.role === 'model' && (
            <>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast.success('Message copied to clipboard!');
                }}
                className="p-1 rounded hover:bg-black/10 transition-colors"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => { }}
                className="p-1 rounded hover:bg-black/10 transition-colors"
                title="Regenerate response"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      {message.role === 'user' && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-500 font-medium ml-3 flex-shrink-0 shadow-lg animate-pop border border-cyan-500"
          //style={{ background: currentTheme.gradients.blue }}
        >
          {user?.fullName.firstName.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};
