import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getProducts } from '../../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', categoryId: 1, isAvailable: true, description: '', image: null });

  const fetchProds = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProds();
  }, []);

  const openAddModal = () => {
    setFormData({ id: null, name: '', price: '', categoryId: 1, isAvailable: true, description: '', image: null });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({ 
      id: product._id, 
      name: product.name, 
      price: product.price, 
      categoryId: product.categoryId || 1, 
      isAvailable: product.isAvailable,
      description: product.description || '',
      image: null // We only store new images here
    });
    setShowModal(true);
  };

  const FOOD_IMAGES = {
    pizza: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop"
    ],
    burger: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=500&auto=format&fit=crop"
    ],
    pasta: [
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop"
    ],
    salad: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop"
    ],
    drink: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500&auto=format&fit=crop"
    ],
    default: [
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop"
    ]
  };

  const getAutoImage = (name) => {
    if (!name) return null;
    const lower = name.toLowerCase();
    let category = 'default';
    if (lower.includes('pizza') || lower.includes('margherita') || lower.includes('cheese')) category = 'pizza';
    else if (lower.includes('burger') || lower.includes('tikki')) category = 'burger';
    else if (lower.includes('pasta') || lower.includes('macaroni')) category = 'pasta';
    else if (lower.includes('salad')) category = 'salad';
    else if (lower.includes('drink') || lower.includes('cola')) category = 'drink';
    
    const index = name.length % FOOD_IMAGES[category].length;
    return FOOD_IMAGES[category][index];
  };

  const autoImageUrl = getAutoImage(formData.name);
  const existingImage = formData.id ? products.find(p => p._id === formData.id)?.image : null;
  const displayImage = formData.image ? URL.createObjectURL(formData.image) : (existingImage || autoImageUrl || "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500&auto=format&fit=crop");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', formData.price);
      payload.append('categoryId', formData.categoryId);
      payload.append('isAvailable', formData.isAvailable);
      payload.append('description', formData.description);
      if (formData.image) {
        payload.append('image', formData.image);
      } else if (!formData.id && autoImageUrl) {
        payload.append('imageUrl', autoImageUrl);
      }

      if (formData.id) {
        // Edit logic
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${baseUrl}/api/v1/products/${formData.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: payload
        });
      } else {
        // Add logic
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${baseUrl}/api/v1/products/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: payload
        });
      }
      
      setShowModal(false);
      fetchProds();
    } catch (e) {
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${baseUrl}/api/v1/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProducts(products.filter(p => p._id !== id));
      } catch (e) {
        alert("Failed to delete");
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, image: e.target.files[0]});
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">+ Add Product</button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Price</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img src={p.image || "https://via.placeholder.com/50"} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4">₹{p.discountPrice || p.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${p.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => openEditModal(p)} className="text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline px-2 py-1 bg-red-50 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none" placeholder="e.g. Cheese Pizza" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Price (₹)</label>
                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none" placeholder="10.99" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded focus:ring focus:ring-primary focus:outline-none" placeholder="Product description..."></textarea>
              </div>
              <div className="mb-6 flex items-center border-b pb-4">
                <input type="checkbox" id="isAvailable" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} className="mr-2" />
                <label htmlFor="isAvailable" className="text-gray-700 font-semibold">Is Available</label>
              </div>
              
              <div className="mb-6 flex flex-col items-center">
                <label className="block text-gray-700 mb-2 font-semibold w-full">Product Image</label>
                <div className="flex w-full items-center space-x-4">
                  <img src={displayImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">{!formData.image && !formData.id && formData.name ? 'Auto-generated image from name' : 'Upload custom image (optional)'}</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded focus:outline-none text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-red-600 transition">{formData.id ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
