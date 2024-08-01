import React, { useState } from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar/Navbar';

const Login2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    // navigate('/StudentDashboard ',{ state: { s_id: 'S0001' } });
    try {
      const response = await axios.post('https://ict-student-view-server.vercel.app/api/salman/login', { email, password });
      const { data } = response;

      if (data.message === "Login successful") {
        // Reset form fields and error only if login is successful
        setEmail('');
        setPassword('');
        setError('');
        console.log('Login successful!!!')

        navigate('/StudentDashboard', { state: { s_id: email } }); // Redirect to Student Dashboard route
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setError('Login failed. Please try again.');
    }

    
  };

  return(
    <div>
    <Navbar/>
    <br/><br/><br/>
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
        }
        .login-box button:hover {
          background-color: #0056b3;
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#" className="forgot-password">Forgot Password?</a>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
          <Link to={'/signup'}><a href="/signup" className="link">New User? Register</a></Link>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login2;