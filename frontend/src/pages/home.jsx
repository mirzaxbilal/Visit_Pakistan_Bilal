import React from 'react'
import '../styles/Home.css'
import Vid from '../assets/videos/home.mp4';
const home = () => {
    return (
        <>
            <video autoPlay loop muted className="background-video">
                <source src={Vid} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="home-video-container">
                <div className="content">
                    <h1>Find your pace in Pakistan</h1>
                    <p>Where endless sunshine meets vibrant culture, enriching experiences and limitless adventure.</p>
                </div>
            </div>
        </>
    );
};

export default home;