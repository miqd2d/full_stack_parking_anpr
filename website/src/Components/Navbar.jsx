import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Navbar_style.css'
import {Power, House,ChartSpline,BookUser } from 'lucide-react';

function Navbar() {
  const handleLogout = () => {
    // Clear the username and token from local storage
    localStorage.removeItem('username1');
    localStorage.removeItem('token'); // Replace 'token' with the actual key used for your token
    navigate('/'); // Redirect to the home page
};

  return (
    <div>
      <div className="mainbox">
      <div className="Logout">
                    <Link to='/' onClick={handleLogout}> 
                        <Power color='#192247' /> 
                        <div>LOGOUT</div>
                    </Link>
                </div>
        <div className="Home">
            <Link to='/admin'> <House color='#192247'/> <div>HOME</div></Link>
            
        </div>
        <div className="Stats">
            <Link to='/stat'> <ChartSpline color='#192247'/> <div>STATS</div> </Link>
            
        </div>
        <div className="UserInfo">
            <Link to='/userdetails'> <BookUser color='#192247'/> <div>USERS</div></Link>
            

        </div>
      </div>
    </div>
  )
}

export default Navbar
