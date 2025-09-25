import React from 'react';

export const MessageInput = ({
  currentTheme,
  inputMessage,
  setInputMessage,
  handleSendMessage
}) => {
  return (
    <div
      className={` bottom-0 right-0 static w-full p-4 md:px-10 md:py-4 transition-all duration-500 `}
      style={{
        // background: "transparent",
        //borderTop: `1px solid ${currentTheme.border}`,
      }}
    >
      <div className="max-w-2xl mx-auto relative ">
        <form onSubmit={handleSendMessage} className="flex space-x-3 items-end justify-center ">
          <div className="flex-grow relative group">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              rows={1}
              className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] outline-none w-full px-4 py-3 rounded-2xl transition-all duration-300 resize-none pr-12 font-light"
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
            className="absolute right-5 bottom-3 p-2 rounded-xl  transition-all duration-200 hover:bg-[#202123] flex items-center justify-center"
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
