import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div>
            <Link to="/">
              <span className="font-heading font-bold text-2xl text-white tracking-tight mb-4 block">
                Mahadev<span className="text-secondary">Pizza</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Serving the best, fresh, and premium pizzas in town. Experience authentic taste with our special ingredients and love.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Menu', 'Offers', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-gray-400 hover:text-secondary text-sm transition-colors flex items-center">
                    <span className="mr-2 text-primary">›</span> {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <FiMapPin className="text-primary mt-1 mr-3 flex-shrink-0" size={18} />
                <span>123 Pizza Street, Food City, FC 12345</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-primary mr-3 flex-shrink-0" size={18} />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center">
                <FiMail className="text-primary mr-3 flex-shrink-0" size={18} />
                <span>hello@mahadevpizza.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary border border-gray-700 text-sm"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mahadev Pizza Point. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
