import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Chart.css';

const Chart = ({ symbol = 'SPY' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(0);
  const [changePercent, setChangePercent] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/market/${symbol}`);
        const chartData = response.data;
        
        if (chartData.length > 0) {
          const latest = chartData[chartData.length - 1];
          const first = chartData[0];
          const change = ((latest.close - first.close) / first.close * 100);
          
          setCurrentValue(latest.close);
          setChangePercent(change);
          setData(chartData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [symbol]);

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  return (
    <div className="main-chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>Stock Watchlists</h3>
        </div>
        
        <div className="chart-info">
          <div className="chart-symbol">{symbol}</div>
          <div className="chart-value">{formatValue(currentValue)}</div>
          <div className={`chart-change ${changePercent >= 0 ? 'positive' : 'negative'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
        
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone"
              dataKey="close"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
