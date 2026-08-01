import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
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
        setUser(data.user);
        if (data.user.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/login-bg.png" 
          alt="Delicious Pizza" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full p-12 text-center text-white">
          <h1 className="text-5xl font-extrabold font-heading mb-4 text-white drop-shadow-lg">
            Mahadev<span className="text-primary">Pizza</span>
          </h1>
          <p className="text-xl font-medium text-gray-200 drop-shadow-md">
            The authentic taste of wood-fired perfection.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-12 relative">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 border border-gray-100">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-red-700">Forgot password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:text-red-700 transition">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
