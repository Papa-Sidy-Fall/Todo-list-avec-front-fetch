const API_BASE_URL = 'http://localhost:3080';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Fetching', url, config);
      const response = await fetch(url, config);
      let data;
      if (response.status === 204) {
        data = null;
      } else {
        data = await response.json();
      }

      if (!response.ok && response.status !== 400 && response.status !== 409) {
        throw new Error(data?.message || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async logout() {
    this.clearToken();
  }

  // Tasks endpoints
  async getTasks(page = 1, limit = 10) {
    return this.request(`/taches?page=${page}&limit=${limit}`);
  }

  async getTask(id) {
    return this.request(`/taches/${id}`);
  }

  async createTask(taskData) {
    // Détecter si c'est un FormData (pour l'upload d'image)
    const isFormData = taskData instanceof FormData;

    return this.request('/taches', {
      method: 'POST',
      body: isFormData ? taskData : JSON.stringify(taskData),
      headers: isFormData ? {
        // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      } : undefined,
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/taches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/taches/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(id, status) {
    return this.request(`/taches/${id}/${status}`, {
      method: 'PATCH',
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export default new ApiService();
