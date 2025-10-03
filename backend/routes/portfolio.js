import express from 'express';
import { addAsset, deleteAsset, getAllPortfolios, getPortfolio } from '../controllers/portfoliocont.js';
import { verifyToken } from './auth.js';
const router = express.Router();

router.post('/add',verifyToken,addAsset);
// router.get('/',verifyToken,getAllPortfolios);
router.get('/',verifyToken,getPortfolio); 
router.delete('/:p_id',verifyToken,deleteAsset);
export default router;