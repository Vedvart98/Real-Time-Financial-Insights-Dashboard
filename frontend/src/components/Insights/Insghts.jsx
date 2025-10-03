import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Insights.css'

const API_BASE_URL = 'http://localhost:3001/api/insights';

const Insghts = () => {
     const [insights,setInsights] = useState(null);
     const [loading,setLoading] = useState(true);
     const { user, token } = useContext(AuthContext);
     
  useEffect(()=>{
   const fetchInsights = async ()=>{
    if (!user || !token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
   };
   fetchInsights();
  }, [user, token]);
  
  if(loading) return <p>Loading insights...</p>;
  if(!user) return <p>Please log in to view insights</p>;
  if(!insights) return <p>No insights available</p>;

  return (
    <div className='insights-container'>
       <h2>Market Insights & Predictions</h2>
      <p>{insights.insightMessage}</p>

      <h3>Your Portfolio Predictions</h3>
      {insights.predictions && insights.predictions.length > 0 ? (
        <div className='predictions-grid'>
          {insights.predictions.map((prediction) => (
            <div key={prediction.ticker} className={`prediction-card ${prediction.trend}`}>
              <div className='prediction-header'>
                <h4>{prediction.ticker}</h4>
                <span className={`trend-badge ${prediction.trend}`}>
                  {prediction.trend.toUpperCase()}
                </span>
              </div>
              
              <div className='prediction-details'>
                <div className='price-info'>
                  <span className='current-price'>Current: ${prediction.currentPrice}</span>
                  <span className='predicted-price'>Predicted: ${prediction.predictedPrice}</span>
                </div>
                
                <div className='trend-info'>
                  <div className='weekly-trend'>
                    <span className='trend-label'>7-Day Real:</span>
                    <span className={`trend-value ${parseFloat(prediction.weeklyTrend || 0) >= 0 ? 'positive' : 'negative'}`}>
                      {parseFloat(prediction.weeklyTrend || 0) >= 0 ? '+' : ''}{prediction.weeklyTrend || '0.00'}%
                    </span>
                  </div>
                  <div className='forecast-change'>
                    <span className='trend-label'>Forecast:</span>
                    <span className={`trend-value ${parseFloat(prediction.priceChange) >= 0 ? 'positive' : 'negative'}`}>
                      {parseFloat(prediction.priceChange) >= 0 ? '+' : ''}{prediction.priceChange}%
                    </span>
                  </div>
                  <span className='timeframe'>{prediction.timeframe}</span>
                </div>
                
                <div className='confidence'>
                  <span>Confidence: {prediction.confidence}%</span>
                  <div className='confidence-bar'>
                    <div 
                      className='confidence-fill' 
                      style={{width: `${prediction.confidence}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Add assets to your portfolio to see predictions</p>
      )}

      <h3>Current Market Data</h3>
      <ul className='market-list'>
        {Object.entries(insights.marketData).map(([ticker, price])=>(
          <li key={ticker}>
            <span>{ticker}</span>
            <span>${price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h3>Portfolio Summary</h3>
      <div className='total-investment'>
        <p>Total Investment: ${insights.totalInsights}</p>
      </div>
    </div>
  )
};

export default Insghts;
