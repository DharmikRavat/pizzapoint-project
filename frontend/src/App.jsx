import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Offers from './pages/customer/Offers';
import About from './pages/customer/About';
import Contact from './pages/customer/Contact';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Dashboard from './pages/customer/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';
import AdminOffers from './pages/admin/AdminOffers';
import AdminAbout from './pages/admin/AdminAbout';

function App() {
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 500);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/about" element={<AdminAbout />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-3xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
