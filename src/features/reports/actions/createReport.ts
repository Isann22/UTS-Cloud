'use server';

import { createReport as dbCreateReport } from '@/lib/db/queries';
import { uploadImageToS3 } from '@/lib/s3/upload';

interface CreateReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

export async function createReport(formData: FormData): Promise<CreateReportResult> {
  try {
    // Extract form data
    const description = formData.get('description') as string;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const image = formData.get('image') as File | null;

    // Validate input
    if (!description || !description.trim()) {
      return {
        success: false,
        error: 'Deskripsi wajib diisi',
      };
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return {
        success: false,
        error: 'Lokasi wajib diisi',
      };
    }

    // Validate latitude and longitude ranges
    if (latitude < -90 || latitude > 90) {
      return {
        success: false,
        error: 'Nilai latitude tidak valid',
      };
    }

    if (longitude < -180 || longitude > 180) {
      return {
        success: false,
        error: 'Nilai longitude tidak valid',
      };
    }

    // Upload image to S3 if provided
    let imageUrl: string | null = null;
    if (image && image.size > 0) {
      try {
        imageUrl = await uploadImageToS3(image);
      } catch (error) {
        console.error('Failed to upload image:', error);
        return {
          success: false,
          error: 'Gagal mengupload gambar',
        };
      }
    }

    // Insert report into database
    const report = await dbCreateReport({
      description: description.trim(),
      imageUrl,
      latitude,
      longitude,
      status: 'PENDING',
    });

    return {
      success: true,
      reportId: report.id,
    };
  } catch (error) {
    console.error('Failed to create report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal membuat laporan',
    };
  }
}
