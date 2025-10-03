import React, { useContext, useState } from 'react'
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
const Navbar = () => {
  const navigate = useNavigate();
  const {logout, user, isAuthenticated, loading} = useContext(AuthContext);
    const [dropdown,setDropdown] = useState(false);
    const handleDropdown = ()=>{
        setDropdown(prev  => !prev);
    }
    const handleLogout=async()=>{
      try {
        await logout();
        setDropdown(false);
        navigate('/login');
      } catch (err) {
       console.log(err);
      }
    }
  return (
    <div className='navbar'>
    <div className="links">
        <Link to='/'>Dashboard</Link>
        <Link to='/portfolio'>Portfolio</Link>
        <Link to='/alerts'>Alerts</Link>
      <Link to='/markets'>Markets</Link>
    </div>
    <div className='authenticate'>
      {loading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <div className="user">
        <button onClick={handleDropdown}>
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M17.5 9c0 1.14-.3 1.99-.79 2.54-.46.52-1.27.96-2.71.96s-2.25-.44-2.71-.96A3.74 3.74 0 0 1 10.5 9c0-1.14.3-1.99.79-2.54.46-.52 1.27-.96 2.71-.96s2.25.44 2.71.96c.5.55.79 1.4.79 2.54zM19 9c0 2.76-1.45 5-5 5s-5-2.24-5-5 1.45-5 5-5 5 2.24 5 5zm-8 8.5h6c2.04 0 3.1.5 3.76 1.1.69.63 1.11 1.55 1.5 2.8.13.42.04.95-.29 1.4-.33.46-.8.7-1.22.7H7.25c-.43 0-.89-.24-1.22-.7a1.61 1.61 0 0 1-.3-1.4 6.08 6.08 0 0 1 1.51-2.8c.65-.6 1.72-1.1 3.76-1.1zm6-1.5h-6c-4.6 0-5.88 2.33-6.7 4.96-.58 1.89.97 4.04 2.95 4.04h13.5c1.98 0 3.53-2.15 2.95-4.04C22.88 18.33 21.6 16 17 16z" fill="currentColor"></path></svg>
        </button>
        {dropdown && (
          <div className='dropdown-menu'>
              <Link to='/profile'>Profile</Link>
                <p onClick={handleLogout}>Logout</p>
            </div>
        )}
    </div>
      ):(
        <div className="login">
        <button><Link to='/login'>Login</Link></button>
      </div>
      )}
    </div>
    </div>
  )
}

export default Navbar
