import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Holidays service
export const holidaysService = {
  // Get holidays from local backend
  async getHolidays(countryCode, year) {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.HOLIDAYS}/${year}/${countryCode}`);
      return response.data;
    } catch (error) {
      console.error('Error getting holidays from local backend:', error);
      throw error;
    }
  },

  // Get holidays with local backend only
  async getHolidaysWithFallback(countryCode, year) {
    try {
      // Use only local backend
      return await this.getHolidays(countryCode, year);
    } catch (localError) {
      console.error('Local backend error:', localError);
      throw new Error('Could not retrieve holidays. Please check that the backend server is running.');
    }
  },

  // Get list of countries
  async getCountries() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.COUNTRIES);
      return response.data;
    } catch (error) {
      console.error('Error getting countries:', error);
      // Fallback to hardcoded country list
      return this.getDefaultCountries();
    }
  },

  // Check backend health
  async checkHealth() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      console.error('Backend unavailable:', error);
      return { status: 'ERROR', message: 'Backend unavailable' };
    }
  },

  // Default country list (fallback)
  getDefaultCountries() {
    return [
      { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺' },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱' },
      { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'JP', name: 'Japan', flag: '🇯🇵' },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
      { code: 'PE', name: 'Peru', flag: '🇵🇪' },
      { code: 'US', name: 'United States', flag: '🇺🇸' },
    ];
  }
};

export default holidaysService;
