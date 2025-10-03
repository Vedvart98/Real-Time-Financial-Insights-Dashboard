import React, { useEffect, useState } from 'react'
import './Portffolio.css';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
const Portfolio = () => {
  const [assets, setAssets] = useState([]);
  const [ticker,setTicker] = useState('');
  const [quantity,setQuantity] = useState('');
  const [buyprice,setBuyPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  
  useEffect(()=>{
    if (!token) {
      setLoading(false);
      setError('Please log in to view your portfolio');
      return;
    }
    
    axios.get('http://localhost:3001/api/portfolio/',{
      headers:{Authorization:`Bearer ${token}`}
    })
    .then((res)=>{
      setAssets(res.data);
      setLoading(false);
    })
    .catch((err)=> {
      console.log(err);
      setError(err.response?.data?.error || 'Failed to load portfolio');
      setLoading(false);
    });

  },[token]); 

  const addAsset = async()=>{
    if (!ticker || !quantity || !buyprice) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      const newAsset = {
        ticker: ticker.toUpperCase(),
        quantity: parseFloat(quantity),
        buy_price: parseFloat(buyprice)
      };
      const res = await axios.post('http://localhost:3001/api/portfolio/add',newAsset,{
        headers: { Authorization: `Bearer ${token}` },
      })
      setAssets([...assets,res.data]);
      setTicker('');
      setQuantity('');
      setBuyPrice('');
    } catch(err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add asset');
    }
  };
  const deleteAsset = async(p_id)=>{
    try {
      setError('');
      await axios.delete(`http://localhost:3001/api/portfolio/${p_id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(assets.filter((a)=>a.p_id !== p_id));
    } catch(err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete asset');
    }
  };
  if (loading) return <div className='portfolio'><h2>Loading...</h2></div>;
  if (error) return <div className='portfolio'><h2>Error: {error}</h2></div>;
  if (!token) return <div className='portfolio'><h2>Please log in to view your portfolio</h2></div>;

  return (
    <div className='portfolio'>
      <h2>My Portfolio</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <div className="add-asset">
        <input type="text" placeholder='Ticker' value={ticker} onChange={(e)=>setTicker(e.target.value)} />
        <input type="number" placeholder='Quantity' value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
        <input type="number" placeholder='Buy price' value={buyprice} onChange={(e)=>setBuyPrice(e.target.value)} />
        <button onClick={addAsset}>Add Asset</button>
      </div>
      <div className="portfolio-table">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Buy Price</th>
              <th>Quantity</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>P/L</th>
              <th>Allocation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a,index)=>{
                  const allocation = ((a.currentValue / assets.reduce((sum, x) => sum + x.currentValue, 0)) * 100).toFixed(2);
return(

  <tr key={index}>
      <td>{a.ticker}</td>
      <td>{a.buy_price}</td>
      <td>{a.quantity}</td>
      <td>{a.currentPrice?.toFixed(2) || '-'}</td>
      <td>{a.currentValue?.toFixed(2) || '-'}</td>
      <td style={{ color: a.ProfitLoss >= 0 ? 'green' : 'red' }}>
          {a.ProfitLoss?.toFixed(2)}
        </td>
        <td>{allocation}%</td>
      <td><button onClick={() => deleteAsset(a.p_id)}>Delete</button></td>
    </tr>
    )
    })}
          </tbody>
        </table>
      </div>
    </div>
          )
}

export default Portfolio
