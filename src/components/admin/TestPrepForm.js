"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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

const TestPrepForm = ({ course, onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    id: "",
    test_name: "",
    slug: "",
    description: "",
    duration: "",
    price: "",
    display_order: "",
    features: [{ id: uuidv4(), text: "" }],
    schedule_options: [{ id: uuidv4(), text: "" }],
  });

  useEffect(() => {
    if (course) {
      // Format features if they exist and are in the JSON format
      let features = formatArrayField(course.features);
      let scheduleOptions = formatArrayField(course.schedule_options);
      
      setFormData({
        id: course.id || "",
        test_name: course.test_name || "",
        slug: course.slug || "",
        description: course.description || "",
        duration: course.duration || "",
        price: course.price || "",
        display_order: course.display_order?.toString() || "",
        features,
        schedule_options: scheduleOptions,
      });
    }
  }, [course]);

  // Helper function to format array fields
  const formatArrayField = (field) => {
    let formattedArray = [];
    
    if (field) {
      // Check if field is already an array of objects with id and text
      if (Array.isArray(field) && field.length > 0) {
        formattedArray = field.map(item => {
          if (typeof item === 'string') {
            return { id: uuidv4(), text: item };
          } else if (item.id && item.text) {
            return item;
          } else {
            return { id: uuidv4(), text: item.toString() };
          }
        });
      } else if (typeof field === 'object') {
        // Convert object format to array format
        formattedArray = Object.values(field).map(text => ({
          id: uuidv4(),
          text: text.toString(),
        }));
      }
    }
    
    // If no items or empty, initialize with one empty item
    if (formattedArray.length === 0) {
      formattedArray = [{ id: uuidv4(), text: "" }];
    }
    
    return formattedArray;
  };

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

  const handleTestNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, test_name: value }));
    
    // Auto-generate slug from test name if slug is empty
    if (!formData.slug) {
      handleSlugChange(e);
    }
  };

  // Handlers for array fields (features and schedule options)
  const handleItemChange = (fieldName, id, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item) =>
        item.id === id ? { ...item, text: value } : item
      ),
    }));
  };

  const addItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], { id: uuidv4(), text: "" }],
    }));
  };

  const removeItem = (fieldName, id) => {
    if (formData[fieldName].length <= 1) return; // Keep at least one item
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format arrays for database storage
    // Convert arrays of {id, text} to arrays of strings
    const formattedFeatures = formData.features
      .filter(feature => feature.text.trim() !== "") // Remove empty features
      .map(feature => feature.text);
    
    const formattedScheduleOptions = formData.schedule_options
      .filter(option => option.text.trim() !== "") // Remove empty schedule options
      .map(option => option.text);
    
    // Convert to number if present, otherwise null
    const displayOrder = formData.display_order 
      ? parseInt(formData.display_order, 10)
      : null;
    
    const formattedData = {
      ...formData,
      features: formattedFeatures,
      schedule_options: formattedScheduleOptions,
      display_order: displayOrder,
      // Generate ID if not present (for new courses)
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
            <Label htmlFor="test_name" required>
              Test Name
            </Label>
            <Input
              id="test_name"
              name="test_name"
              value={formData.test_name}
              onChange={handleTestNameChange}
              placeholder="Enter test name (e.g., IELTS, TOEFL)"
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
              placeholder="test-name-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the course page URL
            </p>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the test preparation course"
              rows={5}
            />
          </FormGroup>
        </div>

        <div>
          <FormGroup>
            <Label htmlFor="duration">
              Duration
            </Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 6 weeks, 2 months"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="price">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., £500, £600-£800"
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
      </div>

      {/* Features Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Course Features</h3>
          <button
            type="button"
            onClick={() => addItem('features')}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Feature
          </button>
        </div>

        {formData.features.map((feature, index) => (
          <div key={feature.id} className="flex gap-2 mb-2">
            <Input
              value={feature.text}
              onChange={(e) => handleItemChange('features', feature.id, e.target.value)}
              placeholder={`Feature ${index + 1}`}
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => removeItem('features', feature.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
              disabled={formData.features.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Schedule Options Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Schedule Options</h3>
          <button
            type="button"
            onClick={() => addItem('schedule_options')}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Schedule Option
          </button>
        </div>

        {formData.schedule_options.map((option, index) => (
          <div key={option.id} className="flex gap-2 mb-2">
            <Input
              value={option.text}
              onChange={(e) => handleItemChange('schedule_options', option.id, e.target.value)}
              placeholder={`Option ${index + 1} (e.g., Weekday Evenings, Weekend Mornings)`}
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => removeItem('schedule_options', option.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
              disabled={formData.schedule_options.length <= 1}
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
            course ? "Update Course" : "Create Course"
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default TestPrepForm; 