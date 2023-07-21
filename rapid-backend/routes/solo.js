import express from 'express';
import { soloController } from '../controllers/solo.js';

const router = express.Router();

router.post('/', soloController.saveRecord);
router.get('/leaderboard', soloController.getLeaderboard);

export default router;