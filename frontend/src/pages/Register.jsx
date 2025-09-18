import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import axiosBaseUrl from '../api/AxiosConfig';
import { useDispatch } from 'react-redux';
import { loadUser } from '../store/UserSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = {
      fullName : {
        firstName: formData.firstName,
        lastName: formData.lastName
      },
      email : formData.email,
      password : formData.password
    }

    try {
      const response = await axiosBaseUrl.post('/api/auth/register', data ,{withCredentials:true});
      // const user = await axiosBaseUrl.post('/api/auth/login', {email:response.data.user.email, password:data.password} , {withCredentials:true});
      // dispatch(loadUser(user.data.user));
      dispatch(loadUser(response.data.user));
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error);
    }

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
          Create Account
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="firstName" 
                className="block mb-2 text-sm font-medium"
                style={{ color: currentTheme.text }}
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
                style={{ 
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`
                }}
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="lastName" 
                className="block mb-2 text-sm font-medium"
                style={{ color: currentTheme.text }}
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
                style={{ 
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`
                }}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
              style={{ 
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
              placeholder="Create a password"
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
            Sign Up
          </button>
        </form>

        <p 
          className="mt-6 text-center text-sm"
          style={{ color: currentTheme.secondary }}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium transition-colors hover:underline"
            style={{ color: currentTheme.accent }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;