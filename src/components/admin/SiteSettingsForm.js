'use client';

import { useState, useEffect } from 'react';

export default function SiteSettingsForm({ initialData, onSubmit, isSaving }) {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    // Ensure form data is updated if initialData changes after mount (e.g., fetched late)
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? null : parseFloat(value)) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-brand-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary-400 focus:border-brand-primary sm:text-sm";
  const labelClass = "block text-sm font-medium text-brand-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="site_name" className={labelClass}>Site Name</label>
        <input type="text" name="site_name" id="site_name" value={formData.site_name || ''} onChange={handleChange} className={inputClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="primary_phone" className={labelClass}>Primary Phone</label>
          <input type="text" name="primary_phone" id="primary_phone" value={formData.primary_phone || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="primary_email" className={labelClass}>Primary Email</label>
          <input type="email" name="primary_email" id="primary_email" value={formData.primary_email || ''} onChange={handleChange} className={inputClass} />
        </div>
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

      <h2 className="text-xl font-semibold text-brand-dark pt-4 border-t mt-6">Social Media Links</h2>
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
          <input type="url" name="linkedin_url" id="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/company/yourcompany" />
        </div>
        <div>
          <label htmlFor="twitter_url" className={labelClass}>Twitter URL (X)</label>
          <input type="url" name="twitter_url" id="twitter_url" value={formData.twitter_url || ''} onChange={handleChange} className={inputClass} placeholder="https://twitter.com/yourhandle" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-brand-dark pt-4 border-t mt-6">Footer & Map</h2>
      <div>
        <label htmlFor="map_embed_url_main_office" className={labelClass}>Main Office Map Embed URL</label>
        <input type="url" name="map_embed_url_main_office" id="map_embed_url_main_office" value={formData.map_embed_url_main_office || ''} onChange={handleChange} className={inputClass} placeholder="https://www.google.com/maps/embed?..." />
        <p className="mt-1 text-xs text-text-secondary">Get this from Google Maps &gt; Share &gt; Embed a map.</p>
      </div>
      <div>
        <label htmlFor="footer_about_text" className={labelClass}>Footer About Text</label>
        <textarea name="footer_about_text" id="footer_about_text" rows="3" value={formData.footer_about_text || ''} onChange={handleChange} className={inputClass}></textarea>
      </div>
      <div>
        <label htmlFor="copyright_year_start" className={labelClass}>Copyright Year Start</label>
        <input type="number" name="copyright_year_start" id="copyright_year_start" value={formData.copyright_year_start || ''} onChange={handleChange} className={inputClass} placeholder="e.g., 2020" />
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-400 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
} 