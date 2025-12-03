import { getStudyDestinationBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@/components/icons/CommonIcons';
import CountryHeroImage from '@/components/CountryHeroImage';

export async function generateMetadata({ params }) {
  const { countrySlug } = await params;
  const { data: destination } = await getStudyDestinationBySlug(countrySlug);
  
  if (!destination) {
    return {
      title: 'Study Destination Not Found',
      description: 'The requested study destination could not be found.'
    };
  }

  return {
    title: destination.meta_title || `Study in ${destination.display_name} - Dream Edge Education Consultancy`,
    description: destination.meta_description || `Learn about studying in ${destination.display_name}, including universities, courses, admission requirements, and more.`
  };
}

export default async function CountryPage({ params }) {
  const { countrySlug } = await params;
  const { data: destination, success, notFound: destinationNotFound } = await getStudyDestinationBySlug(countrySlug);
  
  if (!success || destinationNotFound) {
    return notFound();
  }

  // Parse JSON fields
  const quickFacts = destination.quick_facts || {};
  const faqs = destination.country_specific_faqs || [];
  const additionalSections = destination.additional_sections || [];
  const sidebarNavLinks = destination.sidebar_nav_links || [];

  // Helper function to render HTML content safely
  const renderHTML = (content) => {
    return content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : null;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-28 md:py-40 bg-gradient-to-br from-gradient-blue-start to-gradient-blue-end text-white text-center overflow-hidden">
        <CountryHeroImage 
          imageUrl={destination.hero_image_url} 
          countrySlug={destination.country_slug}
          countryName={destination.display_name}
        />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Study in {destination.display_name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Two-column layout container */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column - 70% on desktop */}
          <div className="lg:w-[70%]">
            {/* Intro Text */}
            {destination.intro_text && (
              <section className="mb-16">
                <div className="prose max-w-none lg:prose-lg prose-headings:text-brand-primary prose-a:text-brand-secondary">
                  {renderHTML(destination.intro_text)}
                </div>
              </section>
            )}

            {/* Quick Facts */}
            {Object.keys(quickFacts).length > 0 && (
              <section id={`quick-facts-${destination.country_slug}`} className="mb-16 bg-brand-light p-6 rounded-lg shadow-md">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Quick Facts: {destination.display_name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(quickFacts).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-lg font-semibold text-brand-primary capitalize">{key.replace(/_/g, ' ')}:</dt>
                      <dd className="text-gray-700">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </dd>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why Study Here */}
            {destination.why_study_here_content && (
              <section id={`why-study-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Why Study in {destination.display_name}</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.why_study_here_content)}
                </div>
              </section>
            )}

            {/* Education System */}
            {destination.education_system_content && (
              <section id={`education-system-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Education System in {destination.display_name}</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.education_system_content)}
                </div>
              </section>
            )}

            {/* Popular Courses */}
            {destination.popular_courses_content && (
              <section id={`popular-courses-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Popular Courses in {destination.display_name}</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.popular_courses_content)}
                </div>
              </section>
            )}

            {/* Admission Requirements */}
            {destination.admission_requirements_content && (
              <section id={`admission-requirements-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Admission Requirements</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.admission_requirements_content)}
                </div>
              </section>
            )}

            {/* Cost of Studying & Living */}
            {destination.cost_studying_living_content && (
              <section id={`cost-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Cost of Studying & Living</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.cost_studying_living_content)}
                </div>
              </section>
            )}

            {/* Visa Requirements */}
            {destination.visa_requirements_content && (
              <section id={`visa-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Visa Requirements</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.visa_requirements_content)}
                </div>
              </section>
            )}

            {/* Scholarships */}
            {destination.scholarships_content && (
              <section id={`scholarships-${destination.country_slug}`} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Scholarships</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(destination.scholarships_content)}
                </div>
              </section>
            )}
            
            {/* Additional Sections */}
            {additionalSections.length > 0 && additionalSections.map((section, index) => (
              <section className="mb-12" key={index} id={`section-${index}-${destination.country_slug}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">{section.title}</h2>
                <div className="prose prose-lg max-w-none">
                  {renderHTML(section.content)}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar - 30% on desktop */}
          <div className="lg:w-[30%]">
            <div className="sticky top-24 space-y-8">
              {/* Sidebar Navigation */}
              {sidebarNavLinks && sidebarNavLinks.length > 0 && (
                <div className="bg-brand-light rounded-lg shadow-md overflow-hidden">
                  <div className="bg-brand-primary p-4">
                    <h3 className="text-xl font-bold text-white">{destination.display_name}</h3>
                  </div>
                  <nav className="p-2">
                    <ul className="space-y-1">
                      {sidebarNavLinks.map((link, index) => (
                        <li key={index}>
                          <a 
                            href={link.anchor} 
                            className="block py-2 px-4 text-brand-primary hover:bg-brand-secondary hover:text-white rounded-md transition-colors"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* CTA: View Universities */}
              <div className="p-6 bg-brand-primary text-white rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-4">Explore Universities in {destination.display_name}</h3>
                <p className="mb-6">Browse top institutions and find the perfect match for your academic goals.</p>
                <Link 
                  href={`/study-abroad/universities?country=${destination.country_slug}`}
                  className="btn-accent hover-scale inline-flex items-center justify-center"
                >
                  View Universities <ChevronRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </div>

              {/* CTA: Book Consultation */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-brand-primary mb-4">Need Personal Guidance?</h3>
                <p className="text-gray-600 mb-6">Our education consultants can help you navigate the application process.</p>
                <Link 
                  href="/book-consultation"
                  className="inline-flex items-center px-5 py-3 bg-white border-2 border-brand-secondary text-brand-primary rounded-md font-semibold hover:bg-brand-light transition-colors"
                >
                  Book Free Consultation <ChevronRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-brand-primary mb-3">{faq.question}</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {renderHTML(faq.answer)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 