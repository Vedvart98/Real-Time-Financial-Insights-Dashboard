import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar-pro", // Valid Perplexity model
        messages: [
          { role: "system", content: "You are a financial assistant that helps users analyze stocks, crypto, and portfolios." },
          { role: "user", content: query },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Query error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
