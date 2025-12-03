"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@/components/icons/CommonIcons';

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

export default function StudentServicesPage() {
  // Student services data
  const studentServices = [
    {
      title: "Visa Guidance",
      slug: "visa-guidance",
      description: "Comprehensive support for UK student visa applications, including documentation preparation, financial requirement guidance, and interview coaching.",
      icon: "🛂",
      imageUrl: "/services/visa-guidance.jpg"
    },
    {
      title: "Accommodation",
      slug: "accommodation",
      description: "Help finding suitable accommodation options in the UK, from university halls to private rentals, ensuring you find a safe and comfortable place to live.",
      icon: "🏠",
      imageUrl: "/services/accommodation.jpg"
    },
    {
      title: "Pre-Departure Briefing",
      slug: "pre-departure",
      description: "Essential information and guidance to prepare you for life in the UK, covering travel arrangements, packing tips, cultural adjustment, and more.",
      icon: "✈️",
      imageUrl: "/services/pre-departure.jpg"
    },
    {
      title: "Banking & Finance",
      slug: "banking-finance",
      description: "Assistance with setting up UK bank accounts, understanding currency exchange, budgeting for your studies, and managing finances abroad.",
      icon: "💰",
      imageUrl: "/services/banking.jpg"
    },
    {
      title: "Health & Insurance",
      slug: "health-insurance",
      description: "Guidance on the UK healthcare system, NHS registration, and ensuring you have appropriate health insurance coverage during your studies.",
      icon: "🩺",
      imageUrl: "/services/health.jpg"
    },
    {
      title: "Job Search & Career Support",
      slug: "career-support",
      description: "Help with understanding UK work rights for international students, CV preparation, interview skills, and finding part-time employment.",
      icon: "💼",
      imageUrl: "/services/career.jpg"
    }
  ];

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
              Student Services
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Comprehensive support services to ensure a smooth transition to UK student life, from visa applications to settling in and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Our Student Support Services</h2>
            <p className="text-lg text-brand-accent max-w-2xl mx-auto">
              We provide comprehensive support to ensure your UK education journey is smooth and successful.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {studentServices.map((service, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 left-4 z-20 text-4xl">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-brand-primary mb-3">{service.title}</h3>
                  <p className="text-brand-accent mb-5 flex-grow">{service.description}</p>
                  <Link 
                    href={`/student-services/${service.slug}`} 
                    className="inline-flex items-center font-semibold text-brand-secondary hover:text-yellow-500 transition-colors mt-auto self-start"
                  >
                    Learn More <ChevronRightIcon />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Our Student Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Why Choose Our Student Services</h2>
            <p className="text-lg text-brand-accent max-w-2xl mx-auto">
              We go beyond just getting you admission - we support you throughout your student journey in the UK.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-brand-light p-8 rounded-lg shadow-md"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="text-brand-secondary mb-4 text-5xl">🌍</div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Local Knowledge</h3>
              <p className="text-brand-accent">
                Our team has extensive experience with UK universities, cities, and culture, providing you with insider knowledge.
              </p>
            </motion.div>

            <motion.div
              className="bg-brand-light p-8 rounded-lg shadow-md"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="text-brand-secondary mb-4 text-5xl">👥</div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Personal Support</h3>
              <p className="text-brand-accent">
                We provide personalized guidance tailored to your specific needs, ensuring you receive the exact support required.
              </p>
            </motion.div>

            <motion.div
              className="bg-brand-light p-8 rounded-lg shadow-md"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={2}
            >
              <div className="text-brand-secondary mb-4 text-5xl">🔄</div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Continuous Assistance</h3>
              <p className="text-brand-accent">
                Our support doesn&apos;t end once you arrive in the UK - we&apos;re available to assist you throughout your educational journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-brand-primary to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help with Your UK Study Journey?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Book a free consultation with our expert advisors to discuss how our student services can support your UK education plans.
            </p>
            <Link href="/book-consultation" className="bg-brand-secondary hover:bg-yellow-400 text-brand-primary font-bold py-3 px-8 rounded-lg text-lg inline-block transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              Book Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 