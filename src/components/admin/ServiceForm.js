"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabase";
import {
  FormGroup,
  Label,
  Input,
  Textarea,
  PrimaryButton,
  SecondaryButton,
  ErrorAlert,
  SuccessAlert,
  LoadingSpinner,
} from "./UI";
import toast from "react-hot-toast";
import Image from 'next/image';
import ImageUploader from './ImageUploader';

const ServiceForm = ({ service, onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    short_description: "",
    full_description: "",
    icon_name: "",
    image_url: "",
    display_order: "",
    benefits: [{ id: uuidv4(), text: "" }],
  });

  useEffect(() => {
    if (service) {
      // Format benefits if they exist and are in the JSON format
      let benefits = [];
      
      if (service.benefits) {
        // Check if benefits is already an array of objects with id and text
        if (Array.isArray(service.benefits) && service.benefits.length > 0) {
          benefits = service.benefits.map(benefit => {
            if (typeof benefit === 'string') {
              return { id: uuidv4(), text: benefit };
            } else if (benefit.id && benefit.text) {
              return benefit;
            } else {
              return { id: uuidv4(), text: benefit.toString() };
            }
          });
        } else if (typeof service.benefits === 'object') {
          // Convert object format to array format
          benefits = Object.values(service.benefits).map(text => ({
            id: uuidv4(),
            text: text.toString(),
          }));
        }
      }
      
      // If no benefits or empty, initialize with one empty benefit
      if (benefits.length === 0) {
        benefits = [{ id: uuidv4(), text: "" }];
      }

      setFormData({
        id: service.id || "",
        name: service.name || "",
        slug: service.slug || "",
        short_description: service.short_description || "",
        full_description: service.full_description || "",
        icon_name: service.icon_name || "",
        image_url: service.image_url || "",
        display_order: service.display_order?.toString() || "",
        benefits,
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e) => {
    const value = e.target.value;
    // Update the slug field with a URL-friendly version of the value
    setFormData((prev) => ({
      ...prev,
      slug: value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special chars except whitespace and hyphen
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"), // Replace multiple hyphens with single hyphen
    }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    
    // Auto-generate slug from name if slug is empty
    if (!formData.slug) {
      handleSlugChange(e);
    }
  };

  // New handler for image changes
  const handleImageChange = (newUrl) => {
    setFormData(prev => ({ ...prev, image_url: newUrl }));
  };

  const handleBenefitChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit) =>
        benefit.id === id ? { ...benefit, text: value } : benefit
      ),
    }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { id: uuidv4(), text: "" }],
    }));
  };

  const removeBenefit = (id) => {
    if (formData.benefits.length <= 1) return; // Keep at least one benefit field
    
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((benefit) => benefit.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format benefits for database storage
    // Convert array of {id, text} to array of strings
    const formattedBenefits = formData.benefits
      .filter(benefit => benefit.text.trim() !== "") // Remove empty benefits
      .map(benefit => benefit.text);
    
    // Convert to number if present, otherwise null
    const displayOrder = formData.display_order 
      ? parseInt(formData.display_order, 10)
      : null;
    
    const formattedData = {
      ...formData,
      benefits: formattedBenefits,
      display_order: displayOrder,
      // Generate ID if not present (for new services)
      id: formData.id || uuidv4(),
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <ErrorAlert
          title="Error"
          message={error}
        />
      )}
      
      {success && (
        <SuccessAlert
          title="Success"
          message={success}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormGroup>
            <Label htmlFor="name" required>
              Service Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter service name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="slug" required>
              Slug (URL-friendly name)
            </Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="service-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the service page URL
            </p>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="short_description">
              Short Description
            </Label>
            <Textarea
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief description of the service"
              rows={3}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="display_order">
              Display Order
            </Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              min="1"
              value={formData.display_order}
              onChange={handleChange}
              placeholder="Order number for display (lower = higher priority)"
            />
          </FormGroup>
        </div>

        <div>
          <FormGroup>
            <Label htmlFor="icon_name">
              Icon Name
            </Label>
            <Input
              id="icon_name"
              name="icon_name"
              value={formData.icon_name}
              onChange={handleChange}
              placeholder="Icon name (for icons library)"
            />
          </FormGroup>

          <FormGroup>
            <ImageUploader
              initialImageUrl={formData.image_url}
              onImageChange={handleImageChange}
              bucketName="service-images"
              folderName="public"
              label="Service Image"
              maxSizeMB={2}
              imageShape="square"
              previewSize={320}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="full_description">
              Full Description
            </Label>
            <Textarea
              id="full_description"
              name="full_description"
              value={formData.full_description}
              onChange={handleChange}
              placeholder="Detailed description of the service"
              rows={6}
            />
          </FormGroup>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Service Benefits</h3>
          <button
            type="button"
            onClick={addBenefit}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
          >
            + Add Benefit
          </button>
        </div>

        {formData.benefits.map((benefit, index) => (
          <div key={benefit.id} className="flex gap-2 mb-2">
            <Input
              value={benefit.text}
              onChange={(e) => handleBenefitChange(benefit.id, e.target.value)}
              placeholder={`Benefit ${index + 1}`}
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => removeBenefit(benefit.id)}
              className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={formData.benefits.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <SecondaryButton
          type="button"
          onClick={() => window.history.back()}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            service ? "Update Service" : "Create Service"
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ServiceForm; 