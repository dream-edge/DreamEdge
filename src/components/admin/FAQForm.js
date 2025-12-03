"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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

const FAQForm = ({ faq, onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    id: "",
    question: "",
    answer: "",
    category: "general",
    country: "general",
    display_order: "",
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        id: faq.id || "",
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "general",
        country: faq.country || "general",
        display_order: faq.display_order?.toString() || "",
      });
    }
  }, [faq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert display_order to number if present
    const displayOrder = formData.display_order 
      ? parseInt(formData.display_order, 10)
      : null;
    
    const formattedData = {
      ...formData,
      display_order: displayOrder,
      // Generate ID if not present (for new FAQs)
      id: formData.id || uuidv4(),
    };
    
    onSubmit(formattedData);
  };

  // FAQ categories
  const faqCategories = [
    { value: "general", label: "General" },
    { value: "application", label: "Application Process" },
    { value: "visa", label: "Visa & Immigration" },
    { value: "studying", label: "Studying Abroad" },
    { value: "costs", label: "Costs & Funding" },
    { value: "accommodation", label: "Accommodation" },
    { value: "test_preparation", label: "Test Preparation" },
  ];

  // Countries for FAQ filtering
  const countries = [
    { value: "general", label: "General (All Countries)" },
    { value: "uk", label: "United Kingdom" },
    { value: "usa", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
    { value: "newzealand", label: "New Zealand" },
    { value: "europe", label: "Europe" },
    { value: "japan", label: "Japan" },
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

      <div className="space-y-6">
        <FormGroup>
          <Label htmlFor="question" required>
            Question
          </Label>
          <Input
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="Enter the frequently asked question"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="answer" required>
            Answer
          </Label>
          <Textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter the answer to the question"
            rows={5}
            required
          />
        </FormGroup>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormGroup>
            <Label htmlFor="country">
              Country
            </Label>
            <Select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">
              Category
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {faqCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
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
            faq ? "Update FAQ" : "Create FAQ"
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default FAQForm; 