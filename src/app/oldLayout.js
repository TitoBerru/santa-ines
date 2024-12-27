"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
 
      <html lang="es">
    
        <body>
      
          <div className="page-container">
       
            <Navbar /> <div className="content-wrap"> {children} </div>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
