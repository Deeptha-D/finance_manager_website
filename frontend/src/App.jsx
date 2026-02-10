// src/App.jsx
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import UpdateExpenses from './UpdateExpenses';
import ExpenseSheet from './ExpenseSheet';
import NotificationsPage from './NotificationsPage';
import Reports from './Reports';
import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  Wallet,
  Coins,
  CreditCard,
  BarChart3,
  LineChart
} from 'lucide-react';


const App = () => {
  const [page, setPage] = useState('home');
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  // API URLs
  const API_AUTH_URL = 'http://localhost:5000/api/auth';
  const API_BASE_URL = 'http://localhost:5000/api';

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setPage('dashboard');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPage('dashboard');
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Cannot connect to server. Make sure backend is running on port 5000.' 
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPage('dashboard');
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Cannot connect to server. Make sure backend is running on port 5000.' 
      });
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const getToken = () => localStorage.getItem('token');

  // FloatingIcon component
  const FloatingIcon = ({ Icon, delay, duration, startX, startY }) => (
    <div
      className="floating-icon"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <Icon size={48} />
    </div>
  );

  // MessageBox component
  const MessageBox = ({ type, text }) => {
    if (!text) return null;
    return (
      <div className={type === 'success' ? 'message-success' : 'message-error'}>
        {type === 'success' ? <DollarSign size={20} /> : <AlertCircle size={20} />}
        <span>{text}</span>
      </div>
    );
  };

  // Get current token for protected pages
  const token = getToken();

  // MAIN PAGE RENDERING
  switch (page) {
    // HOME PAGE
    case 'home':
      return (
        <div className="min-h-screen bg-gradient-pink relative overflow-hidden">
          
          

<FloatingIcon Icon={Coins} delay={0.8} duration={8} startX={14} startY={42} />
<FloatingIcon Icon={CreditCard} delay={1.2} duration={8.5} startX={86} startY={42} />

<FloatingIcon Icon={PiggyBank} delay={1.6} duration={9} startX={14} startY={68} />
<FloatingIcon Icon={Wallet} delay={2} duration={9.5} startX={86} startY={68} />

<FloatingIcon Icon={BarChart3} delay={0.6} duration={7.5} startX={34} startY={10} />
<FloatingIcon Icon={TrendingUp} delay={1.4} duration={8.5} startX={66} startY={10} />

<FloatingIcon Icon={DollarSign} delay={0.7} duration={7.5} startX={34} startY={88} />

<FloatingIcon Icon={PiggyBank} delay={1.5} duration={8.5} startX={66} startY={88} />

<FloatingIcon Icon={BarChart3} delay={0.9} duration={7} startX={40} startY={60} />

<FloatingIcon Icon={CreditCard} delay={0.2} duration={7} startX={8} startY={8} />
<FloatingIcon Icon={Coins} delay={0.6} duration={7.5} startX={92} startY={8} />

<FloatingIcon Icon={Wallet} delay={1.2} duration={8} startX={8} startY={92} />
<FloatingIcon Icon={TrendingUp} delay={1.8} duration={8.5} startX={92} startY={92} />







          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center mb-12 pulse">
              <Wallet size={64} className="text-white mb-4 mx-auto" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">FinanceFlow</h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
                Take control of your financial future. Track expenses, manage budgets, and achieve your financial goals with ease.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <button onClick={() => setPage('login')} className="circle-btn">
                <DollarSign size={48} />
                <span>Login</span>
              </button>

              <button onClick={() => setPage('register')} className="circle-btn">
                <PiggyBank size={48} />
                <span>Register</span>
              </button>
            </div>

            <div className="mt-16 text-center text-white">
              <p className="text-lg">Start your journey to financial freedom today</p>
            </div>
          </div>
        </div>
      );

    // LOGIN PAGE
    case 'login':
      return (
        <div className="min-h-screen bg-gradient-pink flex items-center justify-center px-4 relative overflow-hidden">
          <FloatingIcon Icon={DollarSign} delay={0} duration={6} startX={10} startY={20} />
          <FloatingIcon Icon={TrendingUp} delay={1} duration={7} startX={80} startY={70} />

          <div className="glass rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
            <div className="text-center mb-8">
              <Wallet size={48} className="text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
              <p className="text-white mt-2">Login to manage your finances</p>
            </div>

            <MessageBox type={message.type} text={message.text} />

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-white mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="primary-btn w-full">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { 
                  setPage('home'); 
                  setMessage({ type: '', text: '' }); 
                }}
                className="text-pink font-bold hover:text-pink-200 transition-colors"
              >
                ← Back to Home
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-white">Don't have an account? </span>
              <button
                onClick={() => { 
                  setPage('register'); 
                  setMessage({ type: '', text: '' }); 
                }}
                className="text-pink font-bold hover:text-pink-200 transition-colors"
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      );

    // REGISTER PAGE
    case 'register':
      return (
        <div className="min-h-screen bg-gradient-pink flex items-center justify-center px-4 relative overflow-hidden">
          <FloatingIcon Icon={PiggyBank} delay={0} duration={6} startX={15} startY={25} />
          <FloatingIcon Icon={Wallet} delay={1.5} duration={7} startX={85} startY={65} />

          <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center mb-8">
              <PiggyBank size={48} className="text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="text-white mt-2">Start your financial journey</p>
            </div>

            <MessageBox type={message.type} text={message.text} />

            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block text-white mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password (min 6 characters)"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="primary-btn w-full">
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { 
                  setPage('login'); 
                  setMessage({ type: '', text: '' }); 
                }}
                className="text-pink font-bold hover:text-pink-200 transition-colors"
              >
                Back to Login
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => { 
                  setPage('home'); 
                  setMessage({ type: '', text: '' }); 
                }}
                className="text-pink font-bold hover:text-pink-200 transition-colors text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );

    // DASHBOARD & PROTECTED PAGES
    default:
      if (!user || !token) {
        return <div>Loading...</div>;
      }

      return (
        <>
          {/* Dashboard */}
          {page === 'dashboard' && (
            <Dashboard
              user={user}
              token={token}
              apiUrl={API_BASE_URL}
              onLogout={handleLogout}
              onGoHome={() => setPage('home')}
              onNavigate={setPage}
            />
          )}

          {/* Analytics */}
          {page === 'analytics' && (
            <Analytics
              apiUrl={API_BASE_URL}
              token={token}
              onBack={() => setPage('dashboard')}
            />
          )}

          {/* Update Expenses */}
          {page === 'update-expenses' && (
            <UpdateExpenses
              apiUrl={API_BASE_URL}
              token={token}
              onBack={() => setPage('dashboard')}
            />
          )}

          {/* Expense Sheet */}
          {page === 'expense-sheet' && (
            <ExpenseSheet
              apiUrl={API_BASE_URL}
              token={token}
              onBack={() => setPage('dashboard')}
            />
          )}

          {/* Notifications */}
          {page === 'notifications' && (
            <NotificationsPage
              apiUrl={API_BASE_URL}
              token={token}
              onBack={() => setPage('dashboard')}
            />
          )}

          {/* Reports */}
          {page === 'reports' && (
            <Reports
              apiUrl={API_BASE_URL}
              token={token}
              onBack={() => setPage('dashboard')}
            />
          )}
        </>
      );
  }
};

export default App;
