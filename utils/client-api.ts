import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import FormData from 'form-data';
import { toast } from 'sonner';
import { School } from './interface/school.types';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your API base URL
  // headers: {
  //   'Content-Type': 'application/json',
  // },
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

export const signup = async (email: string, type: string, fullName?: string, jobTitle?: string) => {
  try {
    const data: {
      email: string;
      type: string;
      full_name?: string;
      job_title?: string;
      jobTitle?: string; // Try camelCase version as well
    } = {
      email,
      type
    };

    if (fullName) data.full_name = fullName;
    if (jobTitle) {
      data.job_title = jobTitle;   
    }

    // Log the data being sent to the API for debugging
    console.log('Signup data being sent:', JSON.stringify(data));

    const response = await apiClient.post('/auth/signup', data);
    
    // If job title wasn't accepted in the signup, let's try to update it directly
    if (jobTitle && response.data && response.data.user && response.data.user.id) {
      try {
        await apiClient.patch(`/users/${response.data.user.id}`, {
          job_title: jobTitle
        });
        console.log('Job title updated separately');
      } catch (updateError) {
        console.warn('Could not update job title separately:', updateError);
      }
    }
    
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

export const createSchool = async (school: Omit<School, 'id' | 'createdAt'>) => {
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

// Dedicated function for staff creation that handles both signup and job title update
export const createStaffMember = async (email: string, type: string, fullName?: string, jobTitle?: string) => {
  try {
    // 1. Create the user account first
    const signupResponse = await signup(email, type, fullName);
    console.log('Signup completed, now handling job title');
    
    // 2. If job title was provided, update the user profile
    if (jobTitle) {
      // We can try two approaches:
      
      // Approach 1: Update the user's own profile
      try {
        // This would work if the auth token for the new user is returned and set
        const updateResponse = await updateUserProfile(undefined, undefined, jobTitle);
        console.log('Updated job title via user profile:', updateResponse);
      } catch (error) {
        console.warn('Could not update job title via profile:', error);
        
        // Approach 2: If we have a user ID, try updating it directly
        if (signupResponse && signupResponse.user && signupResponse.user.id) {
          try {
            const directUpdateResponse = await apiClient.patch(`/users/${signupResponse.user.id}`, {
              job_title: jobTitle
            });
            console.log('Updated job title directly:', directUpdateResponse.data);
          } catch (directError) {
            console.error('Could not update job title directly:', directError);
          }
        }
      }
    }
    
    return signupResponse;
  } catch (error) {
    console.error('Staff creation error:', error);
    throw error;
  }
};

export default apiClient;


