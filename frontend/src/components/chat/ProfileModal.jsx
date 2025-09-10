import React from 'react';

export const ProfileModal = ({
  isOpen,
  onClose,
  currentTheme
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl m-4 shadow-xl transform transition-all duration-200"
        style={{ background: currentTheme.cardBg }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: currentTheme.text }}
          >
            Profile Settings
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

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-medium">
              JD
            </div>
            <button
              className="text-sm font-medium hover:underline"
              style={{ color: currentTheme.primary }}
            >
              Change Photo
            </button>
          </div>

          {/* Profile fields */}
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: currentTheme.text }}
            >
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-5 py-3 rounded-xl outline-none transition-colors"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: currentTheme.text }}
            >
              Email
            </label>
            <input
              type="email"
              className="w-full px-5 py-3 rounded-xl outline-none transition-colors"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              defaultValue="john@example.com"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text
              }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              style={{
                background: currentTheme.primary,
                color: '#ffffff'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
