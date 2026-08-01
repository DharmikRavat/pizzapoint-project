import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../../services/contentService';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', discountCode: '', discountPercentage: '', imageUrl: '', isActive: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await getOffers();
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateOffer(editId, formData);
      } else {
        await createOffer(formData);
      }
      fetchOffers();
      resetForm();
    } catch (err) {
      alert(err.message || 'Error saving offer');
    }
  };

  const handleEdit = (offer) => {
    setIsEditing(true);
    setEditId(offer._id);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discountCode: offer.discountCode || '',
      discountPercentage: offer.discountPercentage || '',
      imageUrl: offer.imageUrl || '',
      isActive: offer.isActive
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOffer(id);
        fetchOffers();
      } catch (err) {
        alert(err.message || 'Error deleting offer');
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', discountCode: '', discountPercentage: '', imageUrl: '', isActive: true });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Manage Offers</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Offer' : 'Add New Offer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. 50% Off Weekend" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="Details about the offer..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                  <input type="text" name="discountCode" value={formData.discountCode} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. SAVE50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} id="isActive" className="rounded" />
                <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Is Active?</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-red-600 transition">
                  {isEditing ? 'Update Offer' : 'Add Offer'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex justify-between">
              <span>All Offers</span>
              <span>{offers.length} total</span>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : offers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No offers found. Add some!</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {offers.map(offer => (
                  <div key={offer._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {offer.imageUrl ? <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" /> : <FiTag size={24} className="text-gray-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {offer.title} 
                          {!offer.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactive</span>}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{offer.description}</p>
                        <div className="flex gap-3 mt-1 text-xs font-semibold">
                          {offer.discountCode && <span className="bg-green-100 text-green-700 px-2 rounded">Code: {offer.discountCode}</span>}
                          {offer.discountPercentage && <span className="bg-blue-100 text-blue-700 px-2 rounded">{offer.discountPercentage}% OFF</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(offer._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
