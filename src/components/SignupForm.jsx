import { useState } from 'react';
import './LoginForm.css';
import { registerUser } from '../utils/user-store'; 

function SignupForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    registerUser(username);
    console.log('User registered:', username);
    onRegister(username);
  };

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Register</h2>

      <label>Username:</label>
      <input
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        placeholder="Choose a password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  );
}

export default SignupForm;
