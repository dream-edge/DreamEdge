'use client'; // This page will have client-side filtering UI

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRightIcon } from '@/components/icons/CommonIcons.js';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { getUniversities } from '@/lib/api';

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

// Loading fallback component
function UniversitiesLoading() {
  return (
    <div className="bg-brand-light min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
        <p className="mt-4 text-brand-primary font-medium">Loading universities...</p>
      </div>
    </div>
  );
}

// Main component with useSearchParams
function UniversitiesContent() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [rankingFilter, setRankingFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch universities data from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true);
        
        // Include the country parameter from URL in the filters
        const filters = {};
        if (countryParam) {
          filters.country = countryParam;
        }
        
        const result = await getUniversities(false, filters);
        
        if (result.success) {
          // Transform data as needed with null checks
          const transformedData = result.data.map(uni => ({
            id: uni.id || Math.random().toString(36).substring(2, 9), // Generate a random ID if missing
            name: uni.name || 'Unnamed University',
            slug: uni.slug || uni.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), // Add slug, with fallback for safety
            logoUrl: uni.logo_url || '/logos/default-university-logo.png', // Use default logo if missing
            description: uni.description || 'No description available',
            location: uni.location || 'Location not specified',
            popularCourses: uni.popular_courses 
              ? (typeof uni.popular_courses === 'string' 
                  ? JSON.parse(uni.popular_courses) 
                  : Array.isArray(uni.popular_courses) 
                    ? uni.popular_courses 
                    : [])
              : [],
            rankingGroup: uni.ranking 
              ? (uni.ranking <= 10 ? 'Top 10' 
                : uni.ranking <= 20 ? 'Top 20' 
                : uni.ranking <= 30 ? 'Top 30' 
                : 'Top 100')
              : 'Not ranked',
            ranking: uni.ranking || 999 // Default high ranking if missing
          }));
          
          setUniversities(transformedData);
        } else {
          throw new Error('Failed to fetch university data');
        }
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Unable to load university data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUniversities();
  }, [countryParam]);

  // Filter logic for search and filters
  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (locationFilter ? uni.location === locationFilter : true) &&
    (rankingFilter ? uni.rankingGroup === rankingFilter : true)
  );

  // Get unique locations and ranking groups for filter dropdowns
  const uniqueLocations = [...new Set(universities.map(uni => uni.location))];
  const uniqueRankingGroups = [...new Set(universities.map(uni => uni.rankingGroup))];
  
  // Show country filter info if country parameter is present
  const countryFilterMessage = countryParam ? `Showing universities in ${countryParam}` : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-brand-light min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-brand-primary font-medium">Loading universities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-brand-light min-h-screen flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Page Header */}
      <motion.section 
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            variants={fadeInUp} initial="initial" animate="animate"
          >
            Explore Universities Worldwide
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            variants={fadeInUp} initial="initial" animate="animate" custom={1}
          >
            Discover a diverse range of leading institutions we collaborate with to bring you the best global educational opportunities.
          </motion.p>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-md sticky top-[80px] z-30"> {/* Adjusted sticky top for header height */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label htmlFor="search-university" className="block text-sm font-medium text-gray-700 mb-1">Search University</label>
              <div className="relative">
                <input
                  type="text"
                  id="search-university"
                  placeholder="E.g., Harvard University, University of Toronto"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            {/* Location Filter */}
            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                id="location-filter"
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            {/* Ranking Filter */}
            <div>
              <label htmlFor="ranking-filter" className="block text-sm font-medium text-gray-700 mb-1">Ranking Group</label>
              <select
                id="ranking-filter"
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                value={rankingFilter}
                onChange={(e) => setRankingFilter(e.target.value)}
              >
                <option value="">All Rankings</option>
                {uniqueRankingGroups.sort().map(rank => <option key={rank} value={rank}>{rank}</option>)}
              </select>
            </div>
          </div>
          
          {/* Country filter message */}
          {countryFilterMessage && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex items-center">
              <span className="font-medium">{countryFilterMessage}</span>
              <Link href="/study-abroad/universities" className="ml-auto text-sm bg-white px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors">
                Clear Filter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* University Gallery Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {filteredUniversities.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {filteredUniversities.map((university) => (
                <motion.div 
                  key={university.id} 
                  className="university-card flex flex-col"
                  variants={fadeInUp}
                >
                  <div className="university-card-header flex items-center justify-center h-48 relative">
                    <Image 
                      src={university.logoUrl || '/logos/default-university-logo-placeholder.png'}
                      alt={`${university.name} logo`} 
                      fill
                      style={{ objectFit: "contain" }}
                      className="p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.log(`Error loading logo for ${university.name}, using placeholder instead`);
                        e.currentTarget.src = '/logos/default-university-logo-placeholder.png';
                      }}
                    />
                  </div>
                  <div className="university-card-body flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">{university.name || 'Unnamed University'}</h3>
                    <p className="text-sm text-gray-500 mb-1">Location: <span className="font-medium">{university.location || 'Not specified'}</span></p>
                    <p className="text-sm text-gray-500 mb-4">Ranking Group: <span className="font-medium">{university.rankingGroup || 'Not ranked'}</span></p>
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{university.description || 'No description available'}</p>
                    
                    {university.popularCourses && university.popularCourses.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Courses:</h4>
                        <div className="flex flex-wrap gap-2">
                          {university.popularCourses.slice(0, 4).map((course, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Link 
                      href={`/study-abroad/universities/${university.slug || 'default-university-slug'}`} 
                      className="text-brand-secondary hover:text-yellow-500 font-medium transition-colors self-start group inline-flex items-center"
                    >
                      Learn More <ChevronRightIcon />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-700 mb-4">No universities found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setRankingFilter('');
                }}
                className="inline-block px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-primary mb-6">Interested in a Specific University?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Don&apos;t see what you&apos;re looking for? Our team can help you explore institutions worldwide, even those not listed here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Ask About a University
            </Link>
            <Link href="/book-consultation" className="bg-white hover:bg-gray-50 text-brand-primary font-bold py-3 px-8 rounded-lg border-2 border-brand-primary transition-colors">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap the component that uses useSearchParams in a Suspense boundary
export default function AllUniversitiesPage() {
  return (
    <Suspense fallback={<UniversitiesLoading />}>
      <UniversitiesContent />
    </Suspense>
  );
}

// Need to create placeholder logo files in /public/logos/ for:
// bristol-logo-placeholder.png, warwick-logo-placeholder.png, glasgow-logo-placeholder.png,
// birmingham-logo-placeholder.png, nottingham-logo-placeholder.png, sheffield-logo-placeholder.png
// (oxford, ucl, manchester, kcl were on homepage, assuming they are already created) 