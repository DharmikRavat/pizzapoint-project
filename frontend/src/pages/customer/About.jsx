import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { getAllContent } from '../../services/contentService';
import { FiHeart, FiClock, FiShield, FiStar, FiFileText } from 'react-icons/fi';

const About = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await getAllContent();
        setContent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Helper to get specific section or fallback
  const getSection = (id) => {
    return content.find(c => c.section === id);
  };

  const heroSection = getSection('hero');
  // Get all sections that are not 'hero' to use as the grid values
  const gridValues = content.filter(c => c.section !== 'hero');

  // Map icon names to React Icons dynamically (basic implementation)
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'FiHeart': return <FiHeart className="text-4xl text-primary" />;
      case 'FiClock': return <FiClock className="text-4xl text-primary" />;
      case 'FiShield': return <FiShield className="text-4xl text-primary" />;
      case 'FiStar': return <FiStar className="text-4xl text-primary" />;
      default: return <FiFileText className="text-4xl text-primary" />;
    }
  };

  return (
    <Layout>
      <div className="bg-light min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {loading ? (
             <div className="flex justify-center h-40 items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : content.length === 0 ? (
             <div className="text-center text-gray-500 py-12">No content available. Please add some via the Admin Panel.</div>
          ) : (
            <>
              {/* Hero Section */}
              {heroSection && (
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto mb-20">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:w-1/2"
                  >
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-dark mb-6">
                      {heroSection.title}
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed whitespace-pre-wrap">
                      {heroSection.content}
                    </p>
                    <button 
                      onClick={() => navigate('/menu')}
                      className="px-8 py-3 bg-primary text-white rounded-full font-bold text-lg hover:bg-red-600 transition shadow-lg hover:shadow-xl"
                    >
                      Taste the Magic
                    </button>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:w-1/2"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-3xl transform translate-x-4 translate-y-4"></div>
                      <img 
                        src={heroSection.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt="About Us" 
                        className="rounded-3xl shadow-xl relative z-10 object-cover h-[400px] w-full"
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Values Section */}
              {gridValues.length > 0 && (
                <>
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-dark mb-4">Our Core Values</h2>
                    <p className="text-gray-600">We don't just make pizzas; we create moments of joy.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {gridValues.map((value, index) => (
                      <motion.div 
                        key={value._id} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg transition text-center group"
                      >
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          {renderIcon(value.icon)}
                        </div>
                        <h3 className="text-2xl font-bold text-dark mb-4">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{value.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default About;
