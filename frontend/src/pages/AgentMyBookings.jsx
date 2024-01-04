import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardText, CardTitle, Input } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import '../styles/AgentMyBookings.css';
import CommonSection from '../shared/CommonSection';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/config';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [filterPackageTitle, setFilterPackageTitle] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/bookings/getBookingsByAgent/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user]);
    const handleConfirm = async (bookingId) => {
        const isConfirmed = window.confirm('Are you sure you want to Confirm this booking?');

        if (isConfirmed) {
            try {
                const response = await fetch(`${BASE_URL}/bookings/updateBooking/${bookingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.AccessToken}`,
                    },
                    body: JSON.stringify({ status: 'Confirmed' }),
                });

                if (response.ok) {
                    console.log('Booking confirmed successfully');
                    alert('Booking confirmed successfully');
                    fetchBookings();
                } else {
                    console.error('Error confirming booking:', response.message);
                    alert('Error cancelling booking');
                }
            } catch (error) {
                console.error('Error confirming booking:', error);
                alert('Error confirming booking');
            }
        }
    };

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

    const handleFilterPackageTitleChange = (event) => {
        setFilterPackageTitle(event.target.value);
    };

    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleFilterStatusChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredBookings = bookings.filter((booking) => {
        const formattedDepartureDate = new Date(booking.departure_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });



        const filterDateFormatted = new Date(filterDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });


        return (
            booking.package.title.toLowerCase().includes(filterPackageTitle.toLowerCase()) &&
            (filterDate ? formattedDepartureDate.includes(filterDateFormatted) : true) &&
            (filterStatus ? booking.status.toLowerCase().includes(filterStatus.toLowerCase()) : true)
        );
    });




    if (!user) {
        return (
            <Container className="my-bookings-container">
                <Row>
                    <Col>
                        <h3>Please login to view your bookings.</h3>

                    </Col>
                </Row>
            </Container>
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <CommonSection title={'My Bookings'} />
            <Container className="my-bookings-container">
                <Row>
                    <Col md="4">
                        <Input
                            type="text"
                            placeholder="Filter by Package Title"
                            value={filterPackageTitle}
                            onChange={handleFilterPackageTitleChange}
                            className="filter-input"
                        />
                    </Col>
                    <Col md="4">
                        <Input
                            type="date"
                            placeholder="Filter by Departure Date"
                            value={filterDate}
                            onChange={handleFilterDateChange}
                            className="filter-input"
                        />
                    </Col>
                    <Col md="4">
                        <Input
                            type="select"
                            placeholder="Filter by Status"
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            className="filter-input"
                        >
                            <option value="">All Status</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Payment Pending">Payment Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </Input>
                    </Col>
                </Row>
                <Row>
                    {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <Col md="12" key={booking._id}>
                                <Card className="booking-item">
                                    <div>
                                        <CardTitle className="custom-card-title" tag="h2">
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
                                            <strong>User Details:</strong><br />
                                            Name: {booking.user.username}<br />
                                            Phone: {booking.agent.phone}<br />
                                            Email: {booking.agent.email}
                                        </CardText>

                                        <div className="button__container">
                                            <div className="button__stack">
                                                <Button color="green" className="custom-button" onClick={() => handleConfirm(booking._id)}>
                                                    Confirm
                                                </Button>
                                            </div>
                                            <div className="button__stack">
                                                <Button color="danger" className="custom-button" onClick={() => handleCancel(booking._id)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>


                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p>No bookings available</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default MyBookings;