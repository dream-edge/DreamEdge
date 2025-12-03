"use client";

import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, AcademicCapIcon, BriefcaseIcon, LightBulbIcon, UserCircleIcon, CalendarDaysIcon, SparklesIcon, SearchIcon, BookOpenIcon, UsersIcon, FileCheckIcon } from '@/components/icons/CommonIcons.js';
import { useState, useEffect } from 'react';
import { getTestimonials, getUniversities, getTestPrepCourses, getServices, getSiteSettings, getHomepageProcessSteps } from '@/lib/api';

// Animation variants for Framer Motion
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

// Helper to select an icon based on name for process steps
const ProcessStepIcon = ({ iconName }) => {
  const iconProps = { className: "w-4 h-4 text-brand-primary" };
  switch (iconName) {
    case 'academic-cap': return <AcademicCapIcon {...iconProps} />;
    case 'briefcase': return <BriefcaseIcon {...iconProps} />;
    case 'lightbulb': return <LightBulbIcon {...iconProps} />;
    case 'user-circle': 
    case 'user': return <UserCircleIcon {...iconProps} />;
    case 'calendar-days': return <CalendarDaysIcon {...iconProps} />;
    case 'sparkles': return <SparklesIcon {...iconProps} />;
    case 'search': return <SearchIcon {...iconProps} />;
    case 'book-open': return <BookOpenIcon {...iconProps} />;
    case 'check-circle': return <CheckCircleIcon {...iconProps} />;
    case 'users': return <UsersIcon {...iconProps} />;
    case 'file-check': return <FileCheckIcon {...iconProps} />;
    default: return <LightBulbIcon {...iconProps} />; // Default icon
  }
};

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [testPrepItems, setTestPrepItems] = useState([]);
  const [services, setServices] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [dynamicProcessSteps, setDynamicProcessSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state on new fetch

        const [ 
          testimonialsResponse,
          universitiesResponse,
          testPrepResponse,
          servicesResponse,
          siteSettingsResponse,
          homepageProcessStepsResponse
        ] = await Promise.all([
          getTestimonials(),
          getUniversities(),
          getTestPrepCourses(),
          getServices(),
          getSiteSettings(),
          getHomepageProcessSteps()
        ]);

        if (testimonialsResponse.success) setTestimonials(testimonialsResponse.data);
        else console.warn('Failed to load testimonials:', testimonialsResponse.error);

        if (universitiesResponse.success) {
          const transformedUniversities = universitiesResponse.data.map(uni => ({
            ...uni,
            slug: uni.slug || uni.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'default-university-slug'
          }));
          setFeaturedUniversities(transformedUniversities.slice(0, 4));
        } else {
          console.warn('Failed to load universities:', universitiesResponse.error);
        }

        if (testPrepResponse.success) setTestPrepItems(testPrepResponse.data);
        else console.warn('Failed to load test prep courses:', testPrepResponse.error);

        if (servicesResponse.success) setServices(servicesResponse.data);
        else console.warn('Failed to load services:', servicesResponse.error);

        if (siteSettingsResponse) {
            if (siteSettingsResponse.success && siteSettingsResponse.data) {
                setSiteSettings(siteSettingsResponse.data);
            } else if (siteSettingsResponse.data) {
                setSiteSettings(siteSettingsResponse.data);
            } else {
                console.warn('Failed to load site settings or data is null:', siteSettingsResponse.error);
                setSiteSettings({});
            }
        } else {
            console.warn('Site settings API call did not return expected structure.');
            setSiteSettings({});
        }
        
        if (homepageProcessStepsResponse.success) {
          setDynamicProcessSteps(homepageProcessStepsResponse.data.sort((a,b) => a.step_number - b.step_number));
        } else {
            console.warn('Failed to load homepage process steps:', homepageProcessStepsResponse.error);
            setDynamicProcessSteps([]);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load page content. Please try again later.');
        setSiteSettings({});
        setDynamicProcessSteps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-4">
        <div>
          <p className="text-red-500 text-xl font-semibold mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const heroTitle = siteSettings?.hero_title || "Unlock Your Global Education Dream";
  const heroSubtitle = siteSettings?.hero_subtitle || "Expert guidance for your journey to studying internationally.";
  const heroCtaText = siteSettings?.hero_cta_text || "Book a Free Consultation";
  const heroCtaLink = siteSettings?.hero_cta_link || "/book-consultation";
  const heroBgImageUrl = siteSettings?.hero_background_image_url || null;

  const whyChooseUsTitle = siteSettings?.why_choose_us_title || "Why Choose Us?";
  const whyChooseUsSubtitle = siteSettings?.why_choose_us_subtitle || "Your dedicated partners in achieving academic and career success.";
  const provenProcessTitle = siteSettings?.proven_process_title || "Our Proven Process to Success";

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-primary py-32 md:py-48 flex items-center justify-center text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative' }}
      >
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        {heroBgImageUrl && (
            <Image 
                src={heroBgImageUrl}
                alt={heroTitle || "Global education consultancy hero image"} 
                fill
                style={{ objectFit: "cover", position: "absolute" }}
                className="absolute inset-0 z-0 opacity-60"
                priority
                sizes="100vw"
                onError={(e) => {
                  console.error('Hero image failed to load:', heroBgImageUrl);
                  e.target.style.display = 'none';
                }}
            />
        )}
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {heroTitle}
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            {heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href={heroCtaLink} className="btn-accent text-lg px-8 py-4 shadow-md">
              {heroCtaText}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <section className="section-alt section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">{whyChooseUsTitle}</h2>
            <p className="text-lg text-body-light">{whyChooseUsSubtitle}</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Service Card 1 - University Application Assistance */}
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <div className="icon-circle mb-4">
                <AcademicCapIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-primary-600">University Application Assistance</h3>
              <p className="text-body-light mb-4">
                Get expert guidance through every step of the university application process. We help you select suitable institutions, prepare documents, and craft compelling personal statements to maximize your acceptance chances.
              </p>
              <Link href="/services/university-application" className="inline-flex items-center text-brand-accent font-medium hover:text-brand-accent-600 transition-colors">
                Learn more <ChevronRightIcon className="ml-1 w-5 h-5" />
              </Link>
            </motion.div>

            {/* Service Card 2 - Visa Consultancy */}
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <div className="icon-circle-accent mb-4">
                <FileCheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-accent">Visa Consultancy</h3>
              <p className="text-body-light mb-4">
                Expert support for your visa application journey. We guide you through requirements, documentation, and interview preparation for a smooth process.
              </p>
              <Link href="/services/visa-consultancy" className="inline-flex items-center text-brand-accent font-medium hover:text-brand-accent-600 transition-colors">
                Learn more <ChevronRightIcon className="ml-1 w-5 h-5" />
              </Link>
            </motion.div>

            {/* Service Card 3 - Scholarship Guidance */}
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <div className="icon-circle mb-4">
                <LightBulbIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-primary-600">Scholarship Guidance</h3>
              <p className="text-body-light mb-4">
                Navigate the complex world of scholarships with our expert guidance. We help you identify opportunities, prepare applications, and understand eligibility to fund your international education.
              </p>
              <Link href="/services/scholarship-guidance" className="inline-flex items-center text-brand-accent font-medium hover:text-brand-accent-600 transition-colors">
                Learn more <ChevronRightIcon className="ml-1 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">{provenProcessTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {dynamicProcessSteps.map((step, index) => (
              <div key={step.id || index} className="process-step">
                <div className="process-step-number">
                  <span className="text-brand-accent text-2xl font-bold">{step.step_number || index + 1}</span>
                </div>
                <div className="icon-circle mb-4">
                  <ProcessStepIcon iconName={step.icon_name || 'academic-cap'} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-brand-primary-600">{step.title}</h3>
                <p className="text-body-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Universities Section */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Explore Top Universities</h2>
            <p className="text-lg text-body-light max-w-3xl mx-auto">
              Explore top universities in popular study destinations. Our partner institutions 
              offer quality education and global recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredUniversities.map((university) => (
              <div key={university.id} className="university-card">
                <div className="university-card-header">
                  <div className="h-40 flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100">
                    {university.logo_url ? (
                      <Image 
                        src={university.logo_url} 
                        alt={university.name} 
                        width={200} 
                        height={100} 
                        className="max-h-32 w-auto object-contain"
                      />
                    ) : (
                      <div className="text-center text-brand-primary text-lg font-medium">
                        {university.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="university-card-body">
                  <h3 className="text-xl font-semibold mb-2">{university.name}</h3>
                  <p className="text-body-light mb-4 line-clamp-3">
                    {university.description || 'University information not available.'}
                  </p>
                  <Link 
                    href={`/study-abroad/universities/${university.slug}`} 
                    className="inline-flex items-center text-brand-accent font-medium hover:text-brand-accent-600 transition-colors"
                  >
                    Learn More <ChevronRightIcon className="ml-1 w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/study-abroad/universities" className="btn-outline-primary">
              View All Partner Universities
            </Link>
          </div>
        </div>
      </section>

      {/* Test Preparation Section */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Ace Your Admission Tests</h2>
            <p className="text-lg text-body-light max-w-3xl mx-auto">
              Prepare for internationally recognized exams with our specialized training 
              programs designed to help you score high.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {testPrepItems.slice(0, 3).map((course) => (
              <div key={course.id} className="feature-card">
                <h3 className="text-2xl font-semibold mb-4 text-brand-primary">{course.test_name}</h3>
                <p className="text-body-light mb-6 line-clamp-4">
                  {course.description || `The ${course.test_name} is a standardized test for admission to universities. Prepare with our expert guidance.`}
                </p>
                <Link 
                  href={`/test-preparation/${course.slug}`} 
                  className="inline-flex items-center text-brand-accent font-medium hover:text-brand-accent-600 transition-colors"
                >
                  Learn More <ChevronRightIcon className="ml-1 w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/test-preparation" className="btn-accent">
              Explore Test Prep Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding section-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Stories of Success</h2>
            <p className="text-lg text-body-light max-w-3xl mx-auto">
              Hear from students who embarked on their educational journey with Dream Consultancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-accent-50 border border-brand-accent-100 flex items-center justify-center">
                    {testimonial.photo_url ? (
                      <Image 
                        src={testimonial.photo_url} 
                        alt={testimonial.name} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-12 h-12 text-brand-accent" />
                    )}
                  </div>
                </div>
                <p className="text-body-light italic mb-4">"{testimonial.quote}"</p>
                <div className="text-center">
                  <p className="font-medium text-brand-primary">{testimonial.name}</p>
                  <p className="text-sm text-body-light">{testimonial.program}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-lg mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-lg text-body-light mb-8 max-w-2xl mx-auto">
            Your dream of studying abroad is closer than you think. Let's make it happen together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="btn-primary shadow-md">
              Get In Touch
            </Link>
            <Link href="/book-consultation" className="btn-accent shadow-md">
              Book Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
