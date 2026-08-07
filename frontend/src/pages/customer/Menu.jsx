import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../../services/productService';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

// Stagger variants for the products grid
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
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="pizza-loader text-6xl mb-6">🍕</div>
          <h2 className="text-2xl font-bold text-gray-600 animate-pulse">Baking your menu...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-12"
        >
            <button onClick={() => navigate(-1)} className="mr-4 text-primary font-bold hover:text-red-700 transition-colors">&larr; Back</button>
            <h1 className="text-4xl font-heading font-bold text-center flex-grow text-dark">Our <span className="text-primary">Menu</span></h1>
        </motion.div>
        
        {/* Categories Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button className="px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-md transform hover:scale-105 transition-transform">All</button>
          {categories.map((cat) => (
            <button key={cat._id} className="px-6 py-2 bg-white text-gray-700 hover:bg-red-50 hover:text-primary rounded-full font-semibold shadow-sm border border-gray-200 transition-all transform hover:scale-105">
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              key={product._id} 
              className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 flex flex-col group transition-shadow duration-300"
            >
              <div className="h-56 bg-gray-100 w-full flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <span className="text-[5rem] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🍕</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-heading font-bold text-gray-800">{product.name}</h3>
                  {product.isVeg ? (
                    <span className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-green-600 rounded-full"></div></span>
                  ) : (
                    <span className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full"></div></span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xl font-bold text-primary">₹{product.discountPrice}</span>
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    )}
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(product)}
                    className="bg-dark text-white font-bold px-5 py-2.5 rounded-xl shadow hover:bg-primary transition-colors flex items-center space-x-1"
                  >
                    <span>Add</span>
                    <span className="text-lg leading-none">+</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Menu;
