export interface User {
  _id: string;
  email: string;
  // Add other user fields as needed
}

export interface School {
  _id: string;
  school_name: string;
  // Add other school fields as needed
}

export interface BlockRequest {
  _id: string;
  user: User;
  school: School;
  site_url: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}