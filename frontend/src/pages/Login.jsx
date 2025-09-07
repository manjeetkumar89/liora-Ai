import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email : email,
      password : password
    }
    console.log('Form submitted', data);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: currentTheme.background }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{ 
          background: currentTheme.cardBg,
          border: `1px solid ${currentTheme.border}`
        }}
      >
        <h2 
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: currentTheme.text }}
        >
          Welcome Back
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block mb-2 text-sm font-medium"
              style={{ color: currentTheme.text }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
              style={{ 
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block mb-2 text-sm font-medium"
              style={{ color: currentTheme.text }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
              style={{ 
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium transition-colors"
            style={{ 
              background: currentTheme.primary,
              color: '#ffffff'
            }}
          >
            Sign In
          </button>
        </form>

        <p 
          className="mt-6 text-center text-sm"
          style={{ color: currentTheme.secondary }}
        >
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium transition-colors hover:underline"
            style={{ color: currentTheme.accent }}
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;