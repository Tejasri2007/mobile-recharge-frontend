const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mobile-recharge-backend-9hk1.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // User endpoints
  async getProfile() {
    return await this.request('/users/profile');
  }

  // Plans endpoints
  async getPlans(operator = '') {
    const endpoint = operator ? `/plans?operator=${operator}` : '/plans';
    return await this.request(endpoint);
  }

  async createPlan(planData) {
    return await this.request('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(planId, planData) {
    return await this.request(`/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deletePlan(planId) {
    return await this.request(`/plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // Recharge endpoints
  async createRecharge(rechargeData) {
    return await this.request('/recharge', {
      method: 'POST',
      body: JSON.stringify(rechargeData),
    });
  }

  async getUserRecharges() {
    return await this.request('/recharge/history');
  }

  async getAllRecharges() {
    return await this.request('/recharge/all');
  }

  async getTransactionStats() {
    return await this.request('/recharge/stats');
  }
}

export const apiService = new ApiService();
export default apiService;
