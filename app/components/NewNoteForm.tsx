"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the schema using zod
const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(1000),
});

// Type definition based on the schema
type NoteFormData = z.infer<typeof noteSchema>;

export default function NewNoteForm() {
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the form data using zod
      const validatedData = noteSchema.parse(formData);

      // If validation passes, handle the submission
      console.log(validatedData);

      // Reset form
      setFormData({
        title: "",
        content: "",
      });

      // Clear errors
      setErrors({});

      // Show success message
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        // Convert zod errors to a usable format
        const formattedErrors: { [key: string]: string } = {};

        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });

        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isSubmitted && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded border border-green-200 dark:border-green-800">
          Note saved successfully!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-white dark:bg-gray-900"
          />
          {errors.title && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Content
          </label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="min-h-32 bg-white dark:bg-gray-900"
          />
          {errors.content && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.content}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Save Note
        </Button>
      </form>
    </div>
  );
}
