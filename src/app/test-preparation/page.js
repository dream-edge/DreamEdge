"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@/components/icons/CommonIcons.js';
import { useEffect, useState } from 'react';
import { getTestPrepCourses, getTestimonials, getFaqs } from '@/lib/api';

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

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

export default function TestPreparation() {
  const [testCourses, setTestCourses] = useState([]);
  const [dynamicSuccessStories, setDynamicSuccessStories] = useState([]);
  const [dynamicFaqs, setDynamicFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [coursesResponse, testimonialsResponse, faqsResponse] = await Promise.all([
          getTestPrepCourses(),
          getTestimonials({ category: "Test Preparation", limit: 3 }),
          getFaqs({ category: "test-preparation" })
        ]);

        if (!coursesResponse.success) {
          throw new Error(coursesResponse.error || 'Failed to fetch test preparation courses');
        }
        
        const coursesWithModules = coursesResponse.data.map(course => {
          // Parse JSON fields if they exist
          const features = course.features ? 
            (typeof course.features === 'string' ? JSON.parse(course.features) : course.features) : 
            [];
          
          const scheduleOptions = course.schedule_options ? 
            (typeof course.schedule_options === 'string' ? JSON.parse(course.schedule_options) : course.schedule_options) : 
            [];
          
          // Create a formatted course object
          return {
            id: course.id,
            name: course.test_name,
            slug: course.slug,
            description: course.description || '',
            // Generate default modules based on test type if not available
            modules: [
              { name: "Reading Section", duration: "6 hours" },
              { name: "Listening Section", duration: "6 hours" },
              { name: "Writing Section", duration: "8 hours" },
              { name: "Speaking Section", duration: "8 hours" },
              { name: "Practice Tests", duration: "6 hours" },
            ],
            features: Array.isArray(features) ? features : [],
            duration: course.duration || '8 weeks',
            schedule: Array.isArray(scheduleOptions) && scheduleOptions.length > 0 
              ? scheduleOptions.join(', ') 
              : 'Flexible schedule options available',
            price: course.price || 'Contact for pricing',
            imageUrl: `/test-prep/${course.slug}.jpg`,
          };
        });
        
        setTestCourses(coursesWithModules);

        if (testimonialsResponse.success) {
          setDynamicSuccessStories(testimonialsResponse.data);
        } else {
          console.warn('Failed to load success stories:', testimonialsResponse.error);
          setDynamicSuccessStories([]);
        }

        if (faqsResponse.success) {
          setDynamicFaqs(faqsResponse.data);
        } else {
          console.warn('Failed to load FAQs for test prep:', faqsResponse.error);
          setDynamicFaqs([]);
        }

      } catch (err) {
        console.error('Error fetching test prep page data:', err);
        setError(err.message);
        setTestCourses([]);
        setDynamicSuccessStories([]);
        setDynamicFaqs([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Student success stories (can be fetched from testimonials table in future)
  // const successStories = [ ... ]; // REMOVE STATIC DATA

  // FAQ data
  // const faqs = [ ... ]; // REMOVE STATIC DATA

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-primary font-medium">Loading test preparation courses...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-light">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Courses</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <p className="text-gray-700 mb-6">Please try refreshing the page or contact our support team.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-secondary text-brand-primary hover:bg-brand-accent font-bold py-2 px-6 rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-primary to-blue-800 text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          {/* Pattern or texture background */}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Score Higher with Expert Test Preparation
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Comprehensive training programs designed to maximize your scores on IELTS, TOEFL, and PTE Academic exams. 
              Language proficiency is your key to global academic opportunities.
            </p>
            <Link href="#courses" className="bg-brand-secondary text-brand-primary hover:bg-brand-accent font-bold py-3 px-8 rounded-lg inline-block transition-colors">
              Explore Our Courses
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Our Test Prep Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Why Choose Our Test Preparation</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our specialized training programs are designed to give you the edge you need to excel in your English proficiency exams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="feature-card"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="text-brand-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Expert Instructors</h3>
              <p className="text-gray-700">
                Learn from certified trainers with years of experience and proven success records in helping students achieve top scores.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="text-brand-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Comprehensive Materials</h3>
              <p className="text-gray-700">
                Access to latest study guides, practice tests, and specialized resources designed to cover all aspects of your chosen exam.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={2}
            >
              <div className="text-brand-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Proven Results</h3>
              <p className="text-gray-700">
                Our students consistently achieve their target scores and gain admission to their preferred universities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Our Test Preparation Courses</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Comprehensive preparation programs to help you achieve your target scores in all major English proficiency tests.
            </p>
          </motion.div>

          {testCourses.length > 0 ? (
            <div className="space-y-16">
              {testCourses.map((course, index) => (
                <motion.div
                  key={course.id || index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="relative h-64 lg:h-auto">
                      <Image
                        src={course.imageUrl}
                        alt={course.name}
                        fill
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "/test-prep/default-test-prep.jpg"; // Fallback image
                        }}
                      />
                    </div>
                    <div className="lg:col-span-2 p-8">
                      <h3 className="text-2xl font-bold text-brand-primary mb-3">{course.name}</h3>
                      <p className="text-gray-700 mb-6">
                        {course.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-brand-primary mb-2">Course Modules:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {course.modules && course.modules.map((module, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircleIcon />
                              <span className="text-gray-700">{module.name} <span className="text-gray-500 text-sm">({module.duration})</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-brand-primary mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {course.features && course.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <CheckCircleIcon />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-3">
                            <h4 className="font-semibold text-brand-primary">Duration:</h4>
                            <p className="text-gray-700">{course.duration}</p>
                          </div>
                          <div className="mb-3">
                            <h4 className="font-semibold text-brand-primary">Schedule:</h4>
                            <p className="text-gray-700">{course.schedule}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-brand-primary">Price:</h4>
                            <p className="text-gray-700">{course.price}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center md:justify-start space-x-4">
                        <Link href={`/test-preparation/${course.slug}`} className="bg-brand-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
                          Learn More
                        </Link>
                        <Link href="/book-consultation" className="bg-brand-secondary hover:bg-brand-accent text-brand-primary py-2 px-6 rounded-lg transition-colors">
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-700">No courses are currently available. Please check back later or contact us for more information.</p>
              <Link href="/contact" className="inline-block mt-4 bg-brand-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Student Success Stories</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our students have achieved their target scores and secured admissions to top universities worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dynamicSuccessStories.length > 0 ? (
              dynamicSuccessStories.map((story, index) => (
              <motion.div
                key={story.id || index}
                className="bg-brand-light rounded-lg shadow-lg overflow-hidden flex flex-col"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={story.photo_url || "/testimonials/default-testimonial.jpg"}
                    alt={story.name || "Student"}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/testimonials/default-testimonial.jpg"; 
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-brand-primary mb-2">{story.name}</h3>
                  {(story.program || story.category) && (
                    <p className="text-sm text-brand-secondary mb-1">
                      {story.program ? story.program : story.category}
                      {story.university ? ` - ${story.university}` : ''}
                    </p>
                  )}
                  <blockquote className="text-gray-700 italic text-sm mb-4 flex-grow">
                    &quot;{story.quote}&quot;
                  </blockquote>
                  {story.university && (
                    <p className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-200">
                      Studying at: {story.university}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No success stories available for test preparation at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-brand-primary">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Find answers to common queries about our test preparation programs and English proficiency exams.
            </p>
          </motion.div>
          
          {dynamicFaqs.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {dynamicFaqs.map((faq, index) => (
                <motion.div 
                  key={faq.id || index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                >
                  <details className="group">
                    <summary className="flex justify-between items-center font-semibold text-brand-primary cursor-pointer hover:text-brand-secondary transition-colors">
                      {faq.question}
                      <span className="text-brand-secondary group-open:rotate-180 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </span>
                    </summary>
                    <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200">
                      {faq.answer}
                    </p>
                  </details>
                </motion.div>
              ))}
            </div>
          ) : (
             <p className="text-center text-gray-500">No FAQs available for test preparation at the moment.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary">Ready to Start Your Test Preparation?</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
              Book a free consultation with our test preparation experts to discuss your goals and create a personalized study plan.
            </p>
            <Link href="/book-consultation" className="bg-brand-secondary hover:bg-brand-accent text-brand-primary font-bold py-3 px-8 rounded-lg text-lg inline-block transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              Book Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 