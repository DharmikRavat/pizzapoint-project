import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      if (data.status === 'success') {
        if (data.user.role === 'Admin') {
          setUser(data.user);
          navigate('/admin');
        } else {
          // Valid credentials, but not an admin
          setError('Access denied: Administrator privileges required.');
        }
      }
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements for Admin Login */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative z-10 border border-gray-700">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-inner">
               <span className="text-2xl">🔒</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Secure login for authorized personnel only
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/30 p-4 rounded-lg font-medium border border-red-800/50">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Email</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="admin@pizzapoint.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition">
            &larr; Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
