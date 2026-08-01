import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { updateProfile } from '../../services/authService';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiTxnId, setUpiTxnId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'WELCOME5', type: 'FLAT', value: 5 }
  const [promoError, setPromoError] = useState('');

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-light">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <button onClick={() => navigate('/menu')} className="btn-primary">Go to Menu</button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    
    if (code === 'WELCOME5') {
      setAppliedPromo({ code, type: 'FLAT', value: 5.0 });
    } else if (code === 'WEEKEND20') {
      setAppliedPromo({ code, type: 'PERCENT', value: 20 });
    } else if (code === 'MIDNIGHT') {
      setAppliedPromo({ code, type: 'FREEDELIVERY', value: 0 });
    } else {
      setPromoError('Invalid or expired promo code');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  // Calculate Finals
  let subtotal = cartTotal;
  let deliveryFee = 2.99;
  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === 'FLAT') {
      discount = appliedPromo.value;
    } else if (appliedPromo.type === 'PERCENT') {
      discount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'FREEDELIVERY') {
      deliveryFee = 0;
    }
  }

  let finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please provide a delivery address");
      return;
    }
    if (paymentMethod === 'UPI' && !upiTxnId.trim()) {
      setError("Please provide a UPI Transaction ID");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const orderItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));
      
      let finalPaymentMethod = paymentMethod;
      if (paymentMethod === 'UPI') {
        finalPaymentMethod = `UPI (Txn ID: ${upiTxnId})`;
      }
      
      await createOrder({
        items: orderItems,
        deliveryAddress: address,
        paymentMethod: finalPaymentMethod,
        promoCode: appliedPromo ? appliedPromo.code : ''
      });
      
      // Save address if it's new or changed
      if (user && user.address !== address) {
        try {
          const res = await updateProfile({ address: address });
          if (res.user) setUser(res.user);
        } catch (e) {
          console.error("Failed to save address for future use", e);
        }
      }
      
      clearCart();
      alert("Order placed successfully!");
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4 text-primary font-bold">&larr; Back to Cart</button>
          <h1 className="text-3xl font-heading font-bold text-dark">Checkout</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleCheckout} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Delivery Details</h2>
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}
              
              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-3">Delivery Address</label>
                <textarea 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                  rows="4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address here..."
                  required
                ></textarea>
              </div>
              
              <h2 className="text-2xl font-bold mb-6 mt-8 text-gray-800">Payment Method</h2>
              <div className="mb-6 space-y-4">
                <label className={`p-5 border-2 rounded-xl flex items-center cursor-pointer transition ${paymentMethod === 'COD' ? 'border-primary bg-red-50/30' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === 'COD'} 
                    onChange={() => setPaymentMethod('COD')} 
                    className="mr-4 w-5 h-5 text-primary accent-primary" 
                  />
                  <div>
                    <div className="font-bold text-lg text-gray-800">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-500">Pay when your order arrives</div>
                  </div>
                </label>

                <label className={`p-5 border-2 rounded-xl flex items-center cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-primary bg-red-50/30' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="CARD" 
                    checked={paymentMethod === 'CARD'} 
                    onChange={() => setPaymentMethod('CARD')} 
                    className="mr-4 w-5 h-5 text-primary accent-primary" 
                  />
                  <div>
                    <div className="font-bold text-lg text-gray-800">Credit / Debit Card</div>
                    <div className="text-sm text-gray-500">Mock payment gateway for testing</div>
                  </div>
                </label>

                <label className={`p-5 border-2 rounded-xl flex flex-col cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-primary bg-red-50/30' : 'border-gray-100 hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI" 
                      checked={paymentMethod === 'UPI'} 
                      onChange={() => setPaymentMethod('UPI')} 
                      className="mr-4 w-5 h-5 text-primary accent-primary" 
                    />
                    <div>
                      <div className="font-bold text-lg text-gray-800">UPI (GPay, PhonePe, Paytm)</div>
                      <div className="text-sm text-gray-500">Pay directly via UPI apps</div>
                    </div>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <div className="mt-5 ml-9 p-4 bg-white rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-600 mb-3">Scan QR or Pay to <strong className="text-gray-800">mahadevpizza@upi</strong> and enter the Transaction ID below.</p>
                      <input 
                        type="text" 
                        value={upiTxnId}
                        onChange={(e) => setUpiTxnId(e.target.value)}
                        placeholder="Enter 12-digit UPI Transaction ID"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
                        required={paymentMethod === 'UPI'}
                      />
                    </div>
                  )}
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 bg-primary text-white text-xl font-bold rounded-xl hover:bg-red-600 transition shadow-lg hover:shadow-xl mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Placing Order...' : `Place Order • $${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
             <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-100 pb-4 text-gray-800">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-700">
                    <span className="flex items-center">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2 font-medium">{item.quantity}x</span> 
                      {item.name}
                    </span>
                    <span className="font-medium">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Have a Promo Code?</h3>
                {!appliedPromo ? (
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary uppercase text-sm"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-dark text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center text-green-700 text-sm font-medium">
                      <FiCheckCircle className="mr-2" />
                      Code "{appliedPromo.code}" applied!
                    </div>
                    <button onClick={handleRemovePromo} className="text-red-500 hover:text-red-700" title="Remove">
                      <FiXCircle size={18} />
                    </button>
                  </div>
                )}
                {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 text-gray-700">
                <div className="flex justify-between mb-3 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between mb-3 text-sm text-green-600 font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between mb-4 text-sm">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center font-bold text-xl pt-4 border-t border-gray-100 text-gray-800">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
