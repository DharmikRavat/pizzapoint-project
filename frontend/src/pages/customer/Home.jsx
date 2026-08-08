import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiPercent, FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';

const categories = [
  { name: 'Veg Pizza', icon: '🥦' },
  { name: 'Non-Veg', icon: '🍗' },
  { name: 'Cheese Burst', icon: '🧀' },
  { name: 'Combos', icon: '🍕' },
  { name: 'Garlic Bread', icon: '🥖' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Drinks', icon: '🥤' },
];

const featuredPizzas = [
  {
    id: 1,
    name: 'Margherita Extra',
    desc: 'Classic delight with 100% real mozzarella cheese.',
    price: 1078,
    rating: 4.8,
    discount: '20% OFF',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Pepperoni Paradise',
    desc: 'Loaded with pepperoni and extra cheese.',
    price: 1327,
    rating: 4.9,
    discount: null,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Veggie Supreme',
    desc: 'Black olives, capsicum, onion, grilled mushroom, corn, jalapeño.',
    price: 1244,
    rating: 4.7,
    discount: '15% OFF',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
  },
];

// Stagger variants for the category grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const prods = await getProducts();
        // Just take the first 3 products to feature on the homepage
        setFeaturedProducts(prods.slice(0, 3));
      } catch (error) {
        console.error("Failed to load featured products", error);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary font-semibold text-sm mb-4">
                  🍕 Best Pizza in Town
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-dark leading-tight mb-6">
                  Handcrafted <br />
                  <span className="text-primary">Delicious</span> Pizza.
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                  Experience the taste of authentic, fresh, and hot pizza delivered straight to your door in 30 minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/menu">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto text-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-primary/40"
                    >
                      Order Now
                    </motion.button>
                  </Link>
                  <Link to="/menu">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto text-center bg-white hover:bg-gray-50 text-dark border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-sm"
                    >
                      Explore Menu
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="relative z-10 w-full max-w-lg mx-auto"
              >
                <div className="w-full aspect-square bg-gradient-to-tr from-secondary/40 to-primary/40 rounded-full shadow-2xl flex items-center justify-center border-8 border-white/50 backdrop-blur-sm relative overflow-hidden">
                   <img src="/hero-pizza.png" alt="Delicious Pizza" className="w-[85%] h-[85%] object-contain animate-spin-slow origin-center drop-shadow-2xl" />
                </div>

                <motion.div 
                  initial={{ y: 50, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.8, type: "spring" }} 
                  className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 hover:scale-105 transition-transform"
                >
                  <div className="bg-success/20 p-2 rounded-full text-success"><FiClock size={24} /></div>
                  <div><p className="text-xs text-gray-500 font-semibold uppercase">Delivery</p><p className="font-bold text-dark">30 Mins</p></div>
                </motion.div>

                <motion.div 
                  initial={{ y: -50, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 1, type: "spring" }} 
                  className="absolute top-1/2 -right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 hover:scale-105 transition-transform"
                >
                  <div className="bg-secondary/20 p-2 rounded-full text-secondary"><FiStar size={24} /></div>
                  <div><p className="text-xs text-gray-500 font-semibold uppercase">Rating</p><p className="font-bold text-dark">4.9/5.0</p></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Our Categories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Explore our wide variety of handcrafted pizzas, sides, and beverages.</p>
          </div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-light p-6 rounded-2xl text-center cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 bg-gradient-to-b hover:from-white hover:to-primary/5"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-dark text-sm">{cat.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Pizza Section */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Featured Pizzas</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our most popular and highly rated pizzas by customers.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((pizza, idx) => {
              const discountStr = pizza.discountPrice && pizza.price 
                ? `${Math.round(((pizza.price - pizza.discountPrice) / pizza.price) * 100)}% OFF` 
                : null;
                
              return (
              <motion.div
                key={pizza._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -15 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group"
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex space-x-2">
                  <span className={`w-3 h-3 rounded-full border-2 ${pizza.isVeg ? 'border-success bg-success/20' : 'border-primary bg-primary/20'}`}></span>
                  {discountStr && (
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                      {discountStr}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                  <button className="bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-primary transition-colors block">
                    <FiHeart size={18} />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-primary transition-colors block">
                    <FiEye size={18} />
                  </button>
                </div>

                <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                   {pizza.image ? (
                     <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500" />
                   ) : (
                     <span className="text-[5rem] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🍕</span>
                   )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-xl text-dark line-clamp-1">{pizza.name}</h3>
                    <div className="flex items-center space-x-1 text-secondary">
                      <FiStar className="fill-current" size={14} />
                      <span className="text-sm font-bold text-dark">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 min-h-[40px] line-clamp-2">{pizza.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                      {pizza.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-primary">₹{pizza.discountPrice}</span>
                          <span className="text-sm text-gray-400 line-through">₹{pizza.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">₹{pizza.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(pizza)}
                      className="bg-dark hover:bg-primary text-white p-3 rounded-xl transition-colors shadow-md hover:shadow-primary/40 flex items-center space-x-2 transform active:scale-95"
                    >
                      <FiShoppingCart size={18} />
                      <span className="text-sm font-semibold">Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
