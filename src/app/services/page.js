"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getServices } from '@/lib/api';
import { ChevronRightIcon, AcademicCapIcon, BriefcaseIcon, LightBulbIcon, UserGroupIcon, GlobeAltIcon, DocumentTextIcon } from '@/components/icons/CommonIcons.js';
import React from 'react';

// Metadata cannot be exported from a Client Component. 
// It should be handled in a parent Server Component (e.g., layout.js)
// or was previously in the now-deleted metadata.js for this route.

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Map icon names to icon components
const iconMapping = {
  'academic-cap': <AcademicCapIcon className="w-10 h-10 text-brand-secondary mb-4" />,
  'document-text': <DocumentTextIcon className="w-10 h-10 text-brand-secondary mb-4" />,
  'briefcase': <BriefcaseIcon className="w-10 h-10 text-brand-secondary mb-4" />,
  'light-bulb': <LightBulbIcon className="w-10 h-10 text-brand-secondary mb-4" />,
  'globe-alt': <GlobeAltIcon className="w-10 h-10 text-brand-secondary mb-4" />,
  'user-group': <UserGroupIcon className="w-10 h-10 text-brand-secondary mb-4" />,
};
const defaultIcon = <AcademicCapIcon className="w-10 h-10 text-brand-secondary mb-4" />;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getServices();
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch services');
        }

        const processedServices = response.data.map(service => ({
          id: service.id,
          slug: service.slug,
          title: service.name,
          description: service.short_description || 'Service description not available.',
          iconComponent: service.icon_name ? iconMapping[service.icon_name] || defaultIcon : defaultIcon,
        }));
        setServices(processedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
        setServices([]); // Ensure services is empty on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-primary font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-light">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Services</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600 mb-6">Please try refreshing the page or contact our support team.</p>
          <button 
            onClick={() => window.location.reload()} // window.location.reload is fine in client components
            className="bg-brand-secondary text-brand-primary hover:bg-yellow-400 font-bold py-2 px-6 rounded-lg mr-2"
          >
            Try Again
          </button>
           <Link href="/contact" className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold py-2 px-6 rounded-lg">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light">
      {/* Page Header */}
      <motion.section 
        className="bg-gradient-to-r from-brand-primary to-blue-600 text-white py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            variants={fadeInUp} initial="initial" animate="animate"
          >
            Our Comprehensive Services
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            variants={fadeInUp} initial="initial" animate="animate"
          >
            Dream Consultancy offers a full suite of services to support your journey to studying in the UK, every step of the way.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {services.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {services.map((service, index) => (
                <motion.div 
                  key={service.id || index} 
                  className="feature-card flex flex-col group"
                  variants={fadeInUp}
                >
                  <div className="flex justify-center md:justify-start mb-4">{service.iconComponent}</div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3 text-center md:text-left">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-center md:text-left flex-grow">{service.description}</p>
                  <Link 
                    href={`/services/${service.slug}`} 
                    className="self-center md:self-start mt-auto inline-flex items-center font-semibold text-brand-secondary hover:text-yellow-500 transition-colors group"
                  >
                    Learn More <ChevronRightIcon className="inline-block h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // This state will now be hit if services array is empty after loading (e.g. API returns empty or error state leads to empty array)
            <div className="text-center py-12">
              <p className="text-gray-700 mb-6">No services are currently available. Please check back later or contact us for more information.</p>
              <Link href="/contact" className="inline-block mt-4 bg-brand-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-primary mb-6">Ready to Take the Next Step?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
            We offer a comprehensive range of services to help you achieve your educational and career goals.
          </p>
          <Link href="/book-consultation" className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105">
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
} 