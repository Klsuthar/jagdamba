import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bootMessage, setBootMessage] = useState('Checking current session...');
  const [bootState, setBootState] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Hydrate saved email
    const savedEmail = localStorage.getItem('adminEmail') || '';
    const savedRemember = localStorage.getItem('adminRemember') === 'true';
    setEmail(savedEmail);
    setRememberMe(savedRemember);

    // Watch auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBootState('ready');
        setBootMessage('Active session found. Redirecting...');
        navigate('/admin/dashboard');
        return;
      }
      setBootState('ready');
      setBootMessage('Login is ready.');
    }, (err) => {
      console.error(err);
      setBootState('error');
      setBootMessage('The login service could not be initialized.');
      setErrorMsg('Unable to connect to the login service.');
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      if (rememberMe) {
        localStorage.setItem('adminEmail', email.trim());
        localStorage.setItem('adminRemember', 'true');
      } else {
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminRemember');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid email or password. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <main className="login-shell" style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#14213d'
    }}>
      <div className="login-container" style={{
        width: '100%',
        maxWidth: '900px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        background: 'rgba(255, 255, 255, 0.94)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid rgba(148, 163, 184, 0.22)'
      }}>
        {/* Left Side Info Panel */}
        <div className="brand-panel" style={{
          background: 'linear-gradient(160deg, rgba(30, 58, 138, 0.96) 0%, rgba(29, 78, 216, 0.92) 100%)',
          color: 'white',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div className="brand-mark" style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: '20px'
          }}>
            <i className="fas fa-school"></i>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'white' }}>Shree Jagdamba School</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Administrative access for school operations and parent message tracking.
          </p>
        </div>

        {/* Right Side Form Panel */}
        <div className="form-panel" style={{ padding: '40px' }}>
          <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#dbeafe', borderRadius: '50px', color: '#1e3a8a', fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>
            <i className="fas fa-lock"></i>
            <span>Admin Portal</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '10px' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Sign in to continue to management dashboard.</p>

          <div className={`status-box ${bootState}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '15px',
            background: bootState === 'ready' ? '#f0fdf4' : bootState === 'error' ? '#fef2f2' : '#eff6ff',
            color: bootState === 'ready' ? '#166534' : bootState === 'error' ? '#b91c1c' : '#1e3a8a',
            border: `1px solid ${bootState === 'ready' ? '#bbf7d0' : bootState === 'error' ? '#fecaca' : '#bfdbfe'}`
          }}>
            {bootState === 'loading' && <span className="status-spinner" style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(29, 78, 216, 0.18)', borderTopColor: '#1d4ed8', animation: 'spin 0.8s linear infinite' }}></span>}
            <span>{bootMessage}</span>
          </div>

          {errorMsg && (
            <div className="error show" style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '15px'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                <i className="fas fa-envelope" style={{ marginRight: '6px', color: '#1d4ed8' }}></i> Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="admin@jagdamba.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px', position: 'relative' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                <i className="fas fa-lock" style={{ marginRight: '6px', color: '#1d4ed8' }}></i> Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '38px', color: '#64748b', cursor: 'pointer' }}
              ></i>
            </div>
            <div className="remember-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ margin: 0, fontWeight: 500, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                Remember my email
              </label>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={loading || bootState !== 'ready'}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(29, 78, 216, 0.2)'
              }}
            >
              {loading ? (
                <span><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Signing in...</span>
              ) : (
                <span><i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
