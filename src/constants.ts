// Helper function to get the correct API base URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return '/api'; // fallback for SSR
};

// API Configuration
export const API_CONFIG = {
  // Primary API hostname for dispute operations - using current origin
  get HOSTNAME() {
    return getApiBaseUrl();
  },
  
  // Secondary API hostname for dispute fetching - using current origin  
  get DISPUTES_HOSTNAME() {
    return getApiBaseUrl();
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  CREATE_DISPUTE: '/dispute',
  UPDATE_DISPUTE: '/update',
  GET_DISPUTES: '/disputes',
  GET_ASSIGNED_DISPUTES: '/disputes/assigned',
} as const; 