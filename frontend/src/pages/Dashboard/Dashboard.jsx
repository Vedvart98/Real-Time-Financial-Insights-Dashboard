import React from 'react';
import Chart from '../../components/Chart/Chart';
import Insghts from '../../components/Insights/Insghts';
import StockCards from '../../components/StockCards/StockCards';
import Portfolio from '../Portfolio/Portfolio';
import './Dashboard.css'

const Dashboard = () => {

  return (
    <div className='dashboard'>
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Financial Dashboard</h1>
          <p>Real-time market insights and portfolio tracking</p>
        </div>
      </div>
      <div className="section">
        <StockCards/>
      </div>
      <div className="main-grid">
        <div className="left-column">
          <div className="card chart-card">
            <Chart/>
          </div>
          
          <div className="card portfolio-card">
            <Portfolio/>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="card insights-card">
            <Insghts/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;