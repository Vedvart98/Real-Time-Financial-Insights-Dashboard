import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockCards.css';

const StockCards = () => {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', company: 'Apple Inc', bgColor: '#000', textColor: '#fff' },
    { symbol: 'NDAQ', company: 'Nasdaq Inc', bgColor: '#e11d48', textColor: '#fff' },
    { symbol: 'TSLA', company: 'Tesla Inc', bgColor: '#8b5cf6', textColor: '#fff' },
    { symbol: 'AMZN', company: 'Amazon Inc', bgColor: '#f59e0b', textColor: '#fff' }
  ]);

  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const promises = stocks.map(stock => 
          axios.get(`http://localhost:3001/api/market/${stock.symbol}`)
        );
        const responses = await Promise.all(promises);
        
        const data = {};
        responses.forEach((response, index) => {
          const symbol = stocks[index].symbol;
          const chartData = response.data;
          if (chartData.length > 0) {
            const latest = chartData[chartData.length - 1];
            const previous = chartData[chartData.length - 2] || latest;
            const change = ((latest.close - previous.close) / previous.close * 100).toFixed(2);
            
            data[symbol] = {
              value: latest.close.toFixed(2),
              change: `${change >= 0 ? '+' : ''}${change}%`,
              positive: change >= 0,
              chartData: chartData.slice(-7)
            };
          }
        });
        
        setStockData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Update every 1 minute
    
    return () => clearInterval(interval);
  }, []);

  const MiniChart = ({ chartData, positive }) => {
    if (!chartData || chartData.length < 2) {
      return (
        <svg width="60" height="30" viewBox="0 0 60 30">
          <path
            d="M0,15 L60,15"
            stroke="#9ca3af"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    }

    const maxPrice = Math.max(...chartData.map(d => d.close));
    const minPrice = Math.min(...chartData.map(d => d.close));
    const priceRange = maxPrice - minPrice || 1;

    const pathData = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * 60;
      const y = 25 - ((point.close - minPrice) / priceRange) * 20;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="30" viewBox="0 0 60 30">
        <path
          d={pathData}
          stroke={positive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  };

  if (loading) {
    return <div className="stock-cards-loading">Loading stock data...</div>;
  }

  return (
    <div className="stock-cards-grid">
      {stocks.map((stock, index) => {
        const data = stockData[stock.symbol] || {};
        return (
          <div key={index} className="stock-card">
            <div className="stock-header">
              <div 
                className="company-badge"
                style={{ backgroundColor: stock.bgColor, color: stock.textColor }}
              >
                {stock.company}
              </div>
              <div className="stock-info">
                <div className="stock-symbol">{stock.symbol}</div>
                <div className={`stock-change ${data.positive ? 'positive' : 'negative'}`}>
                  {data.change || '0.00%'}
                </div>
              </div>
            </div>
            <div className="portfolio-section">
              <div className="portfolio-label">Portfolio</div>
              <div className="portfolio-value">
                ${data.value || '0.00'}
              </div>
            </div>
            <div className="mini-chart">
              <MiniChart chartData={data.chartData} positive={data.positive} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StockCards;
