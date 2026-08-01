const API_URL = 'http://localhost:5000/api/v1/categories';

export const getCategories = async (all = false) => {
    const url = all ? `${API_URL}/?all=true` : `${API_URL}/`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch categories');
    return data.data;
};

export const createCategory = async (categoryData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create category');
    return data.data;
};

export const updateCategory = async (id, categoryData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update category');
    return data.data;
};

export const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete category');
    return data;
};
