# Flappy Bird Clone with Authentication & Leaderboard

A complete Flappy Bird game implementation with user authentication and global leaderboard functionality.

## Features

### Game Features
- Classic Flappy Bird gameplay mechanics
- Smooth physics and controls (Space key or Click to jump)
- Collision detection with pipes
- Real-time score tracking
- Pause/Resume functionality
- Responsive canvas design

### Authentication
- User registration with email validation
- Secure login system with JWT tokens
- Password hashing with bcrypt
- Session management
- User profile display

### Leaderboard
- Global leaderboard with top 10 scores
- Time-based filters (All-time, Weekly, Daily)
- Personal best score tracking
- Score submission after game completion
- Ranking system with medals for top 3

## Tech Stack

### Frontend
- HTML5 Canvas API for game rendering
- Vanilla JavaScript (ES6+)
- CSS3 with Flexbox/Grid
- Responsive design

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
# Create database
createdb flappybird

# Or using psql:
psql -U postgres
CREATE DATABASE flappybird;
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Initialize the database:
```bash
npm run init-db
```

5. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Scores
- `POST /api/scores` - Submit a game score (requires authentication)
- `GET /api/scores/leaderboard?period={all|weekly|daily}&limit={number}` - Get leaderboard
- `GET /api/scores/personal` - Get personal scores (requires authentication)
- `GET /api/scores/user/:userId` - Get scores for specific user

## Database Schema

### Users Table
```sql
- id: SERIAL PRIMARY KEY
- username: VARCHAR(50) UNIQUE NOT NULL
- email: VARCHAR(100) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Scores Table
```sql
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES users(id)
- score: INTEGER NOT NULL
- game_stats: JSONB
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## How to Play

1. **Sign Up / Login**: Create an account or log in to save your scores
2. **Start Game**: Click "Start Game" from the main menu
3. **Control the Bird**: Press SPACE or Click to make the bird fly
4. **Avoid Obstacles**: Navigate through pipes without hitting them
5. **Score Points**: Each pipe you pass increases your score
6. **Submit Score**: After game over, submit your score to the leaderboard
7. **Compete**: Check the leaderboard to see how you rank against other players

## Game Controls

- **Space Bar** or **Mouse Click**: Make the bird jump
- **Pause Button**: Pause/Resume the game

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Input validation on both frontend and backend
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- CORS configuration for API security

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Database Reinitialization
If you need to reset the database:
```bash
npm run init-db
```

## Project Structure
```
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js             # Authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   └── scores.js           # Score management routes
├── scripts/
│   └── init-db.js          # Database initialization
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styles
│   └── js/
│       ├── api.js          # API client
│       ├── auth.js         # Auth manager
│       ├── game.js         # Game logic
│       ├── leaderboard.js  # Leaderboard manager
│       └── app.js          # Main app controller
├── server.js               # Express server
├── package.json
└── README.md
```

## Future Enhancements

- User avatars and profiles
- Game difficulty levels
- Power-ups and special items
- Achievements system
- Social features (friends, challenges)
- Mobile app version
- Sound effects and background music
- Daily/weekly challenges

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
