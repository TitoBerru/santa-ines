"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
    </AuthProvider>
  );
}
