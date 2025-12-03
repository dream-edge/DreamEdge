"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { submitContactForm, getSiteSettings } from "@/lib/api";
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// Animation variants
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

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    isLoading: false,
  });

  // Site settings state
  const [siteSettings, setSiteSettings] = useState(null);
  const [isLoadingSiteSettings, setIsLoadingSiteSettings] = useState(true);

  useEffect(() => {
    async function loadSiteSettings() {
      setIsLoadingSiteSettings(true);
      try {
        const apiResponse = await getSiteSettings();
        if (apiResponse && apiResponse.success && apiResponse.data) {
          setSiteSettings(apiResponse.data);
        } else {
          console.error("Failed to load site settings for contact page or data is null/invalid:", apiResponse?.error);
          // Fallback settings if API fails or response is not as expected
          setSiteSettings({
            site_name: 'Dream Consultancy',
            primary_phone: 'N/A',
            primary_email: 'N/A',
            primary_address_line1: 'Default Address Line 1',
            primary_address_line2: '',
            office_hours: 'N/A',
            map_embed_url_main_office: '',
            facebook_url: '',
            instagram_url: '',
            twitter_url: '',
            linkedin_url: ''
          });
        }
      } catch (error) {
        console.error("Failed to load site settings for contact page:", error);
        // Fallback settings if API fails
        setSiteSettings({
          site_name: 'Dream Consultancy',
          primary_phone: 'N/A',
          primary_email: 'N/A',
          primary_address_line1: 'Default Address Line 1',
          primary_address_line2: '',
          office_hours: 'N/A',
          map_embed_url_main_office: '',
          facebook_url: '',
          instagram_url: '',
          twitter_url: '',
          linkedin_url: ''
        });
      }
      setIsLoadingSiteSettings(false);
    }
    loadSiteSettings();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        if (value.trim() && !/^\+?[0-9\s\-()]{7,}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
        
      case "subject":
        if (!value.trim()) {
          error = "Please select a subject";
        }
        break;
        
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message should be at least 10 characters";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    // Validate all fields
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setFormStatus({
      ...formStatus,
      isLoading: true,
    });
    
    try {
      // Submit to Supabase
      const result = await submitContactForm(formData);
      
      if (result.success) {
        // Success
        setFormStatus({
          submitted: true,
          success: true,
          message: "Thank you for your message. We'll get back to you soon!",
          isLoading: false,
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        // Reset touched and errors
        setTouched({});
        setErrors({});
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setFormStatus({
            submitted: false,
            success: false,
            message: "",
            isLoading: false,
          });
        }, 5000);
      } else {
        // Error
        setFormStatus({
          submitted: true,
          success: false,
          message: "There was an error submitting your message. Please try again later.",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message: "There was an error submitting your message. Please try again later.",
        isLoading: false,
      });
    }
  };

  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="relative bg-brand-primary text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg md:text-xl">
              Have questions about international education opportunities? We&apos;re here to help you navigate your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-brand-primary mb-6">Send Us a Message</h2>
              <p className="mb-8 text-gray-600">
                Fill out the form below, and our team will get back to you as soon as possible.
              </p>
              
              {/* Success Message */}
              {formStatus.submitted && formStatus.success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-1">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full p-3 border rounded-md transition-all duration-200 outline-none ${
                        errors.name && touched.name 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full p-3 border rounded-md transition-all duration-200 outline-none ${
                        errors.email && touched.email 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-md transition-all duration-200 outline-none ${
                      errors.phone && touched.phone 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    }`}
                    placeholder="+977 XXXXXXXXXX"
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brand-dark mb-1">
                    Subject<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-3 border rounded-md transition-all duration-200 outline-none ${
                      errors.subject && touched.subject 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="admission">Admission Guidance</option>
                    <option value="visa">Visa Support</option>
                    <option value="scholarship">Scholarship Information</option>
                    <option value="test-prep">Test Preparation</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && touched.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-1">
                    Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-3 border rounded-md transition-all duration-200 outline-none ${
                      errors.message && touched.message 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    }`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {errors.message && touched.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors w-full md:w-auto"
                    disabled={formStatus.isLoading}
                  >
                    <span>{formStatus.isLoading ? "Sending..." : "Send Message"}</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl font-bold text-brand-primary mb-6">Visit Our Offices</h2>
                <p className="mb-8 text-gray-600">
                  We have offices in major cities across Nepal to better serve you. Feel free to visit us during business hours.
                </p>
              </div>
              
              {/* Office Locations */}
              <div className="space-y-8">
                {/* Office Locations Section */}
                <section className="py-16 md:py-24 bg-white">
                  <div className="container mx-auto px-4">
                    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="text-center mb-12 md:mb-16">
                      <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Our Main Office</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Visit us or get in touch. We are here to help you with your educational journey.
                      </p>
                    </motion.div>

                    {isLoadingSiteSettings ? (
                      <div className="text-center text-gray-600">Loading office details...</div>
                    ) : siteSettings ? (
                      <motion.div 
                        variants={staggerContainer} 
                        initial="initial" 
                        animate="animate" 
                        className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto"
                      >
                        <motion.h3 variants={fadeInUp} className="text-2xl font-semibold text-brand-primary mb-6">
                          {siteSettings.site_name} - Main Office
                        </motion.h3>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                          <motion.div variants={fadeInUp} className="space-y-4">
                            {siteSettings.primary_address_line1 && (
                              <div className="flex items-start">
                                <FiMapPin className="text-brand-secondary mr-3 mt-1 flex-shrink-0" size={20}/>
                                <p className="text-gray-700">
                                  {siteSettings.primary_address_line1}
                                  {siteSettings.primary_address_line2 && <br/>}
                                  {siteSettings.primary_address_line2}
                                </p>
                              </div>
                            )}
                            {siteSettings.primary_phone && (
                              <div className="flex items-center">
                                <FiPhone className="text-brand-secondary mr-3 flex-shrink-0" size={20}/>
                                <a href={`tel:${siteSettings.primary_phone}`} className="text-gray-700 hover:text-brand-secondary">{siteSettings.primary_phone}</a>
                              </div>
                            )}
                            {siteSettings.primary_email && (
                              <div className="flex items-center">
                                <FiMail className="text-brand-secondary mr-3 flex-shrink-0" size={20}/>
                                <a href={`mailto:${siteSettings.primary_email}`} className="text-gray-700 hover:text-brand-secondary">{siteSettings.primary_email}</a>
                              </div>
                            )}
                            {siteSettings.office_hours && (
                              <div className="flex items-center">
                                <FiClock className="text-brand-secondary mr-3 flex-shrink-0" size={20}/>
                                <p className="text-gray-700">{siteSettings.office_hours}</p>
                              </div>
                            )}
                          </motion.div>

                          {siteSettings.map_embed_url_main_office && (
                            <motion.div variants={fadeInUp} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                              <iframe 
                                src={siteSettings.map_embed_url_main_office}
                                width="100%"
                                height="100%" 
                                style={{ border:0 }}
                                allowFullScreen=""
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`${siteSettings.site_name} Main Office Location`}
                              ></iframe>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center text-red-500">Could not load office details. Please try again later.</div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Office Hours and Phone Support */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-3">Office Hours</h3>
              <p>Sunday to Friday</p>
              <p className="text-2xl font-bold text-brand-secondary">
                {siteSettings?.office_hours || "10:00 AM - 5:00 PM"}
              </p>
              <p className="mt-2 text-sm">Closed on Saturdays and public holidays</p>
            </div>
            
            <div className="text-center p-6 border-t md:border-l md:border-t-0 border-white/20">
              <h3 className="text-xl font-semibold mb-3">Phone Support</h3>
              <p>Call us for immediate assistance</p>
              <p className="text-2xl font-bold text-brand-secondary">
                {siteSettings?.primary_phone || "+977-1-4123456"}
              </p>
              <p className="mt-2 text-sm">During office hours</p>
            </div>
            
            <div className="text-center p-6 border-t md:border-l md:border-t-0 border-white/20">
              <h3 className="text-xl font-semibold mb-3">Email Support</h3>
              <p>Send us your queries anytime</p>
              <p className="text-xl font-bold text-brand-secondary">
                {siteSettings?.primary_email || "info@dreamconsultancy.com"}
              </p>
              <p className="mt-2 text-sm">We respond within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media and Other Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-primary mb-8">Connect With Us</h2>
          
          <div className="flex justify-center space-x-8 mb-12">
            {/* Social media icons with dynamic links */}
            {siteSettings?.facebook_url && (
              <a 
                href={siteSettings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-brand-light hover:bg-brand-primary hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FaFacebookF size={24} />
              </a>
            )}
            {siteSettings?.instagram_url && (
              <a 
                href={siteSettings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-brand-light hover:bg-brand-primary hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            )}
            {siteSettings?.twitter_url && (
              <a 
                href={siteSettings.twitter_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-brand-light hover:bg-brand-primary hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
            )}
            {siteSettings?.linkedin_url && (
              <a 
                href={siteSettings.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-brand-light hover:bg-brand-primary hover:text-white rounded-full transition-all duration-300 transform hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={24} />
              </a>
            )}
          </div>
          
          <p className="text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re just starting to explore UK study options or ready to begin your application, we&apos;re here to guide you every step of the way. Reach out to us through any of the channels above, and our expert counselors will be happy to assist you.
          </p>
        </div>
      </section>
    </div>
  );
} 