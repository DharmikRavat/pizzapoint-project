import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-primary font-bold">&larr; Back</button>
          <h1 className="text-3xl font-heading font-bold text-dark">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl text-gray-500 mb-4">Your cart is empty</h2>
            <Link to="/menu" className="btn-primary inline-block">Browse Menu</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-md">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b py-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-500">${(item.discountPrice || item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-xl font-bold text-primary">-</button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-xl font-bold text-primary">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 font-bold px-2 py-1">X</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-md h-fit">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h2>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 border-b pb-4">
                <span className="text-gray-600">Delivery</span>
                <span className="font-bold">$2.99</span>
              </div>
              <div className="flex justify-between mb-8 text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">${(cartTotal + 2.99).toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary block text-center w-full">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
