import React, { useEffect, useState } from 'react';
import '../styles/package-details.css';
import { Container, Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { BASE_URL } from './../utils/config';
import Booking from '../components/Booking/booking'
import { loadStripe } from '@stripe/stripe-js';


const PackageDetails = () => {
    const { id } = useParams();
    const [packageData, setPackage] = useState([]);
    console.log("id", id);
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/packages/${id}`, {
                    method: 'GET',
                });
                const data = await response.json();

                console.log("data", data);
                setPackage(data);
            } catch (error) {
                console.error('Error fetching package:', error);
            }
        };

        fetchPackages();
    }, [id]);

    const renderTourItinerary = () => {
        if (!packageData.tourItinerary) {
            return null;
        }

        const itineraryLines = packageData.tourItinerary.split('\n');

        return itineraryLines.map((line, index) => (
            <p key={index}>{line}</p>
        ));
    };

    return (


        <section>
            <Container>
                <Row>
                    <Col lg="8">
                        <div className='tour__content'>
                            <img src={packageData.images && packageData.images[0]} alt="Tour_Img" />
                            <div className="tour__info">
                                <h2>
                                    {packageData.title}
                                </h2>

                                <div className="tour__extra-details">
                                    {packageData.locations && packageData.locations.map((location, index) => (
                                        <span key={index}>
                                            <i className="ri-map-pin-line"></i> {location.name}
                                        </span>
                                    ))}
                                    <span >
                                        <i className="ri-money-dollar-circle-line"></i> ${packageData.price}
                                    </span>
                                    <span >
                                        <i class="ri-calendar-2-line"></i> {packageData.duration} days
                                    </span>

                                </div>

                                <h5>Package Overview</h5>
                                <p>{packageData.overview}</p>

                                <h5>What's Included</h5>
                                <p>{packageData.whatsIncluded}</p>

                                <h5>Tour Itinerary</h5>
                                {renderTourItinerary()}
                            </div>
                            <br />
                            <div className="tour__info">
                                <h5>Travel Agent Details</h5>
                                <span><i class="ri-store-line"></i><b> Agency Name:</b> {packageData.agentId?.name}</span>
                                <span><i class="ri-phone-line"></i><b>Phone:</b> {packageData.agentId?.phone}</span>
                                <span><i class="ri-mail-line"></i><b> Email:</b> {packageData.agentId?.email}</span>

                            </div>
                        </div>
                    </Col>
                    <Col lg='4'>
                        <Booking packageData={packageData} />
                    </Col>
                </Row>
            </Container>
        </section>


    );
};

export default PackageDetails;
