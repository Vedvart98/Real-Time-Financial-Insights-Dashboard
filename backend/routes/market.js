import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/:symbol',async(req,res)=>{
    try {
        const {symbol} = req.params;
       
        const apiKey = process.env.ALPHA_VANTAGE_KEY;
        const response = await axios.get(`https://www.alphavantage.co/query`,{
            params:{
                function: 'TIME SERIES DAILY',
                symbol: symbol,
                outputsize: 'compact',
                apikey: apiKey,
                
            }
        });
        const data = response.data['Time Series (Daily)'];
    if (!data) return res.status(400).json({ error: "Invalid symbol or API limit" });

    // Convert into chart-friendly format
    const chartData = Object.keys(data).slice(0, 7).map(date => ({
      date,
      close: parseFloat(data[date]['4. close'])
    })).reverse();
 
    res.json(chartData);
    } catch (err) {
        console.error(err);
    res.status(500).json({ error: err.message });
    }
});
// Add this route for real-time quotes
router.get('/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const apiKey = process.env.ALPHA_VANTAGE_KEY;
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: apiKey
            }
        });
        
        const quote = response.data['Global Quote'];
        if (!quote) return res.status(400).json({ error: "Invalid symbol" });
    
    res.json({
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'].replace('%', '')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
}
});

export default router;