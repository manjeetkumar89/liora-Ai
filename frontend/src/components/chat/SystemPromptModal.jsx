import React from 'react';

export const SystemPromptModal = ({
  isOpen,
  onClose,
  currentTheme,
  systemPrompt,
  setSystemPrompt
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 rounded-2xl m-4 shadow-xl"
        style={{ background: currentTheme.cardBg }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold"
            style={{ color: currentTheme.text }}
          >
            System Prompt
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
            style={{ background: currentTheme.inputBg }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: currentTheme.text }}
            >
              Select a preset or create your own
            </label>
            <select
              className="w-full px-4 py-2 rounded-xl outline-none transition-colors mb-4"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              value={systemPrompt}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setSystemPrompt('');
                } else {
                  setSystemPrompt(e.target.value);
                }
              }}
            >
              <option value="You are a helpful AI assistant.">General Assistant</option>
              <option value="You are an expert software developer who helps with coding questions.">Code Expert</option>
              <option value="You are a creative writing assistant who helps with content creation.">Writing Assistant</option>
              <option value="You are a data analysis expert who helps with interpreting data.">Data Analyst</option>
              <option value="custom">Custom Prompt...</option>
            </select>

            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              placeholder="Enter your custom system prompt..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text
              }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              style={{
                background: currentTheme.primary,
                color: '#ffffff'
              }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
