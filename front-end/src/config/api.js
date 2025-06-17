// API configuration
const API_CONFIG = {
  // Use only local backend
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Endpoints
  ENDPOINTS: {
    HOLIDAYS: '/holidays',
    COUNTRIES: '/countries',
    HEALTH: '/health'
  }
};

export default API_CONFIG;
