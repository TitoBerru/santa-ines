"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <AuthProvider>
      <html lang="es">
        <body>
          <div className="page-container">
          {pathname !== "/" && <Navbar />}
            <div className="content-wrap">
              {children}
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
