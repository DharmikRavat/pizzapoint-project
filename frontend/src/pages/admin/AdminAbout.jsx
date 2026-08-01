import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllContent, createContent, updateContent, deleteContent } from '../../services/contentService';
import { FiPlus, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';

const AdminAbout = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ section: '', title: '', content: '', imageUrl: '', icon: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await getAllContent();
      setContents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateContent(editId, formData);
      } else {
        await createContent(formData);
      }
      fetchContent();
      resetForm();
    } catch (err) {
      alert(err.message || 'Error saving content');
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({
      section: item.section,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || '',
      icon: item.icon || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content section?')) {
      try {
        await deleteContent(id);
        fetchContent();
      } catch (err) {
        alert(err.message || 'Error deleting content');
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ section: '', title: '', content: '', imageUrl: '', icon: '' });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-dark">Manage About Page</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Section' : 'Add New Section'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section ID</label>
                <input required type="text" name="section" value={formData.section} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="e.g. hero, mission, vision" />
                <p className="text-xs text-gray-400 mt-1">Unique identifier for where this goes.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Our Story" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content / Body Text</label>
                <textarea required name="content" value={formData.content} onChange={handleInputChange} rows="5" className="w-full p-2 border rounded-lg" placeholder="Enter the main text here..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Optional)</label>
                <input type="text" name="icon" value={formData.icon} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. FiStar" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-red-600 transition">
                  {isEditing ? 'Update' : 'Add'}
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
              <span>All Content Blocks</span>
              <span>{contents.length} total</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : contents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No content found. Please add a section!</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {contents.map(item => (
                  <div key={item._id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between hover:bg-gray-50 transition gap-4">
                    <div className="flex gap-4 w-full">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <FiFileText size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                          <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">ID: {item.section}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{item.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-start">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
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

export default AdminAbout;
