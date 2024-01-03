import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import '../styles/Home.css'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Vid from '../assets/videos/home.mp4';
const Home = () => {
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/locations/');
                const data = await response.json();
                if (response.ok) {
                    setLocations(data);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error("Fetching locations failed:", error);
            }
        };

        fetchLocations();
    }, []);
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        swipeToSlide: true, // Enable mouse dragging
        arrows: true, // Enable navigation arrows
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

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
            <Container className="plan-your-trip-section">
                <h2>Plan your trip</h2>
                <Button className="start-planning-btn" onClick={() => navigate('/tours')}>
                    <i className="fas fa-plane"></i>Start Planning
                </Button>
                <Slider {...settings}>
                    {locations.map((location, index) => (
                        <div key={index} className="location-card">
                            <div className="card-content" style={{ backgroundImage: `url(${location.picture})` }}>
                                <h3>{location.name}</h3>
                            </div>
                        </div>
                    ))}
                </Slider>
            </Container>
        </>
    );
};

export default Home;