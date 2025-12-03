"use client";

import { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings, getHomepageProcessSteps } from '@/lib/api';
import toast from 'react-hot-toast';
// We will create these components next
import HomepageSettingsForm from '@/components/admin/forms/HomepageSettingsForm';
import ProcessStepManager from '@/components/admin/ProcessStepManager';

export default function HomepageContentPage() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [processSteps, setProcessSteps] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoadingSettings(true);
      try {
        const apiResponse = await getSiteSettings();
        if (apiResponse && apiResponse.success && apiResponse.data) {
          setSiteSettings(apiResponse.data);
        } else {
          console.error('Failed to load site settings in HomepageContentPage or data is null/invalid:', apiResponse?.error);
          toast.error('Failed to load site settings: ' + (apiResponse?.error?.message || 'Unknown error'));
          setSiteSettings({}); // Fallback to an empty object for the form
        }
      } catch (error) {
        console.error('Failed to load site settings in HomepageContentPage:', error);
        toast.error('Failed to load site settings: ' + (error.message || 'Unknown error'));
      } finally {
        setLoadingSettings(false);
      }
    };

    const fetchProcessSteps = async () => {
      setLoadingSteps(true);
      const response = await getHomepageProcessSteps();
      if (response.success) {
        setProcessSteps(response.data);
      } else {
        toast.error('Failed to load process steps: ' + response.error);
      }
      setLoadingSteps(false);
    };

    fetchSettings();
    fetchProcessSteps();
  }, []);

  const handleSettingsSave = async (formDataFromHomepageForm) => {
    // The updateSiteSettings API expects an object with the fields to be updated.
    // The ID is handled internally by updateSiteSettings.
    // formDataFromHomepageForm contains the fields managed by HomepageSettingsForm.
    
    setLoadingSettings(true); // Indicate saving operation
    try {
      // Log the incoming form data for debugging
      console.log('Homepage settings form submitted with:', formDataFromHomepageForm);
      
      // Ensure the data has the correct ID and validate image URL if present
      const validatedData = {
        ...formDataFromHomepageForm,
        id: 1, // Always make sure the id field is correctly set
      };
      
      // Make sure the hero_background_image_url is properly handled
      if (formDataFromHomepageForm.hero_background_image_url) {
        console.log('Image URL detected in form data:', formDataFromHomepageForm.hero_background_image_url);
        // Ensure we're directly using the hero_background_image_url from the form data
        validatedData.hero_background_image_url = formDataFromHomepageForm.hero_background_image_url;
      } else {
        console.log('No image URL in form data, keeping existing value if any');
      }
      
      console.log('Submitting settings update:', validatedData);
      
      const response = await updateSiteSettings(validatedData);
      console.log('Update response:', response);
      
      if (response.success) {
        toast.success('Settings updated successfully!');
        // Update the local state with the new settings returned from the API
        if (response.data) {
          setSiteSettings(response.data);
        }
      } else {
        toast.error('Failed to update settings: ' + (response.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings: ' + error.message);
    } finally {
      setLoadingSettings(false);
    }
  };
  
  // Handlers for process steps will be managed within ProcessStepManager itself,
  // but it needs a way to update the processSteps state on this page if we want to pass it down.
  // Alternatively, ProcessStepManager can manage its own state internally after initial load.
  // For simplicity and to ensure the main page reflects changes if other components ever needed these steps,
  // we can pass down a setter.

  if (loadingSettings || loadingSteps) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-brand-primary">Homepage Content Management</h1>
      
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-brand-secondary">General Homepage Settings</h2>
        {siteSettings ? (
          <HomepageSettingsForm 
            initialSettings={siteSettings} 
            onSave={handleSettingsSave} 
          />
        ) : (
          <p>Loading settings form...</p>
        )}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-brand-secondary">&quot;Our Proven Process&quot; Steps</h2>
        <ProcessStepManager
          initialSteps={processSteps}
          setProcessStepsOnPage={setProcessSteps}
        /> 
      </div>
    </div>
  );
} 