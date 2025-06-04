import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, register } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => login(username, password);
  const handleRegister = () => register(username, password);
  return (
    <div className="login">
      <h2>Veloxity</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
