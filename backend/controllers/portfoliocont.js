import pool from '../utils/db.js';
import axios from 'axios';
export const addAsset = async(req,res)=>{
    try{
        const {ticker,quantity,buy_price} = req.body;
        const userId = req.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        
        if (!ticker || !quantity || !buy_price) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const result = await pool.query(
            `INSERT INTO portfolio(user_id,ticker,quantity,buy_price) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId,ticker.toUpperCase(),quantity,buy_price]
        );

        const asset = result.rows[0];
        try {
            const response = await axios.get(`http://localhost:3001/api/market/quote/${asset.ticker}`); 
            const currentPrice = response.data.price;
            const ProfitLoss = (currentPrice - asset.buy_price) * asset.quantity;
            const currentValue = currentPrice * asset.quantity;
            res.json({
                ...asset,
                currentPrice,
                currentValue,
                ProfitLoss
            });
        } catch (marketErr) {
            console.error(`Failed to get market data for ${asset.ticker}:`, marketErr.message);
            res.json({
                ...asset,
                currentPrice: null,
                currentValue: null,
                ProfitLoss: null
            });
        }
    }catch(err){
        console.error('Add asset error:', err);
        res.status(500).json({error:err.message});
    }
};
export const getAllPortfolios = async (req,res)=>{
    try {
        const result = await pool.query("SELECT * FROM portfolio");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error:err.message});  
    }
}
export const getPortfolio = async (req,res)=>{
    try{
        const userId = req.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const result = await pool.query(
            "SELECT * FROM portfolio WHERE user_id = $1",
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.json([]);
        }
        
        const assets = await Promise.all(result.rows.map(async(asset)=>{
            try {
                const response = await axios.get(`http://localhost:3001/api/market/quote/${asset.ticker}`);
                const currentPrice = response.data.price;
                const ProfitLoss = (currentPrice-asset.buy_price)*asset.quantity;
                const currentValue = currentPrice*asset.quantity;
                return{
                    ...asset,
                    currentPrice,
                    currentValue,
                    ProfitLoss
                };
            } catch (marketErr) {
                console.error(`Failed to get market data for ${asset.ticker}:`, marketErr.message);
                return {
                    ...asset,
                    currentPrice: null,
                    currentValue: null,
                    ProfitLoss: null
                };
            }
        }));
        res.json(assets)
    }catch(err){
        console.error('Portfolio fetch error:', err);
        res.status(500).json({error:err.message});
    }
};
 export const deleteAsset = async(req,res)=>{
    try{
        const {p_id} = req.params; 
        await pool.query("DELETE FROM portfolio WHERE p_id=$1",[p_id]);
        res.json({message:'Asset deleted successfully'});
    }catch(err){
        res.status(500).json({error:err.message});
    }
 };