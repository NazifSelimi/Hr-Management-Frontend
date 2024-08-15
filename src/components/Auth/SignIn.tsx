import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './SignIn.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    setError(null);

    try {
      // Replace this URL with your authentication API endpoint
      const response = await axiosInstance.post('https://your-auth-api.com/login', {
        email,
        password,
      });

      // Check for successful response
      if (response.status === 200) {
        // Authentication successful, redirect to CreateProjectView
        navigate('/create-projects-view');
      } else {
        // Handle authentication failure
        setError('Invalid email or password');
      }
    } catch (err) {
      // Handle network or server errors
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In');
    // Handle Google sign-in and redirection
  };

  const handleGithubSignIn = () => {
    console.log('GitHub Sign In');
    // Handle GitHub sign-in and redirection
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook Sign In');
    // Handle Facebook sign-in and redirection
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2 className="signin-title">Sign In</h2>
        {error && <p className="signin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        <div className="social-buttons">
          <button onClick={handleGoogleSignIn} className="social-button google-button">
            Sign In with Google
          </button>
          <button onClick={handleGithubSignIn} className="social-button github-button">
            Sign In with GitHub
          </button>
          <button onClick={handleFacebookSignIn} className="social-button facebook-button">
            Sign In with Facebook
          </button>
        </div>
        <p className="signup-link">
          Don't have an account?{' '}
          <a href="/signup" className="signup-link-text">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
