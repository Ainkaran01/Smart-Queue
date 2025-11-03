import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('accessToken', access);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'CITIZEN' | 'STAFF' | 'ADMIN';
  date_joined: string;
}
// Contact API
export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: 'general' | 'technical' | 'jaffna' | 'feedback' | 'other';
  message: string;
  submitted_at?: string;
  is_resolved?: boolean;
}
export interface Service {
  id: number;
  name: string;
  department: string;
  description: string;
  avg_service_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  token_code: string;
  service: Service;
  citizen: User;
  appointment_datetime: string;
  priority: 'NORMAL' | 'ELDERLY' | 'DISABLED' | 'EMERGENCY';
  status: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  predicted_wait_minutes: number;
  actual_wait_minutes?: number;
  notes: string;
  created_at: string;
  updated_at: string;
  estimated_completion_time: string;
  qr_code?: string; // URL to the QR code image
}

export interface MyAppointment {
  id: string;
  token_code: string;
  service_name: string;
  appointment_datetime: string;
  priority: string;
  status: string;
  predicted_wait_minutes: number;
  estimated_completion_time: string;
  notes: string;
  created_at: string;
  qr_code_url?: string;  
}
export interface AvailableSlot {
  id: number;
  datetime: string;
  current_bookings: number;
  max_capacity: number;
}
export interface CreateAppointmentData {
  service: number;
  appointment_datetime: string;
  priority: string;
  notes?: string;
  slot_id?: number;
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }).then(res => res.data),
  
  register: (userData: any) =>
    api.post('/auth/register/', userData).then(res => res.data),
  
  getProfile: (): Promise<User> =>
    api.get('/auth/profile/').then(res => res.data),
  
  updateProfile: (data: Partial<User>) =>
    api.put('/auth/profile/update/', data).then(res => res.data),
  
 updatePassword: (data: { old_password: string; new_password1: string; new_password2: string }) =>
  api.post('/auth/password/change/', data).then(res => res.data),



};

// Services API
export const servicesApi = {
  getAll: (): Promise<Service[]> =>
    api.get('/services/').then(res => res.data.results),
  
  getForBooking: (): Promise<Pick<Service, 'id' | 'name' | 'department' | 'avg_service_minutes'>[]> =>
    api.get('/services/booking-list/').then(res => res.data),
  
  create: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) =>
    api.post('/services/', data).then(res => res.data),
  
  update: (id: number, data: Partial<Service>) =>
    api.put(`/services/${id}/`, data).then(res => res.data),
  
  delete: (id: number) =>
    api.delete(`/services/${id}/`),
};

export const contactApi = {
  submit: (data: ContactSubmission) =>
    api.post('/contact/create/', data).then(res => res.data), // ✅ matches backend

  getAll: () => api.get('/contact/all/').then(res => res.data), // for admin/staff listing
};

// Appointments API
export const appointmentsApi = {
  create: (data: CreateAppointmentData) =>
    api.post('/appointments/create/', data).then(res => res.data),
  
  getMine: (): Promise<MyAppointment[]> =>
    api.get('/appointments/mine/').then(res => res.data.results),
  
  getAll: (): Promise<Appointment[]> =>
    api.get('/appointments/all/').then(res => res.data.results),
  
  getById: (id: string): Promise<Appointment> =>
    api.get(`/appointments/${id}/`).then(res => res.data),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/appointments/${id}/status/`, { status }).then(res => res.data),
  
  getQueueStatus: () =>
    api.get('/appointments/queue/status/').then(res => res.data),

  // --- New: Get available slots for a specific date ---
   getAvailableSlots: (date: string, serviceId: number): Promise<AvailableSlot[]> =>
    api.get(`/appointments/available-slots/`, { 
      params: { date, service_id: serviceId } 
    }).then(res => res.data),
};


// Operations API
export const opsApi = {
  getAnalytics: () =>
    api.get('/ops/analytics/').then(res => res.data),
  
  getServicePerformance: () =>
    api.get('/ops/service-performance/').then(res => res.data),
};

export default api;