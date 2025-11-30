// Prefer VITE_API_URL (set in .env) otherwise try common local backend ports.
// Historically the backend has been started on 3001 during development; keep 3001 as the
// fallback to avoid `ERR_CONNECTION_REFUSED` when the frontend defaulted to 5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  user?: T;
  token?: string;
  errors?: Array<{ msg: string; param: string }>;
}

class AuthService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(userData: RegisterData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      let data: any = { success: false, message: 'Unknown error' };
      const text = await response.text();
      try {
        data = JSON.parse(text || '{}');
      } catch (e) {
        data = { success: false, message: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors || []
        };
      }

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      let data: any = { success: false, message: 'Unknown error' };
      const text = await response.text();
      try {
        data = JSON.parse(text || '{}');
      } catch (e) {
        data = { success: false, message: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors || []
        };
      }

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          ...this.getAuthHeader(),
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async updateProfile(userData: Partial<RegisterData>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success && data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }
}

export default new AuthService();