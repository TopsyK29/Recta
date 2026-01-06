class AuthManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUser = JSON.parse(user);
      this.updateUI();
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', () => this.showLoginForm());
    document.getElementById('signupBtn').addEventListener('click', () => this.showSignupForm());
    document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    
    document.querySelector('.close').addEventListener('click', () => this.closeModal());
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
      e.preventDefault();
      this.showSignupForm();
    });
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });

    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    document.getElementById('signupFormElement').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });

    document.getElementById('authModal').addEventListener('click', (e) => {
      if (e.target.id === 'authModal') {
        this.closeModal();
      }
    });
  }

  showLoginForm() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginFormElement').reset();
  }

  showSignupForm() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupError').textContent = '';
    document.getElementById('signupFormElement').reset();
  }

  closeModal() {
    document.getElementById('authModal').classList.add('hidden');
  }

  async handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    try {
      errorElement.textContent = '';
      const response = await api.login(username, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      this.currentUser = response.user;
      this.updateUI();
      this.closeModal();
      
      if (window.app) {
        window.app.onAuthChange();
      }
    } catch (error) {
      errorElement.textContent = error.message || 'Login failed. Please try again.';
    }
  }

  async handleSignup() {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const errorElement = document.getElementById('signupError');

    try {
      errorElement.textContent = '';
      const response = await api.signup(username, email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      this.currentUser = response.user;
      this.updateUI();
      this.closeModal();
      
      if (window.app) {
        window.app.onAuthChange();
      }
    } catch (error) {
      errorElement.textContent = error.message || 'Signup failed. Please try again.';
    }
  }

  async logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.updateUI();
    
    if (window.app) {
      window.app.onAuthChange();
    }
  }

  updateUI() {
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    const userName = document.getElementById('userName');

    if (this.currentUser) {
      userName.textContent = this.currentUser.username;
      userInfo.classList.remove('hidden');
      authButtons.classList.add('hidden');
    } else {
      userInfo.classList.add('hidden');
      authButtons.classList.remove('hidden');
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

const authManager = new AuthManager();
