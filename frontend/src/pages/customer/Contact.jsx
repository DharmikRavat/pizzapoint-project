import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { submitContactMessage } from '../../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      const res = await submitContactMessage(formData);
      setSuccessMsg(res.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
              Get in <span className="text-primary">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-2xl mx-auto text-lg"
            >
              Have a question, feedback, or a special request? We'd love to hear from you. Drop us a message below!
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Contact Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/3 space-y-6"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-14 h-14 bg-red-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiMapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">Our Location</h3>
                <p className="text-gray-600">Rajkot Kankaot Road, Sonal Park, Shri No 1, Gujarat, India</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiPhone size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">Call Us</h3>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-gray-500 text-sm mt-1">Mon-Sun: 10am - 11pm</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiMail size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">Email Us</h3>
                <p className="text-gray-600">hello@mahadevpizza.com</p>
                <p className="text-gray-500 text-sm mt-1">We reply within 24 hours</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-2/3"
            >
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <h2 className="text-3xl font-bold text-dark mb-8 relative z-10">Send a Message</h2>
                
                {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 font-medium relative z-10">{successMsg}</div>}
                {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium relative z-10">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Your Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-primary/40 flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    {!loading && <FiSend size={20} />}
                  </motion.button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
