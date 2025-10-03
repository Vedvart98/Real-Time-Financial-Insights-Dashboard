import pool from "../utils/db.js";

//POST /api/alerts/add
export const addAlert = async(req,res)=>{
try{
const {userId, ticker,comparator,threshold,notification_type = 'in-app'} = req.body;
if(!userId || !ticker || !comparator || !threshold){
    return res.status(400).json({error:'Missing required fields'});
}
const result = await pool.query(
    `INSERT INTO alerts (user_id, ticker, comparator, threshold, notification_type) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, ticker.toUpperCase(), comparator, threshold, notification_type]
);
res.json({alert:result.rows[0]});
}catch(err){
    console.error('addAlert error',err);
    res.status(500).json({error:err.message});
}
};
// GET /api/alerts/user/:userId
export const getUserAlerts = async(req,res)=>{
try {
    const {userId} = req.params;
    const result = await pool.query(
        'SELECT * FROM alerts WHERE user_id =$1 ORDER BY created_at DESC',[userId]
    );
    res.json({alerts:result.rows})
} catch (err) {
     console.error("getAlertsByUser error:", err);
    res.status(500).json({ error: err.message });
}
}; 
//DELETE /api/alerts/:id
export const deleteAlert = async(req,res)=>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM alerts WHERE alert_id = $1',[id]);
        res.json({message:'Alert deleted successfully'});
    } catch (err) {
        console.error("deleteAlert error:", err);
    res.status(500).json({ error: err.message });
    }
};
// PATCH /api/alerts/:id/toggle
export const toogleAlert = async(req,res)=>{
    try {
        const {id} = req.params;
    const result = await pool.query(
        `UPDATE alerts SET is_active = NOT is_active WHERE alert_id = $1 RETURNING *`,[id]
    );
    res.json({alert: result.rows[0]});
    } catch (err) {
        console.error("toggleAlert error:", err);
    res.status(500).json({ error: err.message });
    }
}; 

