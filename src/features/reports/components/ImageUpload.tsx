'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ErrorMessage } from '@/components/ui';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  error?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function ImageUpload({ onImageChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setPreview(null);
      setValidationError('');
      onImageChange(null);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Hanya gambar JPEG, PNG, dan WebP yang diperbolehkan');
      setPreview(null);
      onImageChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setValidationError('Ukuran gambar harus kurang dari 5MB');
      setPreview(null);
      onImageChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Clear validation error and set preview
    setValidationError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setValidationError('');
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = validationError || error;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-medium
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100
          file:shadow-sm hover:file:shadow-md
          file:transition-all
          cursor-pointer"
      />
      
      {displayError && <ErrorMessage message={displayError} />}
      
      {preview && (
        <div className="relative mt-4">
          <img
            src={preview}
            alt="Pratinjau"
            className="w-full max-w-md h-auto rounded-lg border-2 border-gray-300 shadow-md"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
            aria-label="Hapus gambar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
