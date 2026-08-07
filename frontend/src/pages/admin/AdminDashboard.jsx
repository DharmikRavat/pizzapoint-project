import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getAdminDashboardStats, getAllCustomers } from '../../services/adminService';
import { getAllOrders } from '../../services/orderService';
import { motion } from 'framer-motion';
import { FiUsers, FiBox, FiList, FiShoppingCart, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, ordersData, customersData] = await Promise.all([
          getAdminDashboardStats(),
          getAllOrders().catch(() => ({ data: [] })),
          getAllCustomers().catch(() => [])
        ]);
        
        setStats(statsData);
        
        // Get top 5 recent orders
        const orders = ordersData.data || [];
        setRecentOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
        
        // Get top 5 recent customers
        const customers = Array.isArray(customersData) ? customersData : [];
        setRecentCustomers(customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

      } catch (error) {
        console.error("Failed to load admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </AdminLayout>
  );

  if (!stats) return (
    <AdminLayout>
      <div className="p-8 text-center text-red-500">Failed to load statistics. Please try again.</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-dark">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<FiUsers size={24} />} color="bg-blue-50 text-blue-600" to="/admin/customers" delay={0.1} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={<FiBox size={24} />} color="bg-orange-50 text-orange-600" to="/admin/products" delay={0.2} />
        <StatCard title="Categories" value={stats.totalCategories} icon={<FiList size={24} />} color="bg-purple-50 text-purple-600" to="/admin/categories" delay={0.3} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingCart size={24} />} color="bg-pink-50 text-pink-600" to="/admin/orders" delay={0.4} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<FiDollarSign size={24} />} color="bg-green-50 text-green-600" to="/admin/orders" delay={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-dark">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:text-red-700 transition">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  <th className="p-4 border-b">Order ID</th>
                  <th className="p-4 border-b">Customer</th>
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b">Amount</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No recent orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr key={order._id} className={`hover:bg-gray-50 transition-colors ${index !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <td className="p-4 font-mono text-sm text-gray-600">#{order._id.substring(order._id.length - 6)}</td>
                      <td className="p-4 font-semibold text-dark">User {order.userId.substring(order.userId.length - 4)}</td>
                      <td className="p-4 text-sm text-gray-500 flex items-center gap-1"><FiClock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-dark">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Customers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-dark">New Customers</h2>
            <Link to="/admin/customers" className="text-sm font-semibold text-primary hover:text-red-700 transition">View All</Link>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {recentCustomers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">No recent customers.</div>
            ) : (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer._id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-orange-400 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {(customer.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1 truncate">
                      <h4 className="font-bold text-dark text-sm truncate">{customer.fullName || 'Unknown User'}</h4>
                      <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                    </div>
                    <FiCheckCircle className="text-green-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon, color, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
  >
    <Link to={to} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer h-full relative overflow-hidden">
      {/* Decorative background circle */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${color.split(' ')[0]}`}></div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1 ${color}`}>
        {icon}
      </div>
      <div className="mt-auto">
        <h3 className="text-3xl font-extrabold text-dark mb-1">{value}</h3>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      </div>
    </Link>
  </motion.div>
);

export default AdminDashboard;
