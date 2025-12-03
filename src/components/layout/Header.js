"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, XIcon, ChevronDownIcon } from '@/components/icons/CommonIcons.js';
import { getServices, getTestPrepCourses, getStudyDestinations } from '@/lib/api'; // Import API functions

const NavLink = ({ href, children, hasDropdown, isMobile, onClick }) => (
  <Link href={href} onClick={onClick} className={`px-3 py-2 rounded-md text-sm font-medium ${isMobile ? 'block' : 'inline-block'} text-brand-dark hover:text-brand-primary hover:bg-brand-primary-50 transition-colors`}>
    {children}
    {hasDropdown && <ChevronDownIcon />}
  </Link>
);

const DropdownMenu = ({ items, parentName, parentHref, isMobile, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!isMobile) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);
  
  const handleItemClick = () => {
    setIsOpen(false);
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <div className="flex items-center">
        <Link 
          href={parentHref} 
          onClick={isMobile ? (e) => { e.preventDefault(); setIsOpen(!isOpen); } : undefined}
          className={`px-3 py-2 rounded-md text-sm font-medium ${isMobile ? 'block w-full text-left' : 'inline-block'} text-brand-dark hover:text-brand-primary hover:bg-brand-primary-50 transition-colors`}
        >
          {parentName}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 -ml-1 text-brand-dark hover:text-brand-primary transition-colors ${isMobile ? '' : ''}`}
          aria-label={`Toggle ${parentName} dropdown menu`}
        >
          <ChevronDownIcon />
        </button>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isMobile ? 'pl-4' : 'absolute z-20 mt-1 w-56 bg-white shadow-md rounded-md py-1 border border-gray-100'}`}
        >
          {items.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`block px-4 py-2 text-sm ${isMobile ? 'text-brand-dark' : 'text-gray-700'} hover:bg-brand-primary-50 hover:text-brand-primary`}
              onClick={handleItemClick}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicNavItems, setDynamicNavItems] = useState([]);
  const [isLoadingNav, setIsLoadingNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchNavData() {
      setIsLoadingNav(true);
      try {
        const [servicesRes, testPrepRes, studyDestinationsRes] = await Promise.all([
          getServices(),
          getTestPrepCourses(),
          getStudyDestinations()
        ]);

        const testPrepSubItems = testPrepRes.success && testPrepRes.data 
          ? testPrepRes.data.map(course => ({
              name: course.test_name,
              href: `/test-preparation/${course.slug}`
            })) 
          : [];

        const studentServicesSubItems = servicesRes.success && servicesRes.data
          ? servicesRes.data.map(service => ({
              name: service.name,
              href: `/student-services/${service.slug}` // Assuming a similar slug structure for services page
            }))
          : [];

        // Dynamic list of countries for the Study Abroad dropdown
        const countriesSubItems = studyDestinationsRes.success && studyDestinationsRes.data
          ? studyDestinationsRes.data.map(destination => ({
              name: destination.display_name,
              href: `/study-abroad/${destination.country_slug}`
            }))
          : [];
        
        // Always add "All Universities" option at the top
        countriesSubItems.unshift({ name: 'All Universities', href: '/study-abroad/universities' });

        const baseNavItems = [
          {
            name: 'Study Abroad', href: '/study-abroad', isDropdown: true,
            subItems: countriesSubItems
          },
          {
            name: 'Test Preparation', href: '/test-preparation', isDropdown: true,
            subItems: testPrepSubItems
          },
          {
            name: 'Student Services', href: '/services', isDropdown: true, // Main link points to general services page
            subItems: studentServicesSubItems
          },
          { name: 'About Us', href: '/about' },
          { name: 'Contact', href: '/contact' },
        ];
        setDynamicNavItems(baseNavItems);
      } catch (error) {
        console.error("Failed to load dynamic navigation items:", error);
        // Fallback to static nav items if API fails
        setDynamicNavItems([
          {
            name: 'Study Abroad', href: '/study-abroad', isDropdown: true,
            subItems: [
              { name: 'All Universities', href: '/study-abroad/universities' },
              { name: 'United Kingdom', href: '/study-abroad/uk' },
              { name: 'USA', href: '/study-abroad/usa' },
              { name: 'Canada', href: '/study-abroad/canada' },
            ]
          },
          { name: 'Services', href: '/services' }, // General link
          { name: 'Test Preparation', href: '/test-preparation', isDropdown: true, subItems: [] },
          { name: 'About Us', href: '/about' },
          { name: 'Contact', href: '/contact' },
        ]);
      }
      setIsLoadingNav(false);
    }
    fetchNavData();
  }, []);

  const navItemsToRender = isLoadingNav ? 
    [
        { name: 'Loading...', href: '#' }, 
        // You can provide a skeleton structure if preferred
    ] 
    : dynamicNavItems;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-gray-100 py-2' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logos/logo.png" 
                alt="Dream Edge Education Consultancy Logo" 
                width={180} 
                height={40}
                className="h-24 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItemsToRender.map((item) =>
              item.isDropdown && item.subItems && item.subItems.length > 0 ? (
                <DropdownMenu 
                  key={item.name} 
                  items={item.subItems} 
                  parentName={item.name} 
                  parentHref={item.href}
                />
              ) : (
                <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
              )
            )}
          </nav>
          
          <div className="hidden md:block">
            <Link href="/book-consultation" className="btn-accent text-sm py-2 px-4 shadow-sm">
              Book Free Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-brand-primary hover:text-brand-primary-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-sm border-t border-gray-100"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItemsToRender.map((item) =>
              item.isDropdown && item.subItems && item.subItems.length > 0 ? (
                <DropdownMenu 
                  key={item.name} 
                  items={item.subItems} 
                  parentName={item.name} 
                  parentHref={item.href}
                  isMobile={true}
                  closeMobileMenu={closeMobileMenu}
                />
              ) : (
                <NavLink key={item.name} href={item.href} isMobile={true} onClick={closeMobileMenu}>
                  {item.name}
                </NavLink>
              )
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/book-consultation" 
                className="block px-3 py-2 rounded-md text-white font-medium bg-brand-accent hover:bg-brand-accent-600 transition-colors text-center shadow-sm"
                onClick={closeMobileMenu}
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
} 