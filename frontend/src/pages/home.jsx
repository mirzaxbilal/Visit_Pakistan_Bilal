import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Col, Button } from 'reactstrap';
import '../styles/Home.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Vid from '../assets/videos/home.mp4';
const Home = () => {
    const [locations, setLocations] = useState([]);
    const [homePageContent, setHomePageContent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch homepage content
                const homeResponse = await fetch('http://localhost:5000/homepage/');
                const homeData = await homeResponse.json();
                if (homeResponse.ok) {
                    setHomePageContent(homeData);
                } else {
                    throw new Error(homeData.message);
                }

                // Fetch locations
                const locationsResponse = await fetch('http://localhost:5000/locations/');
                const locationsData = await locationsResponse.json();
                if (locationsResponse.ok) {
                    setLocations(locationsData);
                } else {
                    throw new Error(locationsData.message);
                }
            } catch (error) {
                console.error('Fetching data failed:', error);
            }
        };

        fetchData();
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
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            <video autoPlay loop muted className="background-video">
                <source src={Vid} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="home-video-container">
                <div className="content">
                    <h1>{homePageContent.WelcomeHeading}</h1>
                    <p>{homePageContent.WelcomeTagline}</p>
                </div>
            </div>
            <Container>
                <h2 className="plan-your-trip-section">{homePageContent.LocationsHeading}</h2>
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
                        <h2>{homePageContent.PlanTripHeading}</h2>
                        <p>{homePageContent.PlanTripDescripton}</p>
                        <Button className="start-planning-btn" onClick={() => navigate('/tours')}>
                            <i className="fas fa-plane"></i> {homePageContent.PlanTripButton}
                        </Button>
                    </div>
                    <div className="section-image">
                        <img src={homePageContent.PlanTripImage} alt="Scenic view of Pakistan" />
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Home;
