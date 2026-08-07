import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state to reflect the change immediately
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4 border-b">Order ID</th>
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b">Items</th>
                  <th className="p-4 border-b">Payment</th>
                  <th className="p-4 border-b">Total</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs">
                      {order._id.substring(0, 8)}...
                      {order.cancelReason && (
                        <p className="text-[10px] text-red-600 mt-1 italic">
                          Reason: {order.cancelReason}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="text-sm max-w-xs truncate">
                        {order.items.map(i => `${i.quantity}x ${i.productName || 'Product'}`).join(', ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-700 text-sm">{order.paymentMethod || 'COD'}</span>
                    </td>
                    <td className="p-4 font-bold text-primary">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(order.status)} border-none cursor-pointer`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
