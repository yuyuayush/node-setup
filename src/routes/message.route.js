import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/message.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', auth(), getConversations);
router.get('/:userId', auth(), getMessages);
router.post('/send/:receiverId', auth(), sendMessage);

export default router;
