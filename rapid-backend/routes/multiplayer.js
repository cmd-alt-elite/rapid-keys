import express from 'express';
import { multiplayerController } from '../controllers/multiplayer.js';

const router = express.Router();

router.post('/', multiplayerController.saveRecord);
router.get('/leaderboard', multiplayerController.getLeaderboard);

export default router;