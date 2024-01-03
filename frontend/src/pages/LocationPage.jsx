import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import '../styles/LocationPage.css';

const LocationPage = () => {
    const [locationData, setLocationData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/locations/${id}`);
                const data = await response.json();
                if (response.ok) {

                    data.description = data.description.split('\n');
                    setLocationData(data);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error("Fetching location data failed:", error);
            }
        };

        fetchLocationData();
    }, [id]);

    if (!locationData) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="location-page">
            <Row className="location-header">
                <Col className="img__col">
                    <img src={locationData.picture} alt={locationData.name} className="img-fluid location-main-image" />
                    <h1 className="location-name-overlay">{locationData.name}</h1>
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
                </Col>
            </Row>
        </Container>
    );
};

export default LocationPage;
