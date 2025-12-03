"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PtePreparationPage() {
  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-primary to-blue-800 text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PTE Academic Test Preparation
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Specialized coaching to help you master the Pearson Test of English Academic.
            </p>
            <Link href="/book-consultation" className="bg-brand-secondary text-brand-primary hover:bg-yellow-400 font-bold py-3 px-8 rounded-lg inline-block transition-colors">
              Enroll Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg mb-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-brand-primary mb-4">Course Overview</h2>
              <p className="text-gray-700 mb-4">
                Our PTE preparation course is designed to give you a comprehensive understanding of the test format and develop the skills needed to excel in all sections.
              </p>
              <p className="text-gray-700">
                Whether you're a beginner or looking to improve your current score, our experienced trainers will provide personalized guidance to help you achieve your target.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={1}
            >
              <h2 className="text-2xl font-bold text-brand-primary mb-4">Coming Soon!</h2>
              <p className="text-gray-700 mb-6">
                We're currently updating our PTE preparation course information. Please check back soon for detailed information about:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                <li>Course structure and duration</li>
                <li>Section-specific strategies</li>
                <li>Practice materials and resources</li>
                <li>Mock tests and evaluation</li>
                <li>Pricing and schedule options</li>
              </ul>
              <p className="text-gray-700 mb-8">
                In the meantime, you can book a free consultation to discuss your PTE preparation needs with our expert trainers.
              </p>
              <div className="text-center">
                <Link href="/book-consultation" className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-8 rounded-lg inline-block transition-colors">
                  Book Free Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 