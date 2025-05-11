import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ type }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const baseUrl = 'http://localhost:5000';
    const endpoint = type === 'admin' ? '/api/admin/login' : '/api/login';
    const url = `${baseUrl}${endpoint}`;

    const payload =
      type === 'admin'
        ? { username: emailOrUsername, password }
        : { email: emailOrUsername, password };

    try {
      const res = await axios.post(url, payload);
      if (type === 'admin') {
        localStorage.setItem('admin', 'true');
        navigate('/admin-dashboard');
      } else {
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('fullName', res.data.fullName);
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>{type === 'admin' ? 'Admin Login' : 'User Login'}</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type={type === 'admin' ? 'text' : 'email'}
            placeholder={type === 'admin' ? 'Username' : 'Email'}
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p style={styles.error}>{error}</p>}

          {type !== 'admin' && (
            <p style={styles.linkText}>
              Don't have an account?{' '}
              <Link to="/register" style={styles.link}>
                Register here
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3498db, #8e44ad)',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    color: '#2c3e50',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '10px',
  },
  linkText: {
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
