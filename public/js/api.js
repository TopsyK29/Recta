const API_BASE_URL = window.location.origin + '/api';

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  async signup(username, email, password) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  },

  async getProfile() {
    return this.request('/auth/profile');
  },

  async submitScore(score, gameStats = {}) {
    return this.request('/scores', {
      method: 'POST',
      body: JSON.stringify({ score, gameStats }),
    });
  },

  async getLeaderboard(period = 'all', limit = 10) {
    return this.request(`/scores/leaderboard?period=${period}&limit=${limit}`);
  },

  async getPersonalScores() {
    return this.request('/scores/personal');
  },

  async getUserScores(userId) {
    return this.request(`/scores/user/${userId}`);
  },
};
