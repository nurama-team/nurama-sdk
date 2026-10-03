import React, { useState } from 'react';
import config from '../config';

function LoginForm({ onLogin, isLoading }) {
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!apiUrl || !email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    onLogin(apiUrl, email, password);
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="apiUrl">API Base URL:</label>
          <input
            type="text"
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            disabled={isLoading}
            required
          />
          <small className="form-text text-muted">
            Default from environment: {config.apiUrl}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="login-button"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm; 