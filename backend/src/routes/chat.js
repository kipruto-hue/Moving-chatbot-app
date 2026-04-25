import express from 'express';
import { chat } from '../services/claude.js';
import { companies } from '../services/companies.js';
import { getAllData } from '../services/leads.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { messages, companyId = 'nellions' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required and must not be empty' });
    }

    const company = companies[companyId] || companies.nellions;
    const result = await chat(messages, company);

    res.json(result);
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      reply: 'I apologise — something went wrong on my end. Please try again or contact our team directly.',
      metadata: { leadCaptured: false, callbackScheduled: false, humanFlagged: false }
    });
  }
});

router.get('/leads', (req, res) => {
  res.json(getAllData());
});

export default router;
