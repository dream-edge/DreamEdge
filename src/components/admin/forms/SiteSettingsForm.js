"use client";

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader'; // Assuming path is correct

// This component will handle ALL site settings.
// It takes initialSettings (fetched from API) and an onSave callback.
export default function SiteSettingsForm({ initialSettings, onSave }) {
  const [formData, setFormData] = useState(initialSettings || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ensure formData is an object, even if initialSettings is null/undefined
    setFormData(initialSettings || {});
  }, [initialSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  };

  const handleHomepageHeroImageChange = useCallback((newUrl) => {
    setFormData(prevData => ({
      ...prevData,
      hero_background_image_url: newUrl
    }));
  }, []);

  const handleAboutUsImageChange = useCallback((newUrl) => {
    console.log("About Us image URL changed:", newUrl);
    setFormData(prevData => ({
      ...prevData,
      about_us_image_url: newUrl
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // The onSave function from the parent page will call the API
    // It expects the full formData object.
    // Ensure 'id' is part of the formData if your API expects it for updates.
    // The `updateSiteSettings` API function handles merging, so we can send partial data,
    // but it's safer to send a more complete object if easily available.
    // Our useEffect and handleChange should keep formData fairly complete.
    const submissionData = {
      ...formData,
      id: 1 // Site settings always have id 1
    };

    console.log("Submitting Site Settings:", submissionData);
    await onSave(submissionData);
    setIsSubmitting(false);
    // Toast notification for success is usually handled by the parent page after API response
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const textareaClass = inputClass + " min-h-[100px]"; // For textareas
  const sectionTitleClass = "text-xl font-semibold text-gray-800 mb-4 border-b pb-2";
  const subSectionTitleClass = "text-lg font-medium text-gray-700 mb-3 mt-6";

  if (!initialSettings) {
    return <p>Loading settings...</p>; // Or a more sophisticated loader
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow rounded-lg">

      {/* Basic Site Information */}
      <section>
        <h3 className={sectionTitleClass}>Basic Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="site_name" className={labelClass}>Site Name</label>
            <input type="text" name="site_name" id="site_name" value={formData.site_name || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="primary_email" className={labelClass}>Primary Email</label>
            <input type="email" name="primary_email" id="primary_email" value={formData.primary_email || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="primary_phone" className={labelClass}>Primary Phone</label>
            <input type="text" name="primary_phone" id="primary_phone" value={formData.primary_phone || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="primary_address_line1" className={labelClass}>Address Line 1</label>
            <input type="text" name="primary_address_line1" id="primary_address_line1" value={formData.primary_address_line1 || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="primary_address_line2" className={labelClass}>Address Line 2</label>
            <input type="text" name="primary_address_line2" id="primary_address_line2" value={formData.primary_address_line2 || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="office_hours" className={labelClass}>Office Hours</label>
            <input type="text" name="office_hours" id="office_hours" value={formData.office_hours || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Social Media & Footer */}
      <section>
        <h3 className={sectionTitleClass}>Social Media & Footer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="facebook_url" className={labelClass}>Facebook URL</label>
            <input type="url" name="facebook_url" id="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} className={inputClass} placeholder="https://facebook.com/yourpage" />
          </div>
          <div>
            <label htmlFor="instagram_url" className={labelClass}>Instagram URL</label>
            <input type="url" name="instagram_url" id="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} className={inputClass} placeholder="https://instagram.com/yourprofile" />
          </div>
          <div>
            <label htmlFor="linkedin_url" className={labelClass}>LinkedIn URL</label>
            <input type="url" name="linkedin_url" id="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div>
            <label htmlFor="twitter_url" className={labelClass}>Twitter (X) URL</label>
            <input type="url" name="twitter_url" id="twitter_url" value={formData.twitter_url || ''} onChange={handleChange} className={inputClass} placeholder="https://twitter.com/yourhandle" />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="footer_about_text" className={labelClass}>Footer About Text</label>
          <textarea name="footer_about_text" id="footer_about_text" rows="3" value={formData.footer_about_text || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>
        <div className="mt-4">
            <label htmlFor="copyright_year_start" className={labelClass}>Copyright Start Year</label>
            <input type="number" name="copyright_year_start" id="copyright_year_start" value={formData.copyright_year_start || ''} onChange={handleChange} className={inputClass} placeholder="e.g., 2010" />
        </div>
         <div className="mt-6">
            <label htmlFor="map_embed_url_main_office" className={labelClass}>Map Embed URL (Main Office)</label>
            <textarea name="map_embed_url_main_office" id="map_embed_url_main_office" rows="3" value={formData.map_embed_url_main_office || ''} onChange={handleChange} className={textareaClass} placeholder="<iframe src=...></iframe>"></textarea>
        </div>
      </section>
      
      {/* Homepage Content */}
      <section>
        <h3 className={sectionTitleClass}>Homepage Content</h3>
        
        <h4 className={subSectionTitleClass}>Hero Section</h4>
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
          <textarea name="hero_subtitle" id="hero_subtitle" rows="3" value={formData.hero_subtitle || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>
        <div className="mt-4">
            <label htmlFor="hero_cta_link" className={labelClass}>CTA Button Link (e.g., /book-consultation)</label>
            <input type="text" name="hero_cta_link" id="hero_cta_link" value={formData.hero_cta_link || ''} onChange={handleChange} className={inputClass} placeholder="/example-page" />
        </div>
        <div className="mt-6">
          <ImageUploader 
            key={`hero-image-${initialSettings?.hero_background_image_url}`} // Add key for re-initialization
            initialImageUrl={formData.hero_background_image_url || null}
            onImageChange={handleHomepageHeroImageChange}
            bucketName="homepage-assets" // As per HomepageSettingsForm
            folderName="hero"
            label="Hero Background Image"
            maxSizeMB={2}
          />
        </div>

        <h4 className={subSectionTitleClass}>{"Why Choose Us"} Section</h4>
        <div>
          <label htmlFor="why_choose_us_title" className={labelClass}>Section Title</label>
          <input type="text" name="why_choose_us_title" id="why_choose_us_title" value={formData.why_choose_us_title || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="mt-4">
          <label htmlFor="why_choose_us_subtitle" className={labelClass}>Section Subtitle/Intro</label>
          <textarea name="why_choose_us_subtitle" id="why_choose_us_subtitle" rows="3" value={formData.why_choose_us_subtitle || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>

        <h4 className={subSectionTitleClass}>{"Our Proven Process"} Section</h4>
        <div>
          <label htmlFor="proven_process_title" className={labelClass}>Section Title</label>
          <input type="text" name="proven_process_title" id="proven_process_title" value={formData.proven_process_title || ''} onChange={handleChange} className={inputClass} />
        </div>
      </section>

      {/* About Us Page Content */}
      <section>
        <h3 className={sectionTitleClass}>{"About Us"} Page Content</h3>
        
        <h4 className={subSectionTitleClass}>Hero Section (About Page)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="about_hero_title" className={labelClass}>Hero Title</label>
            <input type="text" name="about_hero_title" id="about_hero_title" value={formData.about_hero_title || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="about_hero_subtitle" className={labelClass}>Hero Subtitle</label>
          <textarea name="about_hero_subtitle" id="about_hero_subtitle" rows="2" value={formData.about_hero_subtitle || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>

        <h4 className={subSectionTitleClass}>Our Story Section</h4>
        <div>
          <label htmlFor="about_us_story_title" className={labelClass}>Story Title</label>
          <input type="text" name="about_us_story_title" id="about_us_story_title" value={formData.about_us_story_title || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="mt-4">
          <label htmlFor="about_us_story_content" className={labelClass}>Story Content</label>
          <textarea name="about_us_story_content" id="about_us_story_content" rows="5" value={formData.about_us_story_content || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>
        <div className="mt-6">
          <ImageUploader 
            key={`about-image-${initialSettings?.about_us_image_url}`} // Add key for re-initialization
            initialImageUrl={formData.about_us_image_url || null}
            onImageChange={handleAboutUsImageChange}
            bucketName="site-assets" // New bucket for general site assets
            folderName="about-us"
            label="About Us Image"
            maxSizeMB={2}
          />
        </div>

        <h4 className={subSectionTitleClass}>Our Mission Section</h4>
        <div>
          <label htmlFor="about_us_mission_title" className={labelClass}>Mission Title</label>
          <input type="text" name="about_us_mission_title" id="about_us_mission_title" value={formData.about_us_mission_title || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="mt-4">
          <label htmlFor="about_us_mission_content" className={labelClass}>Mission Content</label>
          <textarea name="about_us_mission_content" id="about_us_mission_content" rows="3" value={formData.about_us_mission_content || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>

        <h4 className={subSectionTitleClass}>Our Vision Section</h4>
        <div>
          <label htmlFor="about_us_vision_title" className={labelClass}>Vision Title</label>
          <input type="text" name="about_us_vision_title" id="about_us_vision_title" value={formData.about_us_vision_title || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="mt-4">
          <label htmlFor="about_us_vision_content" className={labelClass}>Vision Content</label>
          <textarea name="about_us_vision_content" id="about_us_vision_content" rows="3" value={formData.about_us_vision_content || ''} onChange={handleChange} className={textareaClass}></textarea>
        </div>
      </section>

      {/* Submit Button */}
      <div className="pt-8">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition duration-150 ease-in-out disabled:opacity-70"
        >
          {isSubmitting ? 'Saving All Settings...' : 'Save All Site Settings'}
        </button>
        {process.env.NODE_ENV === 'development' && (
          <button 
            type="button" 
            onClick={() => {
              console.log('Current form data (SiteSettingsForm):', formData);
              toast.success('SiteSettingsForm data logged to console');
            }}
            className="w-full text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md mt-2"
          >
            Debug: Log Form Data
          </button>
        )}
      </div>
    </form>
  );
} 