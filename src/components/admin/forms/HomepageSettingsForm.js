"use client";

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function HomepageSettingsForm({ initialSettings, onSave }) {
  const [formData, setFormData] = useState(initialSettings || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialSettings || {});
  }, [initialSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = useCallback((newUrl, newFileName) => {
    console.log('Image change callback called with:');
    console.log('- New URL:', newUrl);
    console.log('- New filename:', newFileName);
    
    // Update the form data with the new URL
    setFormData(prevData => {
      const updatedData = { 
        ...prevData, 
        hero_background_image_url: newUrl 
      };
      console.log('Updated form data with new image URL:', updatedData);
      return updatedData;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate the form data
    const validatedFormData = {
      ...formData,
      // Ensure the hero_background_image_url is properly included if it exists
      hero_background_image_url: formData.hero_background_image_url || null,
      // Always include the ID to ensure we're updating the right record
      id: 1
    };
    
    console.log('Submitting homepage settings form with data:', validatedFormData);
    
    // Debug log to verify the image URL is included
    if (validatedFormData.hero_background_image_url) {
      console.log('Image URL included in submission:', validatedFormData.hero_background_image_url);
    } else {
      console.log('No image URL in submission data');
    }
    
    // The onSave function expects all site settings fields it needs to update.
    await onSave(validatedFormData);
    setIsSubmitting(false);
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="hero_title" className={labelClass}>Title</label>
            <input type="text" name="hero_title" id="hero_title" value={formData.hero_title || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="hero_cta_text" className={labelClass}>CTA Button Text</label>
            <input type="text" name="hero_cta_text" id="hero_cta_text" value={formData.hero_cta_text || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="hero_subtitle" className={labelClass}>Subtitle</label>
          <textarea name="hero_subtitle" id="hero_subtitle" rows="3" value={formData.hero_subtitle || ''} onChange={handleChange} className={inputClass}></textarea>
        </div>
        <div className="mt-4">
            <label htmlFor="hero_cta_link" className={labelClass}>CTA Button Link (e.g., /book-consultation)</label>
            <input type="text" name="hero_cta_link" id="hero_cta_link" value={formData.hero_cta_link || ''} onChange={handleChange} className={inputClass} placeholder="/example-page" />
        </div>
        <div className="mt-6">
          <ImageUploader 
            initialImageUrl={formData.hero_background_image_url || null}
            onImageChange={handleImageChange}
            bucketName="homepage-assets"
            folderName="hero"
            label="Hero Background Image"
            maxSizeMB={10}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">&quot;Why Choose Us&quot; Section</h3>
        <div>
          <label htmlFor="why_choose_us_title" className={labelClass}>Section Title</label>
          <input type="text" name="why_choose_us_title" id="why_choose_us_title" value={formData.why_choose_us_title || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="mt-4">
          <label htmlFor="why_choose_us_subtitle" className={labelClass}>Section Subtitle/Intro</label>
          <textarea name="why_choose_us_subtitle" id="why_choose_us_subtitle" rows="3" value={formData.why_choose_us_subtitle || ''} onChange={handleChange} className={inputClass}></textarea>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">&quot;Our Proven Process&quot; Section</h3>
        <div>
          <label htmlFor="proven_process_title" className={labelClass}>Section Title</label>
          <input type="text" name="proven_process_title" id="proven_process_title" value={formData.proven_process_title || ''} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition duration-150 ease-in-out disabled:opacity-70 mb-4"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Homepage Settings'}
        </button>

        {/* Hidden debug button - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            type="button" 
            onClick={() => {
              console.log('Current form data:', formData);
              console.log('Current hero image URL:', formData.hero_background_image_url);
              toast.success('Form data logged to console');
            }}
            className="w-full text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md mt-2"
          >
            Debug: Check Form Data
          </button>
        )}
      </div>
    </form>
  );
} 