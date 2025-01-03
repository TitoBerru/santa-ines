'use client';
import React from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import Navbar2 from '@/components/Navbar2';
import Footer from '@/components/Footer';
import './globals.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <AuthProvider>
      <html lang="es">
        <body>
          <div className="page-container">
            {pathname !== '/' && <Navbar2 />}
            <div className="content-wrap">{children}</div>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}

// Agregar validación de PropTypes
RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
