export interface Internship {
  id: string;
  title: string;
  ministry: string;
  location: string;
  duration: string;
  category: string;
  status: 'Available' | 'Shortlisted' | 'Under Review' | 'Applied';
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  education: string;
  skills: string[];
  resumeUrl?: string;
}

export interface Application {
  id: string;
  internshipId: string;
  status: 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';
  appliedDate: string;
}
