import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pizza_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('pizza_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(cart.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ));
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
