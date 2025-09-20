import React from 'react';
import { Message } from './Message';

export const MessageList = ({
  messages,
  isTyping,
  currentTheme,
  formatMessage,
  messagesEndRef,
  setInputMessage
}) => {
  return (
    <div
      className="flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: currentTheme.background }}
    >
      {messages.length === 0 ? (
        <WelcomeScreen currentTheme={currentTheme} setInputMessage={setInputMessage} />
      ) : (
        <div className="w-full max-w-4xl mx-auto py-6 px-4 md:px-8 space-y-6">
          {messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              formatMessage={formatMessage}
              currentTheme={currentTheme}
            />
          ))}
          {isTyping && <TypingIndicator currentTheme={currentTheme} />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

const WelcomeScreen = ({ currentTheme, setInputMessage }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
      <h2
        className="text-2xl md:text-3xl font-bold mb-3 text-center"
        style={{ color: currentTheme.text }}
      >
        Welcome to Liora AI
      </h2>
      <p
        className="text-center max-w-md mb-8"
        style={{ color: currentTheme.secondary }}
      >
        Start a conversation with Liora AI. Ask anything from coding questions to creative writing.
      </p>
      <div className="w-full max-w-2xl">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { text: "Help me with React", gradient: "blue" },
            { text: "Write a blog post", gradient: "purple" },
            { text: "Explain async/await", gradient: "pink" },
            { text: "Create a color scheme", gradient: "green" }
          ].map((suggestion) => (
            <button
              key={suggestion.text}
              onClick={()=> setInputMessage(suggestion.text)}
              className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm backdrop-blur-sm animate-fadeIn"
              style={{
                background: currentTheme.gradients[suggestion.gradient],
                color: '#ffffff',
              }}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = ({ currentTheme }) => {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 shadow-lg"
        style={{ background: currentTheme.gradients.purple }}
      >
        AI
      </div>
      <div
        className="max-w-[85%] md:max-w-[75%] p-4 " //rounded-2xl rounded-tl-sm backdrop-blur-sm
        style={{
          //background: 'rgba(24, 24, 27, 0.5)',
          //border: `1px solid ${currentTheme.border}`,
        }}
      >
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
