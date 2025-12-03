"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AcademicCapIcon, GlobeAltIcon as HeroGlobeAltIcon, UsersIcon, SparklesIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, LightBulbIcon } from '@heroicons/react/24/outline'; // Using Heroicons
import { ChevronRightIcon } from '@/components/icons/CommonIcons'; // Assuming this is still relevant

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const reasonsToStudyAbroad = [
  {
    icon: <HeroGlobeAltIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Gain a Global Perspective',
    text: 'Immerse yourself in new cultures, broaden your worldview, and develop a deeper understanding of global issues and different ways of life.',
  },
  {
    icon: <AcademicCapIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Access Quality Education',
    text: 'Explore diverse educational systems and institutions worldwide, many offering specialized programs and research opportunities not available in your home country.',
  },
  {
    icon: <SparklesIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Enhance Career Opportunities',
    text: 'An international degree and experience can significantly boost your resume, opening doors to global job markets and multinational companies.',
  },
  {
    icon: <UsersIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Develop Personal Growth',
    text: 'Step out of your comfort zone, build independence, resilience, and adaptability – essential life skills for personal and professional success.',
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Improve Language Skills',
    text: 'Master a new language or enhance your existing skills through daily immersion, a highly effective way to achieve fluency.',
  },
  {
    icon: <LightBulbIcon className="w-12 h-12 text-brand-secondary mb-4" />,
    title: 'Build an International Network',
    text: 'Connect with students, academics, and professionals from around the world, creating valuable lifelong friendships and professional contacts.',
  },
];

export default function StudyAbroadPage() {
  return (
    <div className="bg-brand-light">
      {/* Hero Section for Study Abroad */}
      <motion.section 
        className="relative py-28 md:py-40 bg-gradient-to-br from-brand-primary via-blue-700 to-indigo-600 text-white text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image 
            src="/study-abroad-hero.jpg" // Placeholder: Diverse students in various international settings
            alt="Students studying in various international locations" 
            layout="fill" 
            objectFit="cover" 
            className="absolute inset-0 z-0 opacity-30"
            priority
        />
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeInUp} initial="initial" animate="animate"
          >
            Embark on Your International Education Adventure
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-blue-100"
            variants={fadeInUp} initial="initial" animate="animate" custom={0.2}
          >
            Explore world-class universities, diverse cultures, and gain a globally recognized qualification. Your journey to studying abroad starts here.
          </motion.p>
          <motion.div
            variants={fadeInUp} initial="initial" animate="animate" custom={0.4}
          >
            <Link href="/study-abroad/universities" className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg transform hover:scale-105 inline-block">
              Explore Destinations & Universities
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Study Abroad Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary text-center mb-4">Why Consider Studying Abroad?</h2>
            <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Discover why thousands of students choose to pursue their education abroad and how it can transform your future.
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {reasonsToStudyAbroad.map((reason, index) => (
              <motion.div 
                key={index} 
                className="feature-card flex flex-col items-center text-center"
                variants={fadeInUp}
              >
                {reason.icon}
                <h3 className="text-xl font-semibold text-brand-primary my-3">{reason.title}</h3>
                <p className="text-sm text-gray-700">{reason.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Understanding International Education Systems Section */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">Navigating Global Education</h2>
              <div className="space-y-4 text-gray-700">
                <p>Education systems vary significantly across countries, each offering unique strengths and specializations. Common degree structures include:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Bachelor's Degrees:</strong> Typically 3-4 years, forming the foundation of higher education.</li>
                  <li><strong>Master's Degrees:</strong> Usually 1-2 years, offering specialized knowledge in a particular field.</li>
                  <li><strong>Doctoral Degrees (PhDs):</strong> Research-intensive programs typically lasting 3-5 years or more.</li>
                </ul>
                <p>Teaching styles can range from lecture-based to highly interactive seminars and practical work. Researching and understanding these differences is key to finding the right fit for your academic goals.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/global-.png" // Placeholder: Montage of diverse university campuses
                alt="Diverse international university campuses" 
                layout="fill" 
                objectFit="cover" 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Global Cultures Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary text-center mb-4">Immerse Yourself in New Cultures</h2>
              <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
                We offer guidance for studies in these popular destinations and many more countries around the world.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Cultural Exploration', text: 'Discover museums, historical sites, local cuisines, and festivals. Every country offers unique traditions to explore.', image: '/cultural-exploration.png' },
                { title: 'Travel Opportunities', text: 'Many study destinations offer easy access to explore neighboring regions or countries, broadening your horizons even further.&apos;', 
                  image: '/travel-oppertunities.png' },
                { title: 'Vibrant Student Life', text: 'Engage with diverse student communities, join clubs, and participate in activities that enrich your social and cultural experience.&apos;', 
                  image: '/vibrant-student-life.png' },
              ].map((item, index) => (
                <motion.div 
                    key={index} 
                    className="card overflow-hidden"
                    variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} custom={index * 0.1}
                >
                    <div className="relative h-60 w-full">
                        <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-brand-primary mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* CTA to explore universities or contact */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary"
            variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}
          >
            Ready to Explore International Study Options?
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto"
            variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} custom={0.2}
          >
            Our team is here to help you navigate the world of international education and find the perfect fit for your aspirations.
          </motion.p>
          <motion.div
             variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} custom={0.4}
          >
            <Link href="/study-abroad/universities" className="bg-brand-secondary hover:bg-yellow-500 text-brand-primary font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 inline-block mr-0 md:mr-4 mb-4 md:mb-0">
              View Destinations & Universities
            </Link>
            <Link href="/contact" className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 inline-block">
              Contact Us for Guidance
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 