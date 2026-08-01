import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { getMyOrders, cancelOrder } from '../../services/orderService';
import { updateProfile } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiSettings, FiGrid, FiClock, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, logout } = useAuth();
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', address: '' });

  const [cancelingOrder, setCancelingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile(profileForm);
      if (res.user) {
        setUser(res.user);
      }
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    setIsCanceling(true);
    try {
      await cancelOrder(cancelingOrder._id, cancelReason);
      setOrders(orders.map(o => 
        o._id === cancelingOrder._id ? { ...o, status: 'Cancelled', cancelReason: cancelReason } : o
      ));
      setCancelingOrder(null);
      setCancelReason('');
    } catch (err) {
      alert("Failed to cancel order: " + err.message);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleOrderAgain = (order) => {
    clearCart();
    order.items.forEach(item => {
      // Reconstruct product object needed by CartContext
      const cartItem = {
        _id: item.productId,
        name: item.productName,
        price: item.price
      };
      // Add multiple times to match quantity
      for (let i = 0; i < item.quantity; i++) {
        addToCart(cartItem);
      }
    });
    navigate('/checkout');
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const totalSpent = orders.filter(o => o.status === 'Delivered').reduce((sum, order) => sum + order.totalAmount, 0);
  
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center sticky top-24">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-red-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 font-bold shadow-md">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.fullName}</h2>
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
              
              <div className="flex flex-col space-y-2 text-left">
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-red-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiGrid /> <span>Overview</span>
                </button>
                <button 
                  onClick={() => setActiveTab('orders')} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-red-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiShoppingBag /> <span>My Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-red-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiSettings /> <span>Settings</span>
                </button>
              </div>

              <div className="border-t mt-6 pt-6">
                <button onClick={() => { logout(); navigate('/'); }} className="w-full py-2.5 rounded-xl text-red-600 font-medium hover:bg-red-50 transition">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-800">Welcome back, {user?.fullName?.split(' ')[0]}!</h2>
                <p className="text-gray-500">Member since {memberSince}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                      <FiShoppingBag />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                      <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                      <FiClock />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Active Orders</p>
                      <h3 className="text-2xl font-bold text-gray-800">{activeOrders}</h3>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                      <FiDollarSign />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                      <h3 className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</h3>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  {orders.length > 0 ? (
                    <div className="text-gray-600">
                      Your last order was placed on {new Date(orders[0].createdAt).toLocaleDateString()} for ${orders[0].totalAmount.toFixed(2)}.
                      <button onClick={() => setActiveTab('orders')} className="text-primary font-medium ml-2 hover:underline">View all orders</button>
                    </div>
                  ) : (
                    <div className="text-gray-500">You haven't placed any orders yet. <button onClick={() => navigate('/menu')} className="text-primary font-medium hover:underline">Explore Menu</button></div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-extrabold mb-6">Order History</h2>
                
                {loading ? (
                  <div className="text-center py-12 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍕</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't tasted our delicious pizzas yet!</p>
                    <button onClick={() => navigate('/menu')} className="btn-primary">Order Now</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order._id} className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <p className="font-bold text-lg text-gray-800">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="text-left sm:text-right mt-2 sm:mt-0">
                            <p className="font-bold text-xl text-primary">${order.totalAmount.toFixed(2)}</p>
                            <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-medium ${
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-gray-700 items-center">
                              <span className="flex items-center space-x-2">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{item.quantity}x</span>
                                <span>{item.productName}</span>
                              </span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {order.cancelReason && (
                          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            <strong>Cancellation Reason:</strong> {order.cancelReason}
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button 
                              onClick={() => setCancelingOrder(order)} 
                              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium border border-transparent hover:border-red-200"
                            >
                              Cancel Order
                            </button>
                          )}
                          {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                            <button 
                              onClick={() => handleOrderAgain(order)}
                              className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:bg-red-600 transition font-medium shadow-sm hover:shadow"
                            >
                              Order Again
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-extrabold mb-6">Account Settings</h2>
                <form onSubmit={handleProfileUpdate} className="max-w-xl">
                  <div className="mb-5">
                    <label className="block text-gray-700 mb-2 font-semibold">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={profileForm.fullName} 
                      onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} 
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition outline-none" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-gray-700 mb-2 font-semibold">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileForm.phone} 
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition outline-none" 
                      placeholder="+1 234 567 8900" 
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Saved Delivery Address</label>
                    <textarea 
                      rows="4" 
                      value={profileForm.address} 
                      onChange={e => setProfileForm({...profileForm, address: e.target.value})} 
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition outline-none resize-none" 
                      placeholder="Your complete address..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2">This address will be auto-filled during checkout.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className={`px-8 py-3 bg-primary text-white rounded-xl hover:bg-red-600 transition font-bold shadow-md hover:shadow-lg ${isSaving ? 'opacity-70' : ''}`}
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-extrabold mb-2 text-gray-800">Cancel Order</h2>
            <p className="text-gray-500 mb-6">Order #{cancelingOrder._id.substring(cancelingOrder._id.length - 6).toUpperCase()}</p>
            <form onSubmit={handleCancelOrder}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Reason for Cancellation</label>
                <textarea 
                  rows="3" 
                  required
                  value={cancelReason} 
                  onChange={e => setCancelReason(e.target.value)} 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none" 
                  placeholder="Tell us why you are canceling this order..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => { setCancelingOrder(null); setCancelReason(''); }} 
                  disabled={isCanceling}
                  className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition font-medium"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  disabled={isCanceling}
                  className={`px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md transition font-medium ${isCanceling ? 'opacity-70' : ''}`}
                >
                  {isCanceling ? 'Canceling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

