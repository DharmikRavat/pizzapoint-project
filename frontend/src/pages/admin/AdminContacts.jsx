import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllContactMessages, updateMessageStatus } from '../../services/contactService';
import { FiMail, FiCheck, FiX, FiClock } from 'react-icons/fi';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getAllContactMessages();
      setMessages(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMessageStatus(id, newStatus);
      fetchMessages();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Unread':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Unread</span>;
      case 'Read':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Read</span>;
      case 'Resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Resolved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Contact Messages</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Messages List */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">Inbox ({messages.length})</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No messages found.</div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg._id} 
                    onClick={() => {
                        setSelectedMessage(msg);
                        if(msg.status === 'Unread') handleStatusChange(msg._id, 'Read');
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${selectedMessage?._id === msg._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''} ${msg.status === 'Unread' ? 'bg-white font-bold' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-gray-800">{msg.name}</div>
                      <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-gray-600 truncate mb-2">{msg.subject}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400 truncate w-3/4">{msg.message}</div>
                      <div>{getStatusBadge(msg.status)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:w-1/2">
          {selectedMessage ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-1">{selectedMessage.subject}</h2>
                  <div className="text-gray-600 flex items-center gap-2">
                    <span className="font-semibold">{selectedMessage.name}</span>
                    <span className="text-gray-400 text-sm">&lt;{selectedMessage.email}&gt;</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <FiClock /> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 mb-8 whitespace-pre-wrap min-h-[200px]">
                {selectedMessage.message}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-600">Mark as:</span>
                <button 
                  onClick={() => handleStatusChange(selectedMessage._id, 'Read')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMessage.status === 'Read' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FiMail className="inline mr-1"/> Read
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedMessage._id, 'Resolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMessage.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <FiCheck className="inline mr-1"/> Resolved
                </button>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="ml-auto px-6 py-2 bg-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 border-dashed h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
              <FiMail size={48} className="mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
