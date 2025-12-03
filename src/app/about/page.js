"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSiteSettings } from "@/lib/api";

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutUs() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { success, data, error } = await getSiteSettings();
        if (success && data) {
          setSettings(data);
        } else {
          console.error("Error loading site settings:", error);
          setError("Unable to load content. Please try again later.");
        }
      } catch (err) {
        console.error("Exception loading site settings:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-brand-accent">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 p-8 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-red-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-800 mb-2">Something Went Wrong</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback for no settings
  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-brand-accent">No content available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="relative bg-brand-primary text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{settings.about_hero_title || "About Dream Consultancy"}</h1>
            <p className="text-lg md:text-xl">{settings.about_hero_subtitle || "Empowering students to achieve academic excellence."}</p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-brand-primary mb-6">{settings.about_us_story_title || "Our Story"}</h2>
              <div className="text-gray-700 space-y-4">
                {settings.about_us_story_content ? (
                  settings.about_us_story_content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="mb-4">Story content unavailable.</p>
                )}
              </div>
            </motion.div>
            <motion.div
              className="relative h-96 md:h-full"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Image
                src={settings.about_us_image_url || "/about/office-placeholder.jpg"}
                alt="Dream Consultancy Office"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Our Mission & Vision</h2>
            <div className="h-1 w-20 bg-brand-secondary mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="card p-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="inline-block p-3 bg-brand-primary rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-primary">{settings.about_us_mission_title || "Our Mission"}</h3>
              <p className="text-gray-700">
                {settings.about_us_mission_content || "Mission content unavailable."}
              </p>
            </motion.div>
            
            <motion.div
              className="card p-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="inline-block p-3 bg-brand-secondary rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-brand-primary">{settings.about_us_vision_title || "Our Vision"}</h3>
              <p className="text-gray-700">
                {settings.about_us_vision_content || "Vision content unavailable."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary">Ready to Begin Your Educational Journey?</h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Take the first step towards academic excellence and global opportunities. Our expert team is here to guide you every step of the way.
            </p>
            <Link href="/contact" className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl inline-block mr-4">
              Contact Us
            </Link>
            <Link href="/book-consultation" className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl inline-block">
              Book a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 