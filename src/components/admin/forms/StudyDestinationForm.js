"use client";

import { useState, useEffect, useCallback } from 'react';
import { createStudyDestination, updateStudyDestination } from '@/lib/api';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';

export default function StudyDestinationForm({ initialData, onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    country_slug: '',
    display_name: '',
    meta_title: '',
    meta_description: '',
    seo_keywords: '',
    hero_image_url: '',
    intro_text: '',
    quick_facts: '{}',
    why_study_here_content: '',
    education_system_content: '',
    popular_courses_content: '',
    admission_requirements_content: '',
    cost_studying_living_content: '',
    visa_requirements_content: '',
    scholarships_content: '',
    country_specific_faqs: '[]',
    additional_sections: '[]',
    sidebar_nav_links: '[]',
    is_active: true,
    display_order: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [jsonErrors, setJsonErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        quick_facts: initialData.quick_facts ? JSON.stringify(initialData.quick_facts, null, 2) : '{}',
        country_specific_faqs: initialData.country_specific_faqs ? JSON.stringify(initialData.country_specific_faqs, null, 2) : '[]',
        additional_sections: initialData.additional_sections ? JSON.stringify(initialData.additional_sections, null, 2) : '[]',
        sidebar_nav_links: initialData.sidebar_nav_links ? JSON.stringify(initialData.sidebar_nav_links, null, 2) : '[]',
        display_order: initialData.display_order !== null ? String(initialData.display_order) : ''
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear JSON error for this field if it exists
    if (jsonErrors[name]) {
      setJsonErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = useCallback((newUrl) => {
    setFormData(prev => ({
      ...prev,
      hero_image_url: newUrl
    }));
  }, []);

  const validateJsonFields = () => {
    const jsonFields = ['quick_facts', 'country_specific_faqs', 'additional_sections', 'sidebar_nav_links'];
    const errors = {};
    let isValid = true;

    jsonFields.forEach(field => {
      try {
        if (formData[field]) {
          JSON.parse(formData[field]);
        }
      } catch (error) {
        errors[field] = `Invalid JSON format: ${error.message}`;
        isValid = false;
      }
    });

    setJsonErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate JSON fields
    if (!validateJsonFields()) {
      toast.error('Please fix the JSON format errors');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(initialData?.id ? 'Updating...' : 'Creating...');

    try {
      // Prepare data with parsed JSON fields
      const dataToSave = {
        ...formData,
        quick_facts: formData.quick_facts ? JSON.parse(formData.quick_facts) : {},
        country_specific_faqs: formData.country_specific_faqs ? JSON.parse(formData.country_specific_faqs) : [],
        additional_sections: formData.additional_sections ? JSON.parse(formData.additional_sections) : [],
        sidebar_nav_links: formData.sidebar_nav_links ? JSON.parse(formData.sidebar_nav_links) : [],
        display_order: formData.display_order === '' ? null : parseInt(formData.display_order, 10)
      };

      // Submit to API
      let response;
      if (initialData?.id) {
        response = await updateStudyDestination(initialData.id, dataToSave);
      } else {
        response = await createStudyDestination(dataToSave);
      }

      // Handle response
      if (response.success) {
        toast.success(`Study destination ${initialData?.id ? 'updated' : 'created'} successfully!`, { id: toastId });
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data);
        }
      } else {
        toast.error(response.error || 'Failed to save study destination', { id: toastId });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // CSS Classes
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const textareaClass = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const sectionClass = "mb-6 p-4 bg-gray-50 rounded-md";
  const sectionTitleClass = "text-lg font-medium text-gray-900 mb-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Basic Information */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="country_slug" className={labelClass}>
              Country Slug* <span className="text-xs text-gray-500">(URL-friendly identifier, e.g., "united-kingdom")</span>
            </label>
            <input 
              type="text" 
              id="country_slug" 
              name="country_slug" 
              value={formData.country_slug} 
              onChange={handleChange}
              required
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-500">Must be unique and URL-friendly (lowercase with hyphens)</p>
          </div>
          
          <div>
            <label htmlFor="display_name" className={labelClass}>Display Name*</label>
            <input 
              type="text" 
              id="display_name" 
              name="display_name" 
              value={formData.display_name} 
              onChange={handleChange}
              required
              className={inputClass} 
              placeholder="e.g., United Kingdom"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="display_order" className={labelClass}>Display Order</label>
            <input 
              type="number" 
              id="display_order" 
              name="display_order" 
              value={formData.display_order} 
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g., 1 (lower numbers appear first)"
            />
          </div>
          
          <div className="flex items-center h-full mt-6">
            <input 
              type="checkbox" 
              id="is_active" 
              name="is_active" 
              checked={formData.is_active} 
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (visible to users)</label>
          </div>
        </div>
      </div>
      
      {/* SEO Information */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>SEO Information</h3>
        
        <div className="mb-4">
          <label htmlFor="meta_title" className={labelClass}>Meta Title</label>
          <input 
            type="text" 
            id="meta_title" 
            name="meta_title" 
            value={formData.meta_title || ''} 
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., Study in United Kingdom - Dream Edge Education"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="meta_description" className={labelClass}>Meta Description</label>
          <textarea 
            id="meta_description" 
            name="meta_description" 
            value={formData.meta_description || ''} 
            onChange={handleChange}
            rows="2"
            className={textareaClass}
            placeholder="Brief description for search engines"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="seo_keywords" className={labelClass}>SEO Keywords</label>
          <textarea 
            id="seo_keywords" 
            name="seo_keywords" 
            value={formData.seo_keywords || ''} 
            onChange={handleChange}
            rows="2"
            className={textareaClass}
            placeholder="e.g., study abroad, united kingdom, UK universities"
          ></textarea>
        </div>
      </div>

      {/* Hero Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Hero Section</h3>
        
        <div className="mb-4">
          <ImageUploader 
            initialImageUrl={formData.hero_image_url} 
            onImageChange={handleImageChange}
            bucketName="destination-assets"
            folderName="hero"
            label="Hero Background Image"
            maxSizeMB={2}
            previewSize={200}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="intro_text" className={labelClass}>Introduction Text</label>
          <textarea 
            id="intro_text" 
            name="intro_text" 
            value={formData.intro_text || ''} 
            onChange={handleChange}
            rows="4"
            className={textareaClass}
            placeholder="Brief introduction to studying in this country"
          ></textarea>
        </div>
      </div>

      {/* Quick Facts */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Quick Facts</h3>
        
        <div>
          <label htmlFor="quick_facts" className={labelClass}>
            Quick Facts (JSON format)
            <span className="ml-2 text-xs text-gray-500">Example format shown in placeholder</span>
          </label>
          <textarea 
            id="quick_facts" 
            name="quick_facts" 
            value={formData.quick_facts} 
            onChange={handleChange}
            rows="7"
            className={`${textareaClass} ${jsonErrors.quick_facts ? 'border-red-500' : ''} font-mono`}
            placeholder={`{
  "Official Language": "English",
  "Currency": "Pound Sterling (£)",
  "Capital City": "London",
  "Population": "67 million",
  "Time Zone": "GMT+0"
}`}
          ></textarea>
          {jsonErrors.quick_facts && <p className="text-red-500 text-xs mt-1">{jsonErrors.quick_facts}</p>}
        </div>
      </div>

      {/* Content Sections */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Main Content Sections</h3>
        <p className="text-sm text-gray-500 mb-4">These sections allow HTML for rich text formatting.</p>
        
        <div className="mb-6">
          <label htmlFor="why_study_here_content" className={labelClass}>Why Study Here Content</label>
          <textarea 
            id="why_study_here_content" 
            name="why_study_here_content" 
            value={formData.why_study_here_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about why to study in this country...</p>"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="education_system_content" className={labelClass}>Education System Content</label>
          <textarea 
            id="education_system_content" 
            name="education_system_content" 
            value={formData.education_system_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about the education system...</p>"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="popular_courses_content" className={labelClass}>Popular Courses Content</label>
          <textarea 
            id="popular_courses_content" 
            name="popular_courses_content" 
            value={formData.popular_courses_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about popular courses...</p>"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="admission_requirements_content" className={labelClass}>Admission Requirements Content</label>
          <textarea 
            id="admission_requirements_content" 
            name="admission_requirements_content" 
            value={formData.admission_requirements_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about admission requirements...</p>"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="cost_studying_living_content" className={labelClass}>Cost of Studying & Living Content</label>
          <textarea 
            id="cost_studying_living_content" 
            name="cost_studying_living_content" 
            value={formData.cost_studying_living_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about costs of studying and living...</p>"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="visa_requirements_content" className={labelClass}>Visa Requirements Content</label>
          <textarea 
            id="visa_requirements_content" 
            name="visa_requirements_content" 
            value={formData.visa_requirements_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about visa requirements...</p>"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="scholarships_content" className={labelClass}>Scholarships Content</label>
          <textarea 
            id="scholarships_content" 
            name="scholarships_content" 
            value={formData.scholarships_content || ''} 
            onChange={handleChange}
            rows="8"
            className={textareaClass}
            placeholder="<p>Content about scholarships...</p>"
          ></textarea>
        </div>
      </div>

      {/* FAQs */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Country-Specific FAQs</h3>
        
        <div>
          <label htmlFor="country_specific_faqs" className={labelClass}>
            FAQs (JSON format)
            <span className="ml-2 text-xs text-gray-500">Array of question/answer objects</span>
          </label>
          <textarea 
            id="country_specific_faqs" 
            name="country_specific_faqs" 
            value={formData.country_specific_faqs} 
            onChange={handleChange}
            rows="10"
            className={`${textareaClass} ${jsonErrors.country_specific_faqs ? 'border-red-500' : ''} font-mono`}
            placeholder={`[
  {
    "question": "What are the top universities in this country?",
    "answer": "The top universities include..."
  },
  {
    "question": "How much does it cost to study in this country?",
    "answer": "The cost varies depending on..."
  }
]`}
          ></textarea>
          {jsonErrors.country_specific_faqs && <p className="text-red-500 text-xs mt-1">{jsonErrors.country_specific_faqs}</p>}
        </div>
      </div>

      {/* Additional Sections */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Additional Sections</h3>
        
        <div>
          <label htmlFor="additional_sections" className={labelClass}>
            Additional Sections (JSON format)
            <span className="ml-2 text-xs text-gray-500">Array of title/content objects</span>
          </label>
          <textarea 
            id="additional_sections" 
            name="additional_sections" 
            value={formData.additional_sections} 
            onChange={handleChange}
            rows="10"
            className={`${textareaClass} ${jsonErrors.additional_sections ? 'border-red-500' : ''} font-mono`}
            placeholder={`[
  {
    "title": "Student Life",
    "content": "<p>Content about student life...</p>"
  },
  {
    "title": "Post-Graduation Opportunities",
    "content": "<p>Content about post-graduation opportunities...</p>"
  }
]`}
          ></textarea>
          {jsonErrors.additional_sections && <p className="text-red-500 text-xs mt-1">{jsonErrors.additional_sections}</p>}
        </div>
      </div>

      {/* Sidebar Navigation Links */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Sidebar Navigation Links</h3>
        
        <div>
          <label htmlFor="sidebar_nav_links" className={labelClass}>
            Sidebar Navigation Links (JSON format)
            <span className="ml-2 text-xs text-gray-500">Array of label/hash objects</span>
          </label>
          <textarea 
            id="sidebar_nav_links" 
            name="sidebar_nav_links" 
            value={formData.sidebar_nav_links} 
            onChange={handleChange}
            rows="8"
            className={`${textareaClass} ${jsonErrors.sidebar_nav_links ? 'border-red-500' : ''} font-mono`}
            placeholder={`[
  {
    "label": "Why Study Here",
    "hash": "#why-study-uk"
  },
  {
    "label": "Education System",
    "hash": "#education-system-uk"
  }
]`}
          ></textarea>
          {jsonErrors.sidebar_nav_links && <p className="text-red-500 text-xs mt-1">{jsonErrors.sidebar_nav_links}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        
        <button 
          type="submit" 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : (initialData?.id ? 'Update' : 'Create') + ' Study Destination'}
        </button>
      </div>
    </form>
  );
} 