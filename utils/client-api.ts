import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import FormData from 'form-data';
import { toast } from 'sonner';
import { School } from './interface/school.types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Retrieve token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async (email: string, type: string, jobTitle?: string) => {
  try {
    const data: {
      email: string;
      type: string;
      job_title?: string;
    } = {
      email,
      type
    };

    if (jobTitle) data.job_title = jobTitle;

    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Connect staff to school
export const connectStaffToSchool = async (userEmail: string, schoolId: string) => {
  try {
    const response = await apiClient.post('/schools/connect', {
      user_email: userEmail,
      school_id: schoolId
    });
    return response.data;
  } catch (error) {
    console.error('Connect staff to school error:', error);
    throw error;
  }
};

// Login
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    document.cookie = `token=${response.data.token}; path=/`; // Store token in cookies
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (email: string, tempPassword: string, newPassword: string, newPasswordConfirm: string) => {
  try {
    const response = await apiClient.post('/verify-email', {
      email,
      temp_password: tempPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return response.data;
  } catch (error) {
    console.error('Verify email error:', error);
    throw error;
  }
};


// update user info
type UserInfo = {
  full_name?: string;
  student_id?: string;
  roll_no?: string;
  section?: string;
  gender?: string;
  age?: string;
}


export const updateUserInfo = async (userInfo: UserInfo, user_id: string) => {
  try {
    const response = await apiClient.patch(`/users/${user_id}`, userInfo);
    return response.data;
  } catch (error) {
    console.error('Update user info error:', error);
    throw error;
  }
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.file_url;
  } catch (error) {
    console.error('File upload error:', error);
    if (axios.isAxiosError(error)) {
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        toast.error(`Upload failed: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from server');
      } else {
        // Something happened in setting up the request
        toast.error('Error setting up file upload');
      }
    }
    throw error;
  }
};

export const updateUserProfile = async (fullName?: string, avatarUrl?: string, jobTitle?: string) => {
  const data: { full_name?: string; avatar_url?: string; job_title?: string } = {};
  if (fullName) data.full_name = fullName;
  if (avatarUrl) data.avatar_url = avatarUrl;
  if (jobTitle) data.job_title = jobTitle;

  try {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export const createSchool = async (school: Omit<School, '_id' | 'createdAt'>) => {
  try {
    const response = await apiClient.post('/schools/create', school);
    
    // Extract the school object from the response
    if (response.data && response.data.status === 'success' && response.data.school) {
      return response.data.school;
    }
    
    return response.data;
  } catch (error) {
    console.error('Create school error:', error);
    throw error;
  }
};

// Generate QR code for a school
export const generateSchoolQRCode = async (schoolId: string) => {
  try {
    const response = await apiClient.get(`/schools/generate-qr/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Generate QR code error:', error);
    throw error;
  }
};

// Fetch schools with pagination, sorting and search
export interface SchoolsResponse {
  status: string;
  data: {
    schools: School[];
    totalSchools: number;
  };
}

// Fetch params interface
export interface FetchSchoolsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const fetchSchools = async ({
  page = 1, 
  limit = 10, 
  search = '',
  sortBy = 'school_name',
  order = 'asc'
}: FetchSchoolsParams = {}): Promise<SchoolsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page?.toString());
    params.append('limit', limit?.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (sortBy) {
      params.append('sortBy', sortBy);
      params.append('order', order);
    }
    
    const response = await apiClient.get(`/schools?${params?.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Fetch schools error:', error);
    throw error;
  }
};

// Store QR code URL for a school (separate from the logo)
export const storeSchoolQRCode = async (schoolId: string, qrCodeUrl: string) => {
  try {
    const response = await apiClient.put(`/schools/${schoolId}`, {
      qr_url: qrCodeUrl
    });
    return response.data;
  } catch (error) {
    console.error('Store QR code error:', error);
    throw error;
  }
};

// Update a school by ID
export const updateSchool = async (schoolId: string, schoolData: Partial<Omit<School, '_id'>>) => {
  try {
    const response = await apiClient.put(`/schools/${schoolId}`, schoolData);
    return response.data;
  } catch (error) {
    console.error('Update school error:', error);
    throw error;
  }
};

// Delete a school by ID
export const deleteSchool = async (schoolId: string) => {
  try {
    const response = await apiClient.delete(`/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Delete school error:', error);
    throw error;
  }
};

// Fetch users with pagination, sorting and search
export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  school?: string;
  section?: string;
  job_title?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const fetchUsers = async ({
  page = 1, 
  limit = 10, 
  search = '',
  type = '',
  school = '',
  section = '',
  job_title = '',
  sortBy = 'createdAt',
  order = 'desc'
}: FetchUsersParams = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page?.toString());
    params.append('limit', limit?.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (type) {
      params.append('type', type);
    }
    
    if (school) {
      params.append('school', school);
    }
    
    if (section) {
      params.append('section', section);
    }
    
    if (job_title) {
      params.append('job_title', job_title);
    }
    
    if (sortBy) {
      params.append('sortBy', sortBy);
      params.append('order', order);
    }
    
    const response = await apiClient.get(`/users/all?${params?.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Fetch a specific school by ID
export const fetchSchoolById = async (schoolId: string) => {
  try {
    const response = await apiClient.get(`/schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch school by ID error:', error);
    throw error;
  }
};

export default apiClient;


