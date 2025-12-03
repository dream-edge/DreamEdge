"use client";

import { Inter } from "next/font/google";
import "./globals.css";
// Header and Footer are now imported within AppLayoutClient
// import Header from "@/components/layout/Header"; 
// import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/api"; // Assuming api.js is now correctly referenced from here
import AppLayoutClient from "@/components/layout/AppLayoutClient"; // Import the new component
import { Toaster } from 'react-hot-toast';
import BucketInitializer from '@/components/admin/BucketInitializer';
import AnimationProvider from "@/components/layout/AnimationProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // This CSS variable is used in globals.css
  display: 'swap',
});

// export const metadata = {
//   title: "Dream Consultancy - Your Future Starts Here",
//   description: "Expert guidance for Nepali students aspiring to study in the UK. University selection, test preparation, visa assistance, and more.",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} custom-scrollbar`}>
      <body className={`antialiased flex flex-col min-h-screen text-brand-dark bg-brand-light`}>
        <BucketInitializer />
        <Toaster position="bottom-right" toastOptions={{ 
          duration: 3000,
          style: {
            background: 'var(--white)',
            color: 'var(--brand-dark)',
          },
        }} />
        <AnimationProvider>
          <AppLayoutClient>
            {children}
          </AppLayoutClient>
        </AnimationProvider>
      </body>
    </html>
  );
}
