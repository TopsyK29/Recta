class App {
  constructor() {
    this.currentScreen = 'mainMenu';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showScreen('mainMenu');
  }

  setupEventListeners() {
    document.getElementById('startGameBtn').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
      this.showLeaderboard();
    });

    document.getElementById('playAgainBtn').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('backToMenuBtn').addEventListener('click', () => {
      this.showScreen('mainMenu');
    });

    document.getElementById('backFromLeaderboardBtn').addEventListener('click', () => {
      this.showScreen('mainMenu');
    });

    document.getElementById('submitScoreBtn').addEventListener('click', () => {
      this.submitScore();
    });
  }

  showScreen(screenName) {
    const screens = ['mainMenu', 'gameScreen', 'gameOverScreen', 'leaderboardScreen'];
    
    screens.forEach(screen => {
      const element = document.getElementById(screen);
      if (screen === screenName) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });

    this.currentScreen = screenName;
  }

  startGame() {
    this.showScreen('gameScreen');
    game.start();
  }

  async showGameOver(score) {
    document.getElementById('finalScore').textContent = score;

    if (authManager.isAuthenticated()) {
      document.getElementById('scoreSubmission').classList.remove('hidden');
      document.getElementById('submitScoreBtn').disabled = false;
      document.getElementById('submitScoreBtn').textContent = 'Submit Score';
      document.getElementById('submissionStatus').textContent = '';

      const personalBest = await leaderboardManager.getPersonalBest();
      if (personalBest > 0) {
        document.getElementById('personalBestDisplay').classList.remove('hidden');
        document.getElementById('personalBest').textContent = personalBest;
      }
    } else {
      document.getElementById('scoreSubmission').classList.add('hidden');
      document.getElementById('personalBestDisplay').classList.add('hidden');
    }

    this.showScreen('gameOverScreen');
  }

  async submitScore() {
    if (!authManager.isAuthenticated()) {
      alert('Please log in to submit your score');
      return;
    }

    const score = game.getScore();
    const submitBtn = document.getElementById('submitScoreBtn');
    const statusElement = document.getElementById('submissionStatus');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      statusElement.textContent = '';

      await api.submitScore(score, {
        timestamp: new Date().toISOString(),
      });

      statusElement.textContent = '✓ Score submitted successfully!';
      statusElement.style.color = '#28a745';
      submitBtn.textContent = 'Submitted';

      const personalBest = await leaderboardManager.getPersonalBest();
      if (personalBest > 0) {
        document.getElementById('personalBestDisplay').classList.remove('hidden');
        document.getElementById('personalBest').textContent = personalBest;
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      statusElement.textContent = '✗ Failed to submit score';
      statusElement.style.color = '#dc3545';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Score';
    }
  }

  async showLeaderboard() {
    this.showScreen('leaderboardScreen');
    await leaderboardManager.loadLeaderboard();
  }

  onAuthChange() {
    if (this.currentScreen === 'gameOverScreen') {
      const score = game.getScore();
      this.showGameOver(score);
    }
  }
}

const app = new App();
window.app = app;
