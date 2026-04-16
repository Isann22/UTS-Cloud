'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Label, ErrorMessage } from '@/components/ui';
import ImageUpload from './ImageUpload';
import { useGeolocation } from '../hooks/useGeolocation';

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <p className="text-gray-500">Memuat peta...</p>
    </div>
  ),
});

interface ReportFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

export default function ReportForm({ onSubmit }: ReportFormProps) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { latitude: geoLat, longitude: geoLng, getCurrentLocation, loading: geoLoading, error: geoError } = useGeolocation();

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.location;
      return newErrors;
    });
  };

  const handleGetCurrentLocation = () => {
    getCurrentLocation();
  };

  // Update location when geolocation succeeds - FIXED: Moved to useEffect
  useEffect(() => {
    if (geoLat !== null && geoLng !== null && latitude === null) {
      setLatitude(geoLat);
      setLongitude(geoLng);
    }
  }, [geoLat, geoLng, latitude]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    if (latitude === null || longitude === null) {
      newErrors.location = 'Silakan pilih lokasi pada peta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (latitude === null || longitude === null) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('description', description.trim());
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      
      if (image) {
        formData.append('image', image);
      }

      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Gagal mengirim laporan' });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="description">Deskripsi *</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.description;
                return newErrors;
              });
            }
          }}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          placeholder="Jelaskan masalah kebersihan yang Anda temukan..."
        />
        {errors.description && <ErrorMessage message={errors.description} />}
      </div>

      <div>
        <Label htmlFor="image">Foto (opsional)</Label>
        <ImageUpload onImageChange={setImage} error={errors.image} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Lokasi *</Label>
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={geoLoading}
            variant="secondary"
            className="text-sm"
          >
            {geoLoading ? 'Mendapatkan lokasi...' : 'Gunakan Lokasi Saya'}
          </Button>
        </div>
        {geoError && <ErrorMessage message={geoError} />}
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleLocationChange}
        />
        {errors.location && <ErrorMessage message={errors.location} />}
      </div>

      {errors.submit && <ErrorMessage message={errors.submit} />}

      <Button type="submit" disabled={isSubmitting} className="w-full shadow-lg hover:shadow-xl transition-all">
        {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
      </Button>
    </form>
  );
}
