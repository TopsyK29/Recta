const express = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/',
  authMiddleware,
  [
    body('score').isInt({ min: 0, max: 100000 }),
    body('gameStats').optional().isObject(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { score, gameStats } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO scores (user_id, score, game_stats) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, score, JSON.stringify(gameStats || {})]
      );

      res.status(201).json({
        message: 'Score submitted successfully',
        score: result.rows[0],
      });
    } catch (error) {
      console.error('Submit score error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/leaderboard',
  [
    query('period').optional().isIn(['daily', 'weekly', 'all']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const period = req.query.period || 'all';
    const limit = parseInt(req.query.limit) || 10;

    try {
      let dateFilter = '';
      if (period === 'daily') {
        dateFilter = "AND scores.created_at >= NOW() - INTERVAL '1 day'";
      } else if (period === 'weekly') {
        dateFilter = "AND scores.created_at >= NOW() - INTERVAL '7 days'";
      }

      const query = `
        SELECT 
          scores.id,
          scores.score,
          scores.created_at,
          users.username,
          users.id as user_id,
          ROW_NUMBER() OVER (ORDER BY scores.score DESC, scores.created_at ASC) as rank
        FROM scores
        JOIN users ON scores.user_id = users.id
        WHERE 1=1 ${dateFilter}
        ORDER BY scores.score DESC, scores.created_at ASC
        LIMIT $1
      `;

      const result = await db.query(query, [limit]);

      res.json({
        period,
        leaderboard: result.rows,
      });
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/user/:userId',
  async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
      const result = await db.query(
        `SELECT 
          scores.id,
          scores.score,
          scores.created_at,
          scores.game_stats
        FROM scores
        WHERE scores.user_id = $1
        ORDER BY scores.score DESC
        LIMIT 20`,
        [userId]
      );

      const personalBest = result.rows.length > 0 ? result.rows[0].score : 0;

      res.json({
        scores: result.rows,
        personalBest,
      });
    } catch (error) {
      console.error('User scores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/personal',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await db.query(
        `SELECT 
          scores.id,
          scores.score,
          scores.created_at,
          scores.game_stats
        FROM scores
        WHERE scores.user_id = $1
        ORDER BY scores.score DESC
        LIMIT 20`,
        [req.user.id]
      );

      const personalBest = result.rows.length > 0 ? result.rows[0].score : 0;

      res.json({
        scores: result.rows,
        personalBest,
      });
    } catch (error) {
      console.error('Personal scores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
