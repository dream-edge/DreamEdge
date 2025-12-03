"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { LoadingSpinner } from "./UI";

export default function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Use useMemo for the publicPaths array to fix the dependency warning
  const publicPaths = useMemo(() => [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
  ], []); // Empty dependency array since it doesn't depend on any external values

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for public paths
        if (publicPaths.includes(pathname)) {
          setLoading(false);
          return;
        }

        // Check for active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          // No active session, redirect to login
          throw new Error("No active session");
        }
        
        // Check if user is in admin_users table with role=admin
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .eq("role", "admin")
          .single();
        
        if (adminError || !adminUser) {
          // User is not an admin, sign them out
          await supabase.auth.signOut();
          throw new Error("Not authorized as admin");
        }
        
        // User is authenticated and authorized as admin
        setAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        
        // If not on a public path, redirect to login
        if (!publicPaths.includes(pathname)) {
          router.push("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && !publicPaths.includes(pathname)) {
        router.push("/admin/login");
      } else if (event === 'SIGNED_IN') {
        checkAuth();
      }
    });
    
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router, publicPaths]);
  
  // If on a public path, don't show loading spinner
  if (publicPaths.includes(pathname)) {
    return children;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!authenticated && !publicPaths.includes(pathname)) {
    return null; // Will redirect in useEffect
  }
  
  return children;
} 