import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import setupPassport from './controllers/authPassport.js';
dotenv.config(); 
//middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
setupPassport();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

import alertRoutes from './routes/alerts.js';
import portfolioRoutes from './routes/portfolio.js';
import queryRoutes from './routes/query.js';
import insightRoutes from './routes/insights.js';
import authRoutes from './routes/auth.js';
import marketRoutes from './routes/market.js'
import oauthRoutes from './routes/oauth.js';

//routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

app.use('/api/alerts',alertRoutes);
app.use('/api/portfolio',portfolioRoutes);
app.use('/api/query',queryRoutes); 
app.use('/api/insights',insightRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/market',marketRoutes);
app.use('/auth',oauthRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{ 
    console.log(`server is running on port http://localhost:${PORT}`); 
})