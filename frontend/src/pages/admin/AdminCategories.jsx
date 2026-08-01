import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', status: 'active' });

  const fetchCategories = async () => {
    try {
      // Pass all=true to get both active and inactive categories for the admin panel
      const data = await getCategories(true);
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormData({ id: null, name: '', description: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setFormData({ 
      id: cat.id, 
      name: cat.name, 
      description: cat.description || '', 
      status: cat.status 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status
      };

      if (formData.id) {
        await updateCategory(formData.id, payload);
      } else {
        await createCategory(payload);
      }
      
      setShowModal(false);
      fetchCategories();
    } catch (e) {
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this category? This might affect products linked to it.")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (e) {
        alert("Failed to delete category");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">+ Add Category</button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Description</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No categories found.</td></tr>
              ) : categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-500">#{cat.id}</td>
                  <td className="p-4 font-semibold">{cat.name}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{cat.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${cat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline px-2 py-1 bg-red-50 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Category Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none" placeholder="e.g. Veg Pizza" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none" placeholder="Category description..."></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-red-600 transition">{formData.id ? 'Save Changes' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
