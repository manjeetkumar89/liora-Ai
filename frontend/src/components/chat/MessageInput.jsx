import React from 'react';

export const MessageInput = ({
  currentTheme,
  inputMessage,
  setInputMessage,
  handleSendMessage
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 md:static p-4 md:p-8 transition-all duration-500 ${inputMessage.length === 0 ? 'transform translate-y-0' : ''}`}
      style={{
        background: 'linear-gradient(180deg, rgba(53,55,64,0), #353740 25%, #353740)',
        borderTop: `1px solid ${currentTheme.border}`,
      }}
    >
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSendMessage} className="flex space-x-4 items-end justify-center">
          <div className="flex-grow relative group">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              rows={1}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none pr-12 font-light"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`,
                boxShadow: 'none',
              }}
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            className="absolute right-5 bottom-3 p-2 rounded-lg transition-all duration-200 hover:bg-[#202123] flex items-center justify-center"
            style={{
              background: inputMessage.trim() ? currentTheme.primary : 'transparent',
              color: inputMessage.trim() ? '#fff' : currentTheme.text,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 aspect-[1] transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
