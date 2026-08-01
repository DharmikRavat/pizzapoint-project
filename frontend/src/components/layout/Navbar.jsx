import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/">
              <span className="font-heading font-bold text-2xl text-primary tracking-tight">
                Mahadev<span className="text-secondary">Pizza</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions: Search, Cart, Login, Register */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-primary transition-colors">
              <FiSearch size={22} />
            </button>
            <Link to="/cart" className="relative cursor-pointer text-gray-600 hover:text-primary transition-colors">
              <FiShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              {user ? (
                <>
                  <Link to={user.role === 'Admin' ? "/admin" : "/dashboard"} className="text-gray-700 font-medium hover:text-primary transition-colors">
                    {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 font-medium hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm shadow-primary/30"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative cursor-pointer text-gray-600">
              <FiShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-3 px-3">
                {user ? (
                  <>
                    <Link
                      to={user.role === 'Admin' ? "/admin" : "/dashboard"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 shadow-sm"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
