import React, { useState, useEffect } from 'react';
import { useJwt } from 'react-jwt';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const { decodedToken, isExpired } = useJwt();

  useEffect(() => {
    if (decodedToken && !isExpired) {
      setLoggedIn(true);
    }
  }, [decodedToken, isExpired]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { token } = await response.json();
      localStorage.setItem('jwtToken', token);
      setLoggedIn(true);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div>
        <h1>Login</h1>
        {loginError && <p>{loginError}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {decodedToken.username}!</h1>
      <p>Your session expires at {new Date(decodedToken.exp * 1000).toLocaleString()}.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
