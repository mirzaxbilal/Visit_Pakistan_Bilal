import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import '../styles/Home.css'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Vid from '../assets/videos/home.mp4';
import Img from '../assets/images/plan.jpg';

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

    const redirectToLocation = (locationId) => {
        navigate(`/location/${locationId}`);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        swipeToSlide: true,
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
            <Container>
                <h2 className="plan-your-trip-section">Explore the Untouched Beauty of Pakistan</h2>
                <Slider {...settings}>
                    {locations.map((location, index) => (
                        <Col md="4" key={index} className="location-card" onClick={() => redirectToLocation(location._id)}>
                            <div className="card-content" style={{ backgroundImage: `url(${location.picture})` }}>
                                <h3 className="location-name">{location.name}</h3>
                                <h3 className="location-title">{location.title}</h3>
                            </div>
                        </Col>
                    ))}
                </Slider>
            </Container>
            <Container>
                <div className="new-section">
                    <div className="text-and-button">
                        <h2>Explore Pakistan with us.</h2>
                        <p>Discover the hidden gems of Pakistan, where ancient traditions meet
                            breathtaking landscapes. Embark on a journey filled with vibrant culture,
                            majestic mountains, and warm hospitality that stays with you forever.</p>
                        <Button className="start-planning-btn" onClick={() => navigate('/tours')}>
                            <i className="fas fa-plane"></i> Plan Your Trip!
                        </Button>
                    </div>
                    <div className="section-image">
                        <img src={Img} alt="Scenic view of Pakistan" />
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Home;