"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGlobe, FaMapMarkerAlt, FaGraduationCap, FaMoneyBillWave, FaBed } from 'react-icons/fa';

export default function UniversityDetailClientContent({ university, error, notFound, slug }) {
  if (!university && !error && !notFound) {
    // This case should ideally be handled by the parent server component or a general loading state
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading university details...</p>
      </div>
    );
  }

  if (error && !notFound) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading University Data</h1>
          <p className="mb-2">{error || "We encountered an error loading this university\\'s information."}</p>
          <p className="mb-8">Please try again later or contact support.</p>
          <Link href="/study-abroad/universities" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }
  
  if (notFound || !university) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">University Not Found</h1>
          <p className="mb-8">The university you are looking for (slug: {slug}) does not exist or could not be found.</p>
          <Link href="/study-abroad/universities" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }
  
  let popularCourses = university.popular_courses || [];
  if (typeof popularCourses === 'string') {
      try {
          popularCourses = JSON.parse(popularCourses);
      } catch (e) {
          console.error("Error parsing popular_courses JSON:", e);
          popularCourses = [];
      }
  }
  if (!Array.isArray(popularCourses)) popularCourses = [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* University Banner */}
      <div className="relative w-full h-64 md:h-80">
        {university.banner_image_url ? (
          <Image 
            src={university.banner_image_url} 
            alt={university.name} 
            fill
            className="object-cover"
            sizes="100vw"
            priority // Consider if priority is needed, usually for LCP
            onError={(e) => {
              console.error(`Error loading banner image for ${university.name}`);
              // Replace with gradient background handled in the fallback
              e.target.style.display = 'none';
              const parentElement = e.target.parentElement;
              if (parentElement) {
                parentElement.classList.add('bg-gradient-to-r', 'from-primary', 'to-primary-light');
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
             {/* Optional: Placeholder text or icon if no banner */}
            <span className="text-white text-xl opacity-50">No Banner Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6">
              {university.logo_url && (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-md overflow-hidden relative flex-shrink-0 p-1">
                  <Image 
                    src={university.logo_url} 
                    alt={`${university.name} logo`} 
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80px, 96px"
                    onError={(e) => {
                      console.error(`Error loading logo image for ${university.name}, using placeholder`);
                      e.currentTarget.src = '/logos/default-university-logo-placeholder.png'; // Make sure this placeholder exists
                    }}
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {university.name}
                </h1>
                {university.location && (
                  <div className="flex items-center gap-2 text-white">
                    <FaMapMarkerAlt />
                    <span>{university.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* University Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">About {university.name}</h2>
              <div className="prose max-w-none text-gray-700">
                {university.description ? (
                  <p>{university.description}</p>
                ) : (
                  <p>Full information about {university.name} is coming soon. Please contact our consultants for more details.</p>
                )}
              </div>
            </div>
            
            {/* Popular Courses */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Popular Courses</h2>
              {popularCourses.length > 0 ? (
                <ul className="space-y-4">
                  {popularCourses.map((course, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaGraduationCap className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        {typeof course === 'string' ? (
                            <h3 className="font-medium text-gray-800">{course}</h3>
                        ) : (
                            <>
                                <h3 className="font-medium text-gray-800">{course.name || 'Course Name Unavailable'}</h3>
                                {course.description && <p className="text-gray-600 text-sm">{course.description}</p>}
                            </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Course information coming soon. Contact our advisors for the latest program details.</p>
              )}
            </div>
            
            {/* Accommodation */}
            {university.accommodation_info && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Accommodation</h2>
                <div className="flex items-start gap-3">
                  <FaBed className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{university.accommodation_info}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Facts</h2>
              <ul className="space-y-4">
                {university.ranking && (
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                      <span className="text-primary font-bold">{university.ranking}</span>
                    </div>
                    <span className="text-gray-700">Ranking</span>
                  </li>
                )}
                
                {university.tuition_fees_range && (
                  <li className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800">Tuition Fees</span>
                      <p className="text-gray-600">{university.tuition_fees_range}</p>
                    </div>
                  </li>
                )}
                
                {university.website_url && (
                  <li className="flex items-start gap-3">
                    <FaGlobe className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800">Website</span>
                      <p>
                        <a 
                          href={university.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Official Site
                        </a>
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            {/* CTA */}
            <div className="bg-primary text-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">Interested in {university.name}?</h2>
              <p className="mb-4 text-gray-500">Our consultants can help you with the application process and provide expert advice.</p>
              <div className="space-y-3">
                <Link 
                  href="/book-consultation" 
                  className="block w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-center font-semibold py-3 rounded-md shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  Book a Free Consultation
                </Link>
                <Link 
                  href="/contact" 
                  className="block w-full  bg-transparent hover:bg-gray-100 text-black hover:text-gray-900 text-center font-semibold py-3 rounded-md shadow-md transition-colors duration-300 ease-in-out border-2 border-gray-200 hover:border-gray-900 transform hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 