import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    console.log('🔐 Login attempt started');
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Sending login request...');
      
      // Use the API service
      const response = await api.auth.login(email.trim(), password);
      
      console.log('✅ Login response received:', response);

      // Check if login was successful
      if (response.success && response.token) {
        console.log('✅ Login successful, storing token');
        
        // Store the token
        localStorage.setItem('token', response.token);
        
        // Store user data if needed
        if (response.data && response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // Clear form fields
        setEmail('');
        setPassword('');
        setError('');

        console.log('🎯 Navigating to dashboard...');
        
        // Navigate to dashboard with user email as state
        navigate('/StudentDashboard', { 
          state: { s_id: response.data.user.email } 
        });
        
      } else {
        console.log('❌ Login failed:', response.message);
        setError(response.message || 'Login failed. Please try again.');
      }
      
    } catch (err) {
      console.error('❌ Login error caught:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        console.log('Server error status:', err.response.status);
        console.log('Server error data:', err.response.data);
        
        const errorMessage = err.response.data?.message || 'Invalid email or password';
        setError(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        console.log('Network error - no response received');
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        console.log('Unexpected error:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br /><br /><br />
      <div className="login-container">
        <style jsx="true">{`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
          }
          .login-box {
            background: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
          }
          .login-box h2 {
            margin-bottom: 10px;
            font-size: 24px;
          }
          .login-box p {
            margin-bottom: 20px;
            color: #666;
          }
          .login-box input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .login-box input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          }
          .login-box button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 10px;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          .login-box button:hover:not(:disabled) {
            background-color: #0056b3;
          }
          .login-box button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          .login-box .link {
            display: block;
            text-align: center;
            margin-top: 10px;
            color: #007bff;
            text-decoration: none;
          }
          .login-box .link:hover {
            text-decoration: underline;
          }
          .login-box .forgot-password {
            display: block;
            text-align: right;
            margin-bottom: 10px;
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
          }
          .login-box .forgot-password:hover {
            text-decoration: underline;
          }
          .error-message {
            color: #dc3545;
            margin-bottom: 10px;
            padding: 8px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            font-size: 14px;
          }
          .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="login-box">
          <h2>Login</h2>
          <p>to get started</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <a href="#" className="forgot-password">Forgot Password?</a>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={loading}>
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <Link to={'/signup'} className="link">New User? Register</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;