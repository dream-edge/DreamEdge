"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/api';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const SocialIcon = ({ href, icon: IconComponent, name }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-brand-secondary-200 hover:text-white transition-colors"
    aria-label={name}
  >
    <IconComponent size={22} />
  </a>
);

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true); // Ensure loading state is true at the start
      try {
        const apiResponse = await getSiteSettings();
        if (apiResponse && apiResponse.success && apiResponse.data) {
          setSettings(apiResponse.data); // Store the nested 'data' object
        } else {
          console.error("Failed to load site settings for footer or data is null/invalid:", apiResponse?.error);
          // Use fallback/default data if settings fail to load or response is not as expected
          setSettings({
            site_name: 'Dream Edge',
            primary_phone: 'N/A',
            primary_email: 'N/A',
            primary_address_line1: 'Kathmandu, Nepal',
            footer_about_text: 'Dream Edge is Nepal\'s trusted overseas education consultancy, helping students study abroad in Europe, Australia, New Zealand, USA, Canada, UK & Japan. Expert guidance for university admissions, student visa assistance, and test preparation.',
            copyright_year_start: null, 
            facebook_url: '#',
            instagram_url: '#',
            linkedin_url: '#',
            twitter_url: '#',
          });
        }
      } catch (error) {
        console.error("Failed to load site settings for footer:", error);
        // Use fallback/default data if settings fail to load
        setSettings({
          site_name: 'Dream Edge',
          primary_phone: 'N/A',
          primary_email: 'N/A',
          primary_address_line1: 'Kathmandu, Nepal',
          footer_about_text: 'Dream Edge is Nepal\'s trusted overseas education consultancy, helping students study abroad in Europe, Australia, New Zealand, USA, Canada, UK & Japan. Expert guidance for university admissions, student visa assistance, and test preparation.',
          copyright_year_start: null, // Will default to current year if null
          facebook_url: '#',
          instagram_url: '#',
          linkedin_url: '#',
          twitter_url: '#',
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const currentYear = new Date().getFullYear();
  const copyrightStartYear = settings?.copyright_year_start;
  const copyrightText = copyrightStartYear && copyrightStartYear !== currentYear 
    ? `${copyrightStartYear} - ${currentYear}` 
    : currentYear;

  const usefulLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Universities', href: '/study-abroad/universities' },
    { name: 'Test Preparation', href: '/test-preparation' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  // Social media links will now come from settings
  const socialMediaLinks = settings ? [
    { name: 'Facebook', href: settings.facebook_url, icon: FaFacebook, show: !!settings.facebook_url },
    { name: 'Instagram', href: settings.instagram_url, icon: FaInstagram, show: !!settings.instagram_url },
    { name: 'LinkedIn', href: settings.linkedin_url, icon: FaLinkedin, show: !!settings.linkedin_url },
    { name: 'Twitter', href: settings.twitter_url, icon: FaTwitter, show: !!settings.twitter_url },
  ].filter(item => item.show) : [];

  if (isLoading) {
    // Optional: Render a slimmed-down footer or a loading placeholder
    // For now, returning null to avoid layout shift or showing static content briefly
    return (
        <footer className="bg-brand-primary-600 text-white pt-12 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                Loading footer...
            </div>
        </footer>
    );
  }
  
  return (
    <footer className="bg-brand-primary-600 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About & Logo */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {settings?.site_name || 'Dream Edge'}
            </h3>
            <p className="text-sm text-brand-secondary-200 mb-6 leading-relaxed">
              {settings?.footer_about_text || 'Dream Edge - Study abroad from Nepal with expert guidance.'}
            </p>
            {socialMediaLinks.length > 0 && (
              <div className="flex space-x-5">
                {socialMediaLinks.map(social => (
                  <SocialIcon key={social.name} href={social.href} icon={social.icon} name={social.name} />
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Useful Links</h4>
            <ul className="space-y-2">
              {usefulLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-brand-secondary-200 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic text-sm space-y-2 text-brand-secondary-200">
              {settings?.primary_address_line1 && <p>{settings.primary_address_line1}</p>}
              {settings?.primary_address_line2 && <p>{settings.primary_address_line2}</p>}
              {settings?.primary_phone && 
                <p>Phone: <a href={`tel:${settings.primary_phone}`} className="hover:text-white transition-colors">{settings.primary_phone}</a></p>}
              {settings?.primary_email && 
                <p>Email: <a href={`mailto:${settings.primary_email}`} className="hover:text-white transition-colors">{settings.primary_email}</a></p>}
              {settings?.office_hours && <p>Hours: {settings.office_hours}</p>}
            </address>
          </div>

          {/* Column 4: Newsletter Signup - (To be implemented in Phase 2) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-brand-secondary-200 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            {/* Newsletter form will be handled in Phase 2 */}
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-l-md text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                required
              />
              <button
                type="submit"
                className="bg-brand-accent text-white px-4 py-2 rounded-r-md hover:bg-brand-accent-600 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-primary-700 pt-6 text-center text-sm text-brand-secondary-300">
          <p>&copy; {copyrightText} {settings?.site_name || 'Dream Edge'}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
} 