import express from 'express';
import { smsQueue } from '../queue/sms.queue.js';
import logger from '../config/logger.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing to, subject, or html' });
  }

  try {
    await smsQueue.add('sendMail', { to, subject, html });
    logger.info(`📧 Email job added to queue for: ${to}`);
    return res.status(200).json({ ok: true, message: 'Mail queued successfully' });
  } catch (error) {
    logger.error(`❌ Failed to queue email: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error while queuing mail' });
  }
});

export default router;
