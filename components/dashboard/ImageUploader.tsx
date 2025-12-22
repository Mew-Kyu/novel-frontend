"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import apiClient from "@/lib/generated-api";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export function ImageUploader({
  onUploadComplete,
  currentImageUrl,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentImageUrl
  );
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await apiClient.cloudinary.uploadImage(file);
      const uploadedUrl = response.data.url;
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        onUploadComplete(uploadedUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onUploadComplete("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <input
            type="file"
            onChange={handleChange}
            accept="image/*"
            aria-label="Upload image file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
