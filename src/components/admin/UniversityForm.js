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
import Image from 'next/image';
import ImageUploader from './ImageUploader';

const UniversityForm = ({ university, onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    location: "",
    description: "",
    ranking: "",
    logo_url: "",
    banner_image_url: "",
    tuition_fees_range: "",
    accommodation_info: "",
    website_url: "",
    popular_courses: [{ id: uuidv4(), name: "" }],
  });

  useEffect(() => {
    if (university) {
      // Format popular courses if they exist and are in the JSON format
      let popularCourses = [];
      
      if (university.popular_courses) {
        // Check if popular_courses is already an array of objects with id and name
        if (Array.isArray(university.popular_courses) && university.popular_courses.length > 0) {
          popularCourses = university.popular_courses.map(course => {
            if (typeof course === 'string') {
              return { id: uuidv4(), name: course };
            } else if (course.id && course.name) {
              return course;
            } else {
              return { id: uuidv4(), name: course.toString() };
            }
          });
        } else if (typeof university.popular_courses === 'object') {
          // Convert object format to array format
          popularCourses = Object.values(university.popular_courses).map(name => ({
            id: uuidv4(),
            name: name.toString(),
          }));
        }
      }
      
      // If no courses or empty, initialize with one empty course
      if (popularCourses.length === 0) {
        popularCourses = [{ id: uuidv4(), name: "" }];
      }

      setFormData({
        id: university.id || "",
        name: university.name || "",
        slug: university.slug || "",
        location: university.location || "",
        description: university.description || "",
        ranking: university.ranking?.toString() || "",
        logo_url: university.logo_url || "",
        banner_image_url: university.banner_image_url || "",
        tuition_fees_range: university.tuition_fees_range || "",
        accommodation_info: university.accommodation_info || "",
        website_url: university.website_url || "",
        popular_courses: popularCourses,
      });
    }
  }, [university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === "name") {
        // Auto-generate slug if slug is empty or was derived from the previous name
        const previousNameSlug = prev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const currentSlugIsEmptyOrAuto = !prev.slug || prev.slug === previousNameSlug;
        if (currentSlugIsEmptyOrAuto) {
          newFormData.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
      }
      return newFormData;
    });
  };

  const handleLogoChange = (newUrl) => {
    setFormData(prev => ({ ...prev, logo_url: newUrl }));
  };

  const handleBannerChange = (newUrl) => {
    setFormData(prev => ({ ...prev, banner_image_url: newUrl }));
  };

  const handleCourseChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      popular_courses: prev.popular_courses.map((course) =>
        course.id === id ? { ...course, name: value } : course
      ),
    }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      popular_courses: [...prev.popular_courses, { id: uuidv4(), name: "" }],
    }));
  };

  const removeCourse = (id) => {
    if (formData.popular_courses.length <= 1) return; // Keep at least one course field
    
    setFormData((prev) => ({
      ...prev,
      popular_courses: prev.popular_courses.filter((course) => course.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format courses for database storage
    // Convert array of {id, name} to array of strings
    const formattedCourses = formData.popular_courses
      .filter(course => course.name.trim() !== "") // Remove empty courses
      .map(course => course.name);
    
    // Convert to number if present, otherwise null
    const ranking = formData.ranking 
      ? parseInt(formData.ranking, 10)
      : null;
    
    const formattedData = {
      ...formData,
      popular_courses: formattedCourses,
      ranking: ranking,
      id: formData.id || uuidv4(),
      slug: formData.slug
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
              University Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter university name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Auto-generated from name if left empty. Allowed characters: a-z, 0-9, -</p>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="ranking">
              Ranking
            </Label>
            <Input
              id="ranking"
              name="ranking"
              type="number"
              min="1"
              value={formData.ranking}
              onChange={handleChange}
              placeholder="University ranking"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tuition_fees_range">
              Tuition Fees Range
            </Label>
            <Input
              id="tuition_fees_range"
              name="tuition_fees_range"
              value={formData.tuition_fees_range}
              onChange={handleChange}
              placeholder="e.g., £9,000 - £12,000 per year"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="website_url">
              Website URL
            </Label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="https://www.university.edu"
            />
          </FormGroup>
        </div>

        <div>
          <div className="mb-6">
            <ImageUploader
              initialImageUrl={formData.logo_url}
              onImageChange={handleLogoChange}
              bucketName="university-assets"
              folderName="logos"
              label="University Logo"
              maxSizeMB={2}
              imageShape="square"
              previewSize={150}
            />
          </div>

          <div className="mb-6">
            <ImageUploader
              initialImageUrl={formData.banner_image_url}
              onImageChange={handleBannerChange}
              bucketName="university-assets"
              folderName="banners"
              label="University Banner Image"
              maxSizeMB={5}
              imageShape="square"
              previewSize={200}
            />
          </div>

          <FormGroup>
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the university"
              rows={3}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="accommodation_info">
              Accommodation Info
            </Label>
            <Textarea
              id="accommodation_info"
              name="accommodation_info"
              value={formData.accommodation_info}
              onChange={handleChange}
              placeholder="Information about student accommodation"
              rows={3}
            />
          </FormGroup>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Popular Courses</h3>
          <button
            type="button"
            onClick={addCourse}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Course
          </button>
        </div>

        {formData.popular_courses.map((course, index) => (
          <div key={course.id} className="flex gap-2 mb-2">
            <Input
              value={course.name}
              onChange={(e) => handleCourseChange(course.id, e.target.value)}
              placeholder={`Course ${index + 1}`}
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => removeCourse(course.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
              disabled={formData.popular_courses.length <= 1}
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
            university ? "Update University" : "Create University"
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default UniversityForm; 