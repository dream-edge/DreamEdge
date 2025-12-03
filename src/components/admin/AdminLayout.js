"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-bg">
      <nav className="bg-white border-b border-brand-secondary-200 fixed w-full z-30 shadow-sm">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link href="/admin" className="text-xl font-bold flex items-center lg:ml-2.5">
                <span className="self-center whitespace-nowrap text-brand-primary">Dream Consultancy Admin</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-brand-dark hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex overflow-hidden pt-16">
        <aside className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75">
          <div className="relative flex-1 flex flex-col min-h-0 border-r border-brand-secondary-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 bg-white divide-y space-y-1">
                <ul className="space-y-2 pb-2">
                  <li>
                    <Link href="/admin" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/services" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Services</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/universities" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Universities</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/study-destinations" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Study Destinations</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/testimonials" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Testimonials</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/faqs" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">FAQs</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/test-prep" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Test Prep Courses</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/settings" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Site Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/homepage-content" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-3">Homepage Content</span>
                    </Link>
                  </li>
                  <li className="pt-2">
                    <span className="ml-3 text-xs font-semibold text-brand-primary uppercase tracking-wider">Leads Management</span>
                  </li>
                  <li>
                    <Link href="/admin/inquiries" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-6">Contact Inquiries</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/consultations" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-6">Consultations</span>
                    </Link>
                  </li>
                  <li className="pt-2">
                    <span className="ml-3 text-xs font-semibold text-brand-primary uppercase tracking-wider">Form Options</span>
                  </li>
                  <li>
                    <Link href="/admin/form-options/time-slots" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-6">Time Slots</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/form-options/education-levels" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-6">Education Levels</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/form-options/study-interests" className="text-base text-brand-dark font-normal rounded-lg flex items-center p-2 hover:bg-brand-secondary-100 hover:text-brand-primary group">
                      <span className="ml-6">Study Interests</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
        
        <div className="bg-neutral-bg lg:ml-64 overflow-y-auto h-screen pt-8 px-6">
          <main className="h-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 