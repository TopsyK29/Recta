class LeaderboardManager {
  constructor() {
    this.currentPeriod = 'all';
    this.setupEventListeners();
  }

  setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const period = button.dataset.period;
        this.changePeriod(period);
      });
    });
  }

  async changePeriod(period) {
    this.currentPeriod = period;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      if (button.dataset.period === period) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    await this.loadLeaderboard();
  }

  async loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<div class="loading">Loading...</div>';

    try {
      const response = await api.getLeaderboard(this.currentPeriod, 10);
      this.displayLeaderboard(response.leaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      leaderboardList.innerHTML = '<div class="loading">Failed to load leaderboard</div>';
    }
  }

  displayLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById('leaderboardList');

    if (leaderboard.length === 0) {
      leaderboardList.innerHTML = '<div class="loading">No scores yet. Be the first!</div>';
      return;
    }

    leaderboardList.innerHTML = '';

    leaderboard.forEach((entry, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      
      if (index === 0) {
        item.classList.add('top-1', 'top-3');
      } else if (index === 1) {
        item.classList.add('top-2', 'top-3');
      } else if (index === 2) {
        item.classList.add('top-3');
      }

      const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
      
      item.innerHTML = `
        <div class="leaderboard-rank">${rankEmoji || (index + 1)}</div>
        <div class="leaderboard-user">${this.escapeHtml(entry.username)}</div>
        <div class="leaderboard-score">${entry.score}</div>
      `;

      leaderboardList.appendChild(item);
    });
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  async getPersonalBest() {
    if (!authManager.isAuthenticated()) {
      return 0;
    }

    try {
      const response = await api.getPersonalScores();
      return response.personalBest;
    } catch (error) {
      console.error('Error getting personal best:', error);
      return 0;
    }
  }
}

const leaderboardManager = new LeaderboardManager();
