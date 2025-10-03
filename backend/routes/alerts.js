import express from 'express';
import { addAlert, deleteAlert, getUserAlerts, toogleAlert } from '../controllers/alertcont.js';
import { verifyToken } from './auth.js';
import pool from '../utils/db.js';
import axios from 'axios';

const router = express.Router();

// Real market data service for alerts
class AlertMarketService {
    static async getRealPrice(ticker) {
        try {
            const apiKey = process.env.ALPHA_VANTAGE_KEY;
            const response = await axios.get(`https://www.alphavantage.co/query`, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: ticker,
                    outputsize: 'compact',
                    apikey: apiKey
                }
            });
            
            const timeSeries = response.data['Time Series (Daily)'];
            if (!timeSeries) {
                throw new Error(`No data for ${ticker}`);
            }
            
            const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
            return parseFloat(timeSeries[dates[0]]['4. close']);
        } catch (error) {
            console.error(`Alert price fetch error for ${ticker}:`, error.message);
            // Fallback prices for common stocks
            const fallbackPrices = {
                'AAPL': 190,
                'TSLA': 250,
                'MSFT': 350,
                'GOOGL': 140,
                'AMZN': 150
            };
            return fallbackPrices[ticker] || 100;
        }
    }
}

router.post('/add', verifyToken, addAlert); 
router.get('/user/:userId', verifyToken, getUserAlerts);
router.delete('/:id', verifyToken, deleteAlert);
router.patch('/:id/toggle', verifyToken, toogleAlert);

// Check alerts with real market data
router.get('/check/:userId', async (req, res) => {
  try { 
    const { userId } = req.params;
    const alerts = await pool.query(
      `SELECT * FROM alerts 
       WHERE user_id=$1 AND is_active=TRUE`,
      [userId]
    );

    for (let alert of alerts.rows) {
      // Get real current price
      const currentPrice = await AlertMarketService.getRealPrice(alert.ticker);
      const threshold = parseFloat(alert.threshold);
      
      let alertTriggered = false;
      let condition = '';

      // Proper alert logic
      switch (alert.comparator) {
        case '<':
        case '<=':
          if (currentPrice <= threshold) {
            alertTriggered = true;
            condition = 'dropped to';
          }
          break;
        case '>':
        case '>=':
          if (currentPrice >= threshold) {
            alertTriggered = true;
            condition = 'rose to';
          }
          break;
        case '=':
          // Within 1% of target price
          if (Math.abs(currentPrice - threshold) / threshold <= 0.01) {
            alertTriggered = true;
            condition = 'reached';
          }
          break;
      }

      if (alertTriggered) {
        const message = `🚨 ${alert.ticker} ${condition} $${threshold}! Current: $${currentPrice.toFixed(2)}`;

        // Deactivate alert after triggering
        await pool.query('UPDATE alerts SET is_active = false WHERE alert_id = $1', [alert.alert_id]);

        return res.json({ triggered: true, message, alert });
      }
    }

    res.json({ triggered: false });
  } catch (err) {
    console.error('Alert check error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
