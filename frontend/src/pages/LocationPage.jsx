import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/LocationPage.css';
import TourCard from './../shared/TourCard';


const LocationPage = () => {
    const [locationData, setLocationData] = useState(null);
    const [tourData, setTourData] = useState([]);
    const { id } = useParams();

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch location data
                const locationResponse = await fetch(`http://localhost:5000/locations/${id}`);
                const locationData = await locationResponse.json();
                if (locationResponse.ok) {
                    locationData.description = locationData.description.split('\n');
                    setLocationData(locationData);
                } else {
                    throw new Error(locationData.message);
                }

                // Fetch tour data for the specific location
                const tourResponse = await fetch(`http://localhost:5000/packages/getPackageByLocation?location=${id}`);
                const tourData = await tourResponse.json();
                console.log("tour data", tourData);
                if (tourResponse.ok) {
                    setTourData(tourData);
                } else {
                    throw new Error(tourData.message);
                }
            } catch (error) {
                console.error("Fetching data failed:", error);
            }
        };

        fetchData();
    }, [id]);

    if (!locationData || tourData === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="location-page">
            <Row className="location-header">
                <Col className="img__col">
                    <img src={locationData.picture} alt={locationData.name} className="img-fluid location-main-image" />
                    <h1 className="location-name-overlay">{locationData.title}</h1>
                </Col>
            </Row>
            <Row className="location-content">
                <Col>
                    <h1 className="text-left">{locationData.name}</h1>
                    {locationData.description.map((paragraph, index) => (
                        <p key={index} className='custom__description'>{paragraph}</p>
                    ))}
                    <h3 className="mt-4">Tourist attractions in {locationData.name}</h3>
                    {locationData.attractions.map((attraction, index) => (
                        <Row key={index} className={`attraction-row ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                            <Col md="6" className="attraction-image">
                                <img src={attraction.picture} alt={attraction.name} className="img-fluid rounded-corners" />
                            </Col>
                            <Col md="6" className="attraction-info">
                                <h4 className='attraction__heading'>{attraction.name}</h4>
                                <p className='custom__attraction_description'>{attraction.description}</p>
                            </Col>
                        </Row>
                    ))}
                    <h3 className="mt-4">Tour Packages in {locationData.name}</h3>

                    {tourData && tourData.length > 0 ? (
                        <Slider {...settings}>
                            {tourData.map((tour, index) => (
                                <div key={index}>
                                    <TourCard tour={tour} />
                                </div>
                            ))}
                        </Slider>

                    ) : (
                        <p>No tour packages available for this location.</p>
                    )}

                </Col>
            </Row>
        </Container>
    );
};

export default LocationPage;
