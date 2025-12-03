"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabase";
import {
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  PrimaryButton,
  SecondaryButton,
  ErrorAlert,
  SuccessAlert,
  LoadingSpinner,
} from "./UI";
import Image from 'next/image';
import ImageUploader from './ImageUploader';

const TestimonialForm = ({ testimonial, onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    quote: "",
    university: "",
    program: "",
    category: "",
    photo_url: "",
    status: "draft",
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        id: testimonial.id || "",
        name: testimonial.name || "",
        quote: testimonial.quote || "",
        university: testimonial.university || "",
        program: testimonial.program || "",
        category: testimonial.category || "",
        photo_url: testimonial.photo_url || "",
        status: testimonial.status || "draft",
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (newUrl) => {
    setFormData(prev => ({ ...prev, photo_url: newUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      id: formData.id || uuidv4(),
    };
    
    onSubmit(formattedData);
  };

  // Testimonial status options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

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
              Student Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="university">
              University
            </Label>
            <Input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="University name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="program">
              Program/Course
            </Label>
            <Input
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="e.g., MBA, Computer Science, etc."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Test Preparation, General"
            />
            <p className="text-xs text-gray-500 mt-1">
              Helps group testimonials. E.g., &apos;Test Preparation&apos;, &apos;Visa Guidance&apos;, &apos;General&apos;.
            </p>
          </FormGroup>
        </div>

        <div>
          <FormGroup>
            <ImageUploader
              initialImageUrl={formData.photo_url}
              onImageChange={handlePhotoChange}
              bucketName="testimonial-photos"
              folderName="public"
              label="Student Photo"
              maxSizeMB={1}
              imageShape="circle"
              previewSize={128}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">
              Status
            </Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>
        </div>
      </div>

      <FormGroup className="mt-4">
        <Label htmlFor="quote" required>
          Testimonial Quote
        </Label>
        <Textarea
          id="quote"
          name="quote"
          value={formData.quote}
          onChange={handleChange}
          placeholder="Enter the testimonial text"
          rows={5}
          required
        />
      </FormGroup>

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
            testimonial ? "Update Testimonial" : "Create Testimonial"
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default TestimonialForm; 