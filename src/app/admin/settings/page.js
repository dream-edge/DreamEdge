'use client';

import { useEffect, useState } from 'react';
import SiteSettingsForm from '@/components/admin/forms/SiteSettingsForm';
import { getSiteSettings, updateSiteSettings } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const apiResponse = await getSiteSettings();
        if (apiResponse && apiResponse.data) {
          setSettings(apiResponse.data);
        } else {
          console.error('Failed to load site settings or data is missing. API Response:', apiResponse);
          toast.error('Failed to load site settings. Using defaults.');
          setSettings({
            site_name: 'Dream Consultancy',
            primary_phone: '',
            primary_email: '',
            primary_address_line1: '',
            primary_address_line2: '',
            office_hours: '',
            facebook_url: '',
            instagram_url: '',
            linkedin_url: '',
            twitter_url: '',
            map_embed_url_main_office: '',
            footer_about_text: '',
            copyright_year_start: new Date().getFullYear(),
          });
        }
      } catch (error) {
        console.error('Failed to load site settings with error:', error);
        toast.error('Failed to load site settings due to an error.');
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      const result = await updateSiteSettings(formData);
      if (result.success && result.data) {
        setSettings(result.data);
        toast.success('Site settings updated successfully!');
      } else {
        console.error('Failed to update site settings:', result.error);
        toast.error(`Failed to update site settings: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update site settings:', error);
      toast.error(`Failed to update site settings: ${error.message}`);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-6">Loading site settings...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Site Configuration</h1>
      {settings ? (
        <SiteSettingsForm
          initialSettings={settings}
          onSave={handleSubmit}
        />
      ) : (
        <p>Could not load settings data. Please try again.</p>
      )}
    </div>
  );
} 