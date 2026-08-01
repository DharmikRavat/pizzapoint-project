import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { getOffers } from '../../services/contentService';
import { FiTag, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await getOffers();
        setOffers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <Layout>
      <div className="bg-light min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-extrabold text-dark mb-4"
            >
              Special <span className="text-primary">Offers</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-2xl mx-auto text-lg"
            >
              Grab the best deals on your favorite pizzas! 
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center h-40 items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No active offers at the moment. Please check back later!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offers.map((offer, index) => {
                const colors = [
                  'bg-gradient-to-r from-red-500 to-red-600',
                  'bg-gradient-to-r from-blue-500 to-blue-600',
                  'bg-gradient-to-r from-fuchsia-500 to-pink-500',
                  'bg-gradient-to-r from-emerald-500 to-teal-500'
                ];
                const bgClass = colors[index % colors.length];
                
                const icons = [
                  <FiTag className="text-white opacity-80" size={32} />,
                  <div className="text-white opacity-80 font-bold text-2xl">%</div>,
                  <FiClock className="text-white opacity-80" size={32} />,
                  <FiTag className="text-white opacity-80" size={32} />
                ];
                // Using different icons for the specific cards based on screenshot (Gift for BOGO, % for Weekend, Clock for Midnight, Tag for First Order)
                let icon;
                if (index === 0) icon = <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>; // Gift
                else if (index === 1) icon = <div className="text-white opacity-80 font-bold text-2xl">%</div>;
                else if (index === 2) icon = <FiClock className="text-white opacity-80" size={32} />;
                else icon = <FiTag className="text-white opacity-80" size={32} />;

                return (
                  <motion.div 
                    key={offer._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group flex flex-col"
                  >
                    <div className={`p-8 ${bgClass} flex justify-between items-start`}>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{offer.title}</h3>
                        <p className="text-white/80 text-sm font-medium">Limited Time Only</p>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <p className="text-gray-600 mb-8 flex-1">{offer.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm">Promo Code:</span>
                          <span className="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1 rounded font-mono font-bold text-sm">
                            {offer.discountCode}
                          </span>
                        </div>
                        <button onClick={() => navigate('/menu')} className="bg-[#1e293b] text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-colors shadow-md">
                          Order Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
