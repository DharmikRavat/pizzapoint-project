import api from '../utils/api';

export const getProducts = async (categorySlug = null) => {
    try {
        const url = categorySlug ? `/products/?category=${categorySlug}` : '/products/';
        const response = await api.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching products", error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/categories/');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching categories", error);
        throw error;
    }
};
