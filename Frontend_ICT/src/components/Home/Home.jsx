import React from 'react'
import './Home.css'
import Navbar from '../Navbar/Navbar'

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className='home'>
     <div className="home-text">
        <h1>Build Your Career With ICTAK</h1>
        <p>ICT Academy of Kerala provides the best quality education to upskill the youths across the state in various sectors.Join our courses and build your future!</p>
        <button className='btn'>Explore more</button>
     </div>
    </div>
    </>
  )
}

export default Home
