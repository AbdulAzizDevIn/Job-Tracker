export interface JobApplication {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId?: string;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  jobApplications: JobApplication[];
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}
