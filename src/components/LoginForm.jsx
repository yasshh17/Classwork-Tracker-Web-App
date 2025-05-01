import { useState } from 'react';
import { isValidUser } from '../utils/user-store';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidUser(username)) {
      setError('User not registered or password incorrect');
      return;
    }

    setError('');
    onLogin({ username });
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 🔧 Error display */}

      <label>Username:</label>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
