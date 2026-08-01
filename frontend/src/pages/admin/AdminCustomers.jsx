import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllCustomers } from '../../services/adminService';
import { FiSearch, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "No customers found matching your search." : "No customers registered yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">Customer Details</th>
                  <th className="p-4 font-semibold border-b">Contact Info</th>
                  <th className="p-4 font-semibold border-b">Joined Date</th>
                  <th className="p-4 font-semibold border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-primary flex items-center justify-center font-bold">
                          {customer.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{customer.fullName}</p>
                          <p className="text-xs text-gray-500">ID: {customer._id.substring(customer._id.length - 6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMail className="mr-2 text-gray-400" /> {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiPhone className="mr-2 text-gray-400" /> {customer.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-2 text-gray-400" />
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {customer.isVerified ? 'Verified' : 'Unverified'}
                      </span>
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

export default AdminCustomers;
