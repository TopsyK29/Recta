class FlappyBirdGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.bird = {
      x: 80,
      y: 250,
      width: 34,
      height: 24,
      velocity: 0,
      gravity: 0.5,
      jump: -8,
    };

    this.pipes = [];
    this.pipeWidth = 60;
    this.pipeGap = 150;
    this.pipeSpeed = 2;
    this.frameCount = 0;

    this.score = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.isPaused = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.gameOver && this.gameStarted) {
        e.preventDefault();
        this.jump();
      }
    });

    this.canvas.addEventListener('click', () => {
      if (!this.gameOver && this.gameStarted) {
        this.jump();
      }
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
      this.togglePause();
    });
  }

  jump() {
    if (!this.isPaused) {
      this.bird.velocity = this.bird.jump;
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    document.getElementById('pauseBtn').textContent = this.isPaused ? 'Resume' : 'Pause';
    if (!this.isPaused) {
      this.gameLoop();
    }
  }

  start() {
    this.reset();
    this.gameStarted = true;
    this.gameLoop();
  }

  reset() {
    this.bird.y = 250;
    this.bird.velocity = 0;
    this.pipes = [];
    this.score = 0;
    this.gameOver = false;
    this.frameCount = 0;
    this.isPaused = false;
    document.getElementById('pauseBtn').textContent = 'Pause';
    this.updateScore();
  }

  gameLoop() {
    if (this.gameOver || this.isPaused) {
      return;
    }

    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.bird.velocity += this.bird.gravity;
    this.bird.y += this.bird.velocity;

    if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
      this.endGame();
      return;
    }

    this.frameCount++;
    if (this.frameCount % 100 === 0) {
      this.addPipe();
    }

    this.pipes.forEach((pipe, index) => {
      pipe.x -= this.pipeSpeed;

      if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
        this.score++;
        pipe.scored = true;
        this.updateScore();
      }

      if (pipe.x + this.pipeWidth < 0) {
        this.pipes.splice(index, 1);
      }

      if (this.checkCollision(pipe)) {
        this.endGame();
      }
    });
  }

  addPipe() {
    const minHeight = 50;
    const maxHeight = this.canvas.height - this.pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    this.pipes.push({
      x: this.canvas.width,
      topHeight: topHeight,
      bottomY: topHeight + this.pipeGap,
      scored: false,
    });
  }

  checkCollision(pipe) {
    const birdLeft = this.bird.x;
    const birdRight = this.bird.x + this.bird.width;
    const birdTop = this.bird.y;
    const birdBottom = this.bird.y + this.bird.height;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + this.pipeWidth;

    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        return true;
      }
    }

    return false;
  }

  draw() {
    this.ctx.fillStyle = '#87ceeb';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2, this.bird.width / 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x + 20, this.bird.y + 8, 3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#FFA500';
    this.ctx.beginPath();
    this.ctx.moveTo(this.bird.x + 28, this.bird.y + 12);
    this.ctx.lineTo(this.bird.x + 35, this.bird.y + 12);
    this.ctx.lineTo(this.bird.x + 28, this.bird.y + 16);
    this.ctx.fill();

    this.ctx.fillStyle = '#228B22';
    this.pipes.forEach((pipe) => {
      this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
      this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);

      this.ctx.fillStyle = '#32CD32';
      this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, this.pipeWidth + 10, 20);
      this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 20);
      this.ctx.fillStyle = '#228B22';
    });
  }

  updateScore() {
    document.getElementById('currentScore').textContent = `Score: ${this.score}`;
  }

  endGame() {
    this.gameOver = true;
    this.gameStarted = false;
    
    if (window.app) {
      window.app.showGameOver(this.score);
    }
  }

  getScore() {
    return this.score;
  }
}

const game = new FlappyBirdGame();
