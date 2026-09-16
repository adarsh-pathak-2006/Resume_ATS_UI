// TypeScript interfaces for all API responses

export interface User {
  username: string;
  email: string;
}

export interface Resume {
  id: number;
  user: User;
  resume: string; // URL to the uploaded file
  added_on: string;
}

export interface Analysis {
  id: number;
  user: User;
  resume: Resume;
  job_description: string;
  about_company: string;
  letter_required: boolean;
  generated_resume: string | null;
  cover_letter: string | null;
  created_on: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AnalyzeRequest {
  job_description: string;
  about_company: string;
  letter_required: boolean;
}

export interface AnalyzeResponse {
  message: string;
  task_id: string;
  analysis_id: number;
}

export interface ApiError {
  message?: string;
  detail?: string;
  [key: string]: unknown;
}
