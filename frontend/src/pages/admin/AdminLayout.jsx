import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '🍕' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/customers', label: 'Customers', icon: '👥' },
    { path: '/admin/offers', label: 'Offers', icon: '🏷️' },
    { path: '/admin/about', label: 'About', icon: '📝' },
    { path: '/admin/contacts', label: 'Contacts', icon: '📩' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-red-500">Mahadev<span className="text-yellow-400">Pizza</span></h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                    location.pathname === item.path ? 'bg-red-600 text-white border-l-4 border-red-500' : ''
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ⬅️ Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
          </h1>
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                A
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
