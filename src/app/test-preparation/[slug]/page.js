import React from 'react';
import { getTestPrepCourseBySlug } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaMoneyBillWave, FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

export async function generateMetadata({ params: paramsPromise }) {
  const { slug } = await paramsPromise;
  const { data: course, success, notFound } = await getTestPrepCourseBySlug(slug);
  
  if (!success || notFound || !course) {
    return {
      title: 'Course Not Found',
      description: 'The test preparation course you are looking for does not exist.',
    };
  }
  
  return {
    title: `${course.test_name} Preparation - Dream Consultancy`,
    description: course.description || `Prepare for your ${course.test_name} exam with Dream Consultancy's specialized test preparation courses.`,
    openGraph: {
        title: `${course.test_name} Preparation - Dream Consultancy`,
        description: course.description || `Prepare for your ${course.test_name} exam with Dream Consultancy's specialized test preparation courses.`,
    },
  };
}

export default async function TestPrepDetailPage({ params: paramsPromise }) {
  const { slug } = await paramsPromise;
  const { success, data: course, error, notFound } = await getTestPrepCourseBySlug(slug);
  
  if (!success && error && !notFound) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Course Data</h1>
          <p className="mb-2">{error || "We encountered an error loading this course's information."}</p>
          <p className="mb-8">Please try again later or contact support.</p>
          <Link href="/test-preparation" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
            Back to All Courses
          </Link>
        </div>
      </div>
    );
  }
  
  if (notFound || !course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-8">The test preparation course you are looking for (slug: {slug}) does not exist.</p>
          <Link href="/test-preparation" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
            Back to All Courses
          </Link>
        </div>
      </div>
    );
  }
  
  // Parse JSON fields if they exist and are strings
  const features = course.features ? 
    (typeof course.features === 'string' ? JSON.parse(course.features) : (Array.isArray(course.features) ? course.features : [])) : 
    [];
  
  const scheduleOptions = course.schedule_options ? 
    (typeof course.schedule_options === 'string' ? JSON.parse(course.schedule_options) : (Array.isArray(course.schedule_options) ? course.schedule_options : [])) : 
    [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {course.test_name} Preparation Course
            </h1>
            {course.description && (
              <p className="text-lg mb-6 text-gray-700">{course.description}</p>
            )}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <Link 
                href="/book-consultation" 
                className="bg-brand-accent hover:bg-brand-accent-600 text-white font-medium px-6 py-3 rounded-md shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Book a Free Consultation
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent hover:bg-brand-primary text-brand-primary hover:text-white font-medium px-6 py-3 rounded-md shadow-md transition-colors duration-300 ease-in-out border-2 border-brand-primary transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Course Overview</h2>
              {course.description ? (
                <p className="mb-6">{course.description}</p>
              ) : (
                <p className="mb-6">Our comprehensive {course.test_name} preparation course is designed to help you achieve your target score. Contact us for more details about the curriculum.</p>
              )}
              
              {/* Key Features Grid */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                {features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                        <span>{typeof feature === 'string' ? feature : (feature.text || 'Feature details missing')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                      <span>Expert instructors</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                      <span>Comprehensive study materials</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                      <span>Practice tests with feedback</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                      <span>Small class sizes</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Schedule Options */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Schedule Options</h2>
              {scheduleOptions.length > 0 ? (
                <div className="space-y-3">
                  {scheduleOptions.map((optionText, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaCalendarAlt className="text-primary mt-1 flex-shrink-0" />
                      <span>{optionText}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="mb-4">We offer flexible scheduling options to fit your needs:</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium block">Weekday Classes</span>
                        <span className="text-gray-700">Monday - Friday, various time slots available</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium block">Weekend Classes</span>
                        <span className="text-gray-700">Saturday & Sunday, morning and afternoon sessions</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaChalkboardTeacher className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium block">Format</span>
                        <span className="text-gray-700">In-person and online options available</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6">Contact our team for the most current schedule and to find a time that works for you.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Course Details</h2>
              <ul className="space-y-4">
                {course.duration && (
                  <li className="flex items-start gap-3">
                    <FaClock className="text-primary mt-1" />
                    <div>
                      <span className="font-medium">Duration</span>
                      <p className="text-gray-600">{course.duration}</p>
                    </div>
                  </li>
                )}
                
                {course.price && (
                  <li className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-primary mt-1" />
                    <div>
                      <span className="font-medium">Fee</span>
                      <p className="text-gray-600">{course.price}</p>
                    </div>
                  </li>
                )}
                
                <li className="flex items-start gap-3">
                  <FaChalkboardTeacher className="text-primary mt-1" />
                  <div>
                    <span className="font-medium">Mode</span>
                    <p className="text-gray-600">Online & In-person classes available</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 space-y-4">
                <Link 
                  href="/book-consultation" 
                  className="block w-full bg-brand-accent text-white text-center font-medium py-3 rounded-md hover:bg-brand-accent-600 transition border-2 border-brand-accent"
                >
                  Enroll Now
                </Link>
                <Link 
                  href="/contact" 
                  className="block w-full bg-neutral-bg text-brand-dark text-center font-medium py-3 rounded-md hover:bg-brand-secondary-100 transition"
                >
                  Request More Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 