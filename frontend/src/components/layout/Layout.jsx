import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
