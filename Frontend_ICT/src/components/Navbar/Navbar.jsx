import React from 'react';
import './Navbar.css'
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';


const Appbar = () => {
  return (
    <nav className=''>
        <img src={logo} alt="" className='logo' />
        <div className='center-text'>
        ICT Academy of Kerala
      </div>
        <ul>
            <Link to={'/'}><li><button className='btn'>Home</button></li></Link>
            <Link to={'/login'}><li><button className='btn'>Login</button></li></Link>
            

            
        </ul>
    </nav>
    
  )
}

export default Appbar