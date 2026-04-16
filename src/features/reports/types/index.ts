export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface Report {
  id: string;
  description: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportFormData {
  description: string;
  image?: File;
  latitude: number;
  longitude: number;
}
