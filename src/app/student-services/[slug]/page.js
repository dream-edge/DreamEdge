import React from 'react';
import { getServiceBySlug } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'; // Using FaCheckCircle for benefits

// Helper to select an icon based on name - assuming you might want to reuse this or similar
const ServiceIcon = ({ iconName, className }) => {
  // Placeholder - implement actual icon mapping if services have specific icons in DB
  // For now, using a generic icon for benefits or service points
  if (iconName === 'check') return <FaCheckCircle className={className || "text-primary mt-1 flex-shrink-0"} />;
  return <FaCheckCircle className={className || "text-primary mt-1 flex-shrink-0"} />; // Default
};


export async function generateMetadata({ params: paramsPromise }) {
  const { slug } = await paramsPromise;
  const { data: service, success, notFound } = await getServiceBySlug(slug);
  
  if (!success || notFound || !service) {
    return {
      title: 'Service Not Found',
      description: 'The service you are looking for does not exist.',
    };
  }
  
  return {
    title: `${service.name} - Dream Consultancy`,
    description: service.short_description || service.full_description || `Learn more about our ${service.name} service.`,
    openGraph: {
        title: `${service.name} - Dream Consultancy`,
        description: service.short_description || service.full_description || `Learn more about our ${service.name} service.`,
        images: service.image_url ? [{ url: service.image_url }] : [],
    },
  };
}

export default async function ServiceDetailPage({ params: paramsPromise }) {
  const { slug } = await paramsPromise;
  const { success, data: service, error, notFound } = await getServiceBySlug(slug);
  
  if (!success && error && !notFound) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Service Data</h1>
          <p className="mb-2 text-gray-700">{error || "We encountered an error loading this service's information."}</p>
          <p className="mb-8 text-gray-700">Please try again later or contact support.</p>
          <Link href="/#services" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }
  
  if (notFound || !service) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-8 text-gray-700">The service you are looking for (slug: {slug}) does not exist or could not be found.</p>
          <Link href="/#services" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition inline-flex items-center">
             <FaArrowLeft className="mr-2" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }
  
  // Parse JSON fields if they exist and are strings
  const benefits = service.benefits ? 
    (typeof service.benefits === 'string' ? JSON.parse(service.benefits) : (Array.isArray(service.benefits) ? service.benefits : [])) : 
    [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Service Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {service.icon_name && (
              <div className="mb-4">
                {/* Placeholder for a larger icon if you have one, e.g., from a library like Heroicons or custom SVGs */}
                {/* <ServiceIcon iconName={service.icon_name} className="text-white h-16 w-16 mx-auto" /> */}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
              {service.name}
            </h1>
            {service.short_description && (
              <p className="text-lg md:text-xl mb-8 text-gray-700">{service.short_description}</p>
            )}
             <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link 
                href="/book-consultation" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                Book a Consultation
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent hover:bg-gray-700 text-gray-700 hover:text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 ease-in-out border-2 border-gray-700 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Service Details */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            {service.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden aspect-video relative">
                <Image 
                  src={service.image_url} 
                  alt={`${service.name} illustrative image`} 
                  fill
                  className="object-cover" 
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700">
              {service.full_description ? (
                <div dangerouslySetInnerHTML={{ __html: service.full_description.replace(/\\n/g, '<br />') }} />
              ) : (
                <p>Detailed information about our {service.name} service is coming soon. Please contact us for more details.</p>
              )}
            </div>

            {benefits.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-semibold text-primary mb-6">Key Benefits</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 h-6 w-6" />
                      <span className="text-gray-700">{typeof benefit === 'string' ? benefit : (benefit.item || benefit.name || 'Benefit detail missing')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-12 text-center">
                <Link href="/#services" className="text-primary hover:text-primary-dark font-medium transition-colors inline-flex items-center">
                    <FaArrowLeft className="mr-2" /> View All Services
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 