import express from 'express';
import { roomController } from '../controllers/rooms.js';

const router = express.Router();

router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);
router.patch('/:id', roomController.updateRoom);

export default router;