const API_URL = 'http://localhost:5000/api/v1/orders';

export const createOrder = async (orderData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create order');
    return data;
};

export const getMyOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data;
};

export const getAllOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch all orders');
    return data;
};

export const updateOrderStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
};

export const cancelOrder = async (id, reason) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to cancel order');
    return data;
};
