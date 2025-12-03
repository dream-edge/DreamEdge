import Link from 'next/link';
// import { motion } from 'framer-motion';
import { getServiceBySlug, getServices } from '@/lib/api';
import { ChevronRightIcon, CheckCircleIcon, AcademicCapIcon, BriefcaseIcon, LightBulbIcon, UserGroupIcon, GlobeAltIcon, DocumentTextIcon } from '@/components/icons/CommonIcons';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Map icon names to icon components
const iconMapping = {
  'academic-cap': <AcademicCapIcon className="w-16 h-16 text-yellow-300" />,
  'document-text': <DocumentTextIcon className="w-16 h-16 text-yellow-300" />,
  'briefcase': <BriefcaseIcon className="w-16 h-16 text-yellow-300" />,
  'light-bulb': <LightBulbIcon className="w-16 h-16 text-yellow-300" />,
  'globe-alt': <GlobeAltIcon className="w-16 h-16 text-yellow-300" />,
  'user-group': <UserGroupIcon className="w-16 h-16 text-yellow-300" />,
};

// Default icon for fallback
const defaultIcon = <AcademicCapIcon className="w-16 h-16 text-yellow-300" />;

// Animation variants
// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

export async function generateStaticParams() {
  const response = await getServices();
  if (!response.success || !response.data) {
    return [];
  }
  return response.data.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const response = await getServiceBySlug(slug);

  if (!response.success || !response.data) {
    return {
      title: 'Service Not Found',
      description: 'The service you are looking for could not be found.',
    };
  }
  const service = response.data;
  return {
    title: `${service.name || 'Service'} | Dream Consultancy`,
    description: service.short_description || 'Learn more about our services.',
    // openGraph: {
    //   title: service.name,
    //   description: service.short_description,
    //   images: service.image_url ? [{ url: service.image_url }] : [],
    // },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = params;
  
  const response = await getServiceBySlug(slug);

  if (!response.success) {
    if (response.notFound) {
      notFound(); // Trigger 404 page
    }
    // For other errors, we might want to show a generic error message
    // or a specific error page. For now, notFound() covers the main case.
    // If not a "notFound" error, this would ideally render an error component.
    // For simplicity here, we'll let it fall through or could throw an error to be caught by error.js
    console.error("Failed to fetch service:", response.error);
    // Render a fallback error UI or throw to error.js
    // For now, let's assume `notFound()` is the primary exit for failed fetches if data is not there.
    // If it's a server error, Next.js error overlay will show in dev.
    // In production, an error page would be shown.
    // Let's explicitly call notFound for any unsuccessful fetch that isn't a clear server error.
    notFound();
  }

  const serviceData = response.data;
  
  let benefits = [];
  if (serviceData.benefits) {
    try {
      benefits = typeof serviceData.benefits === 'string' 
        ? JSON.parse(serviceData.benefits) 
        : (Array.isArray(serviceData.benefits) ? serviceData.benefits : []);
    } catch (e) {
      console.error('Error parsing benefits JSON for service:', serviceData.slug, e);
      // benefits will remain empty array
    }
  }

  const service = {
    id: serviceData.id,
    slug: serviceData.slug,
    title: serviceData.name || "Service Title",
    description: serviceData.short_description || 'Service description not available.',
    longDescription: serviceData.full_description || 'Detailed service description not available.',
    iconComponent: serviceData.icon_name ? iconMapping[serviceData.icon_name] || defaultIcon : defaultIcon,
    benefits: benefits,
    image_url: serviceData.image_url || null,
    process: [ // This process is static, consider making it dynamic if needed
      'Initial consultation to understand your needs',
      'Customized service plan development',
      'Step-by-step guidance and implementation',
      'Regular progress tracking and support'
    ]
  };

  // Note: Framer Motion components like <motion.section> can be used in Server Components
  // for initial animations that don't require client-side interactivity post-load.
  // If interactivity is needed (e.g., whileInView for re-triggering), those specific parts
  // might need to be client components. For this refactor, we'll keep them as is.

  return (
    <div className="bg-brand-light">
      {/* Page Header with Service Title and Image */}
      <section
        className="relative bg-gradient-to-r from-brand-primary to-blue-600 text-white py-20"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.5 }}
      >
        {service.image_url && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={service.image_url} 
              alt={service.title || 'Service Image'} 
              fill={true}
              style={{ objectFit: "cover" }}
              className="opacity-30" 
              priority // Consider priority for LCP images
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent"></div>
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          {/* <motion.div variants={fadeInUp} initial="initial" animate="animate"> */}
          <div>
            {service.iconComponent && <div className="mb-4 text-yellow-300 w-16 h-16 mx-auto md:mx-0">{service.iconComponent}</div>}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">{service.title}</h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-3xl text-center md:text-left">{service.description}</p>
          {/* </motion.div> */}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Long Description & Process */}
            <div 
              className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg"
              // variants={fadeInUp} initial="initial" whileInView="animate" viewport={{once: true}}
            >
              <h2 className="text-2xl font-semibold text-brand-primary mb-6">Service Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-700 custom-prose">
                {/* Ensure prose styles are applied correctly. Add custom-prose class if needed. */}
                {/* Render HTML if longDescription contains it, or use dangerouslySetInnerHTML if trusted */}
                {/* For plain text: */}
                {service.longDescription.split('\\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {service.process && service.process.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-brand-primary mt-10 mb-4">Our Process</h3>
                  <ul className="space-y-3">
                    {service.process.map((step, index) => (
                      <li 
                        key={index} 
                        className="flex items-start"
                        // For server components, variants might not work as expected for whileInView without client component wrapper
                        // variants={fadeInUp} initial="initial" whileInView="animate" viewport={{once: true}} custom={index}
                      >
                        <span className="bg-brand-secondary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Right Column: Benefits & CTA */}
            <div
              className="lg:col-span-1"
              // variants={fadeInUp} initial="initial" whileInView="animate" viewport={{once: true}} custom={0.5}
            >
              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-xl font-semibold text-brand-primary mb-5">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-px flex-shrink-0" />
                        {/* Benefit could be object {text: "..."} or string. Assuming string. */}
                        <span>{typeof benefit === 'object' ? benefit.text : benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-brand-primary text-white p-8 rounded-lg shadow-lg text-center sticky top-24"> {/* Added sticky top-24 */}
                <h3 className="text-2xl font-semibold mb-4">Interested in this Service?</h3>
                <p className="mb-6 text-blue-200">
                  Let our experts guide you. Book a free consultation to discuss your specific needs.
                </p>
                <Link 
                  href="/book-consultation" 
                  className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 inline-block w-full"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services or Next Steps (Optional) */}
      <section className="py-12 md:py-16 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-brand-primary mb-8">Explore More Services</h2>
          <Link href="/services" className="bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            View All Services
          </Link>
        </div>
      </section>
    </div>
  );
} 