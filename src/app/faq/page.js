"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { getFaqs } from "@/lib/api";

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'visa', name: 'Visa & Immigration' },
    { id: 'application', name: 'Application Process' },
    { id: 'accommodation', name: 'Accommodation' },
    { id: 'general', name: 'General Questions' },
  ];

  useEffect(() => {
    const loadFaqs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getFaqs(activeCategory);
        
        if (result.success) {
          setFaqs(result.data || []);
        } else {
          setError("Failed to load FAQs. Please try again later.");
        }
      } catch (error) {
        console.error("Error loading FAQs:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFaqs();
  }, [activeCategory]);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl">
              Find answers to common questions about studying in the UK, visa applications, and our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
                  <p className="mt-4 text-gray-600">Loading FAQs...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-gray-700">{error}</p>
                  <button 
                    onClick={() => getFaqs(activeCategory)}
                    className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : faqs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">No FAQs found in this category.</p>
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div 
                    key={faq.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <span className={`ml-6 flex-shrink-0 transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}>
                        <svg className="h-6 w-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    
                    <div 
                      className={`transition-all duration-200 overflow-hidden ${
                        activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 pt-0 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Still Have Questions */}
            <div className="mt-20 p-8 bg-gray-50 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
              <p className="text-gray-700 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Please reach out to our friendly team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-brand-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/book-consultation"
                  className="px-6 py-3 bg-white text-brand-primary font-medium rounded-md border border-brand-primary hover:bg-gray-50 transition-colors"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 