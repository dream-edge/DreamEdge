"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  bookConsultation,
  getConsultationTimeSlots,
  getEducationLevelOptions,
  getStudyInterestOptions 
} from "@/lib/api";
import toast from 'react-hot-toast';

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

export default function BookConsultation() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    alt_date: "",
    alt_time: "",
    education_level: "",
    preferred_location: "online",
    study_interests: "",
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

  // Dynamic options state
  const [timeSlots, setTimeSlots] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [studyInterests, setStudyInterests] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      setIsLoadingOptions(true);
      try {
        const [timeSlotsRes, eduLevelsRes, studyInterestsRes] = await Promise.all([
          getConsultationTimeSlots(), // Gets active slots
          getEducationLevelOptions(), // Gets active education levels
          getStudyInterestOptions()   // Gets active study interests
        ]);

        if (timeSlotsRes.success) {
          setTimeSlots(timeSlotsRes.data.map(slot => slot.time_range_display));
        } else {
          toast.error('Failed to load time slots. Please refresh.');
          setTimeSlots(['Error loading slots']); // Fallback
        }

        if (eduLevelsRes.success) {
          setEducationLevels(eduLevelsRes.data.map(level => level.level_name));
        } else {
          toast.error('Failed to load education levels. Please refresh.');
          setEducationLevels(['Error loading levels']); // Fallback
        }

        if (studyInterestsRes.success) {
          setStudyInterests(studyInterestsRes.data.map(interest => interest.interest_name));
        } else {
          toast.error('Failed to load study interests. Please refresh.');
          setStudyInterests(['Error loading interests']); // Fallback
        }

      } catch (error) {
        console.error("Failed to load form options:", error);
        toast.error('Could not load all consultation options. Some fields may be unavailable.');
        // Provide some basic fallbacks so the form doesn't break completely
        setTimeSlots(['10:00 AM - 11:00 AM', '11:30 AM - 12:30 PM']);
        setEducationLevels(['Bachelor&apos;s Degree', 'Master&apos;s Degree']);
        setStudyInterests(['Business & Management', 'Engineering & Technology']);
      }
      setIsLoadingOptions(false);
    }
    fetchOptions();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\+?[0-9\s\-()]{7,}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
        
      case "preferred_date":
        if (!value) {
          error = "Preferred date is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            error = "Date cannot be in the past";
          }
        }
        break;
        
      case "preferred_time":
        if (!value) {
          error = "Preferred time slot is required";
        }
        break;
        
      case "education_level":
        if (!value) {
          error = "Current education level is required";
        }
        break;
        
      case "study_interests":
        if (!value) {
          error = "Area of study interest is required";
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
    // Validate all required fields
    const newErrors = {};
    let isValid = true;
    
    // List of required fields
    const requiredFields = [
      "name", "email", "phone", "preferred_date", 
      "preferred_time", "education_level", "study_interests"
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    });
    
    // Optional fields that still need validation if they have values
    if (formData.alt_date) {
      const error = validateField("preferred_date", formData.alt_date); // Reuse same validation logic
      if (error) {
        isValid = false;
        newErrors.alt_date = error;
      }
    }
    
    if (formData.alt_time && !formData.alt_date) {
      newErrors.alt_date = "Alternate date is required if you specify an alternate time";
      isValid = false;
    }
    
    setErrors(newErrors);
    
    // Mark required fields as touched
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    
    if (formData.alt_date) newTouched.alt_date = true;
    if (formData.alt_time) newTouched.alt_time = true;
    
    setTouched(prev => ({...prev, ...newTouched}));
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Set loading state
    setFormStatus({
      ...formStatus,
      isLoading: true,
    });
    
    try {
      // Submit to Supabase
      const result = await bookConsultation(formData);
      
      if (result.success) {
        // Success
        setFormStatus({
          submitted: true,
          success: true,
          message: "Thank you for booking a consultation. We'll contact you to confirm your appointment soon!",
          isLoading: false,
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferred_date: "",
          preferred_time: "",
          alt_date: "",
          alt_time: "",
          education_level: "",
          preferred_location: "online",
          study_interests: "",
          message: "",
        });
        
        // Reset touched and errors
        setTouched({});
        setErrors({});
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Error
        setFormStatus({
          submitted: true,
          success: false,
          message: "There was an error booking your consultation. Please try again later.",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error booking consultation:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message: "There was an error booking your consultation. Please try again later.",
        isLoading: false,
      });
    }
  };

  // Benefits of consultation
  const benefits = [
    {
      title: "Personalized Guidance",
      description: "Get tailored advice based on your academic background, career goals, and personal preferences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      )
    },
    {
      title: "Accurate Information",
      description: "Learn about the latest UK university admission requirements, visa regulations, and scholarship opportunities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Strategic Planning",
      description: "Develop a clear roadmap for your UK education journey with timelines and actionable steps.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="relative bg-brand-primary text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          {/* Pattern or background */}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Your Free Consultation
            </h1>
            <p className="text-lg md:text-xl mb-0">
              Take the first step toward your UK education journey with personalized guidance from our expert counselors. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Consultation Benefits */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Why Book a Consultation?</h2>
              
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 text-brand-secondary">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-primary mb-2">{benefit.title}</h3>
                      <p className="text-gray-700">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-primary mb-3">What to Expect</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-brand-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-45 minute one-on-one session</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-brand-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Discussion of your academic background</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-brand-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Exploration of UK study options</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-brand-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Information about costs and scholarships</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-brand-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Initial action plan for your application</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Booking Form */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Schedule Your Free Consultation</h2>
              
              {formStatus.submitted ? (
                <div className={`p-6 rounded-lg ${formStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`text-xl font-semibold mb-2 ${formStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                    {formStatus.success ? 'Consultation Booked!' : 'Something went wrong'}
                  </h3>
                  <p className={formStatus.success ? 'text-green-600' : 'text-red-600'}>
                    {formStatus.message}
                  </p>
                  {formStatus.success && (
                    <div className="mt-6">
                      <Link href="/study-abroad/universities" className="text-brand-primary hover:underline font-medium">
                        Explore study destinations while you wait →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-1">
                          Full Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">
                          Email Address*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                  
                  {/* Consultation Scheduling */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary mb-4">Preferred Consultation Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="preferred_date" className="block text-sm font-medium text-brand-dark mb-1">
                          Preferred Date*
                        </label>
                        <input
                          type="date"
                          id="preferred_date"
                          name="preferred_date"
                          value={formData.preferred_date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                        {errors.preferred_date && <p className="text-red-500 text-sm">{errors.preferred_date}</p>}
                      </div>
                      <div>
                        <label htmlFor="preferred_time" className="block text-sm font-medium text-brand-dark mb-1">
                          Preferred Time*
                        </label>
                        <select
                          id="preferred_time"
                          name="preferred_time"
                          value={formData.preferred_time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoadingOptions}
                          className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out ${errors.preferred_time ? 'border-red-500 error-field' : 'border-gray-300'}`}
                        >
                          <option value="">{isLoadingOptions ? 'Loading times...' : 'Select a time slot'}</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                        {errors.preferred_time && <p className="text-red-500 text-xs mt-1">{errors.preferred_time}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="alt_date" className="block text-sm font-medium text-brand-dark mb-1">
                          Alternative Date
                        </label>
                        <input
                          type="date"
                          id="alt_date"
                          name="alt_date"
                          value={formData.alt_date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                        {errors.alt_date && <p className="text-red-500 text-sm">{errors.alt_date}</p>}
                      </div>
                      <div>
                        <label htmlFor="alt_time" className="block text-sm font-medium text-brand-dark mb-1">
                          Alternative Time
                        </label>
                        <select
                          id="alt_time"
                          name="alt_time"
                          value={formData.alt_time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoadingOptions}
                          className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out ${errors.alt_time ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">{isLoadingOptions ? 'Loading times...' : 'Select an alternate time'}</option>
                          {timeSlots.map((slot) => (
                            <option key={`alt-${slot}`} value={slot}>{slot}</option>
                          ))}
                        </select>
                        {errors.alt_time && <p className="text-red-500 text-xs mt-1">{errors.alt_time}</p>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Consultation Type */}
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Preferred Consultation Method*
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferred_location"
                          value="online"
                          checked={formData.preferred_location === "online"}
                          onChange={handleChange}
                          className="h-4 w-4 text-brand-primary"
                        />
                        <span className="ml-2 text-gray-700">Online (Zoom/Google Meet)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferred_location"
                          value="office"
                          checked={formData.preferred_location === "office"}
                          onChange={handleChange}
                          className="h-4 w-4 text-brand-primary"
                        />
                        <span className="ml-2 text-gray-700">In-Office Visit</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Academic Background */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary mb-4">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="education_level" className="block text-sm font-medium text-brand-dark mb-1">
                          Current Education Level*
                        </label>
                        <select
                          id="education_level"
                          name="education_level"
                          value={formData.education_level}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoadingOptions}
                          className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out ${errors.education_level ? 'border-red-500 error-field' : 'border-gray-300'}`}
                        >
                          <option value="">{isLoadingOptions ? 'Loading levels...' : 'Select your education level'}</option>
                          {educationLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        {errors.education_level && <p className="text-red-500 text-xs mt-1">{errors.education_level}</p>}
                      </div>
                      <div>
                        <label htmlFor="study_interests" className="block text-sm font-medium text-brand-dark mb-1">
                          Study Interests*
                        </label>
                        <select
                          id="study_interests"
                          name="study_interests"
                          value={formData.study_interests}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoadingOptions}
                          className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out ${errors.study_interests ? 'border-red-500 error-field' : 'border-gray-300'}`}
                        >
                          <option value="">{isLoadingOptions ? 'Loading interests...' : 'Select your area of interest'}</option>
                          {studyInterests.map((interest) => (
                            <option key={interest} value={interest}>{interest}</option>
                          ))}
                        </select>
                        {errors.study_interests && <p className="text-red-500 text-xs mt-1">{errors.study_interests}</p>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-1">
                      Anything specific you&apos;d like to discuss?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                      placeholder="Please share any specific questions or areas you want to cover during your consultation..."
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                      disabled={formStatus.isLoading}
                    >
                      {formStatus.isLoading ? "Submitting..." : "Book Consultation"}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      By booking a consultation, you agree to our privacy policy and terms of service.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2 text-brand-primary">What Our Students Say</h2>
            <p className="text-lg text-brand-accent max-w-2xl mx-auto">
              Hear from students who started their UK education journey with a free consultation at Dream Consultancy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src="/testimonials/rajiv-placeholder.jpg"
                    alt="Rajiv Poudel"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-brand-primary">Rajiv Poudel</h3>
                  <p className="text-sm text-brand-secondary">MSc Computer Science, University of Leeds</p>
                </div>
              </div>
              <blockquote className="italic text-brand-accent">
                &quot;My initial consultation was eye-opening! I had so many misconceptions about studying in the UK that were cleared up in just one session. The counselor mapped out a clear path for me to follow.&quot;
              </blockquote>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src="/testimonials/sima-placeholder.jpg"
                    alt="Sima Adhikari"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-brand-primary">Sima Adhikari</h3>
                  <p className="text-sm text-brand-secondary">BA Business Management, University of Sussex</p>
                </div>
              </div>
              <blockquote className="italic text-brand-accent">
                &quot;I was overwhelmed by all the university options, but after my consultation, I had a shortlist of schools perfectly matched to my goals and budget. I&apos;m now thriving at my dream university!&quot;
              </blockquote>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={2}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src="/testimonials/dinesh-placeholder.jpg"
                    alt="Dinesh Karki"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-brand-primary">Dinesh Karki</h3>
                  <p className="text-sm text-brand-secondary">MSc Finance, University of Glasgow</p>
                </div>
              </div>
              <blockquote className="italic text-brand-accent">
                &quot;From that first consultation to the day I received my UK student visa, Dream Consultancy supported me every step of the way. Their guidance in choosing between similar programs was invaluable.&quot;
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2 text-brand-primary">Frequently Asked Questions</h2>
            <p className="text-lg text-brand-accent max-w-2xl mx-auto">
              Common questions about our free consultation service.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp} className="bg-brand-light rounded-lg p-6">
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Is the consultation really free?</h3>
                <p className="text-brand-accent">
                  Yes, your initial consultation is completely free with no obligation. We believe in providing value first 
                  and helping you make informed decisions about your education journey.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-brand-light rounded-lg p-6">
                <h3 className="text-xl font-semibold text-brand-primary mb-3">How should I prepare for the consultation?</h3>
                <p className="text-brand-accent">
                  It helps to have your academic documents ready (transcripts, certificates) and a general idea of 
                  your study preferences and career goals. However, even if you&apos;re just starting to explore options, 
                  we can provide valuable guidance.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-brand-light rounded-lg p-6">
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Can I reschedule my consultation?</h3>
                <p className="text-brand-accent">
                  Yes, you can reschedule your consultation up to 24 hours before the scheduled time. 
                  Simply call our office or email us with your new preferred dates and times.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-brand-light rounded-lg p-6">
                <h3 className="text-xl font-semibold text-brand-primary mb-3">What happens after the consultation?</h3>
                <p className="text-brand-accent">
                  After the consultation, we&apos;ll email you a summary of what was discussed along with a recommended 
                  action plan. You can then decide if you&apos;d like to proceed with our services for application assistance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 