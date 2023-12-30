import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardText, CardTitle } from 'reactstrap';
import { AuthContext } from './../context/AuthContext';
import '../styles/MyBookings.css';
import CommonSection from '../shared/CommonSection'
import { Link } from 'react-router-dom';
import { BASE_URL } from './../utils/config';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);

    };
    const fetchBookings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
            });
            const data = await response.json();
            setBookings(data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {

        fetchBookings();
    }, [user.id]);

    const handleCancel = async (bookingId) => {

        const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');

        if (isConfirmed) {
            try {

                const response = await fetch(`${BASE_URL}/bookings/updateBooking/${bookingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.AccessToken}`,
                    },
                    body: JSON.stringify({ status: 'Cancelled' }),
                });

                if (response.ok) {

                    console.log('Booking cancelled successfully');

                    alert('Booking cancelled successfully');

                    fetchBookings();
                } else {
                    console.error('Error cancelling booking:', response.message);

                    alert('Error cancelling booking');
                }
            } catch (error) {
                console.error('Error cancelling booking:', error);

                alert('Error cancelling booking');
            }
        }
    };

    return (
        <>
            <CommonSection title={"My Bookings"} />
            <Container className="my-bookings-container">
                <Row>
                    {Array.isArray(bookings) && bookings.length > 0 ? (
                        bookings.map(booking => (
                            <Col md="12" key={booking._id}>

                                <Card className="booking-item">
                                    <div>
                                        <CardTitle className="custom-card-title" tag="h2" >
                                            <Link to={`/tours/${booking.package._id}`}>{booking.package.title}</Link>
                                        </CardTitle>
                                        <hr className="custom-hr" />
                                    </div>
                                    <CardBody className="custom-card-body">
                                        <CardText className="custom-card-text"><strong>No of Persons:</strong><br /> {booking.no_of_persons}</CardText>
                                        <CardText className="custom-card-text"><strong>No of Infants:</strong><br /> {booking.no_of_infants}</CardText>
                                        <CardText className="custom-card-text"><strong>Departure Date:</strong><br /> {formatDate(booking.departure_date)}</CardText>
                                        <CardText className="custom-card-text"><strong>Status:</strong><br /> {booking.status}</CardText>
                                        <CardText className="custom-card-text"><strong>Total Amount:</strong><br /> ${booking.total_price}</CardText>
                                        <CardText className="custom-card-text">
                                            <strong>Agent Details:</strong><br />
                                            Name: {booking.agent.name}<br />
                                            Phone: {booking.agent.phone}<br />
                                            Email: {booking.agent.email}
                                        </CardText>
                                        <Button color="danger" className="custom-button" onClick={() => handleCancel(booking._id)}>Cancel</Button>
                                    </CardBody>
                                </Card>
                            </Col >
                        ))
                    ) : (
                        <Col>
                            <p>No bookings available</p>
                        </Col>
                    )}
                </Row >
            </Container >
        </>
    );

};

export default MyBookings;
