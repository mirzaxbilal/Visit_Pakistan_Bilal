import React, { useState, useContext } from 'react';
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AuthContext } from './../../context/AuthContext';
import './booking.css';
import Login from '../../pages/Login';
import PaymentForm from './PaymentForm';
import { BASE_URL } from './../../utils/config';
import Img from '../../assets/images/checked.png';

const Booking = ({ packageData }) => {
    const { user } = useContext(AuthContext);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [bookingSuccessful, setBookingSuccessful] = useState(false);
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const [numberOfInfants, setNumberOfInfants] = useState(0);

    const toggleLoginModal = () => {
        setLoginModalOpen(!isLoginModalOpen);
    };

    const handleChange = (e, field) => {
        const value = parseInt(e.target.value, 10) || 0;

        if (field === 'persons') {
            setNumberOfPersons(value);
        } else if (field === 'infants') {
            setNumberOfInfants(value);
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleBooking = async () => {
        if (user) {
            // Check if the selected departure date is after today
            const selectedDate = document.getElementById('bookAt').value;

            if (!selectedDate) {
                alert('Please select a departure date.');
                return;
            }

            const selectedDateObj = new Date(selectedDate);
            const today = new Date();

            selectedDateObj.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDateObj <= today) {
                alert('Departure date must be after today.');
                return;
            }

            const basePrice = packageData.price * numberOfPersons;
            const serviceCharge = 10;
            const totalAmount = basePrice + serviceCharge;

            const bookingData = {
                package_id: packageData._id,
                departure_date: document.getElementById('bookAt').value,
                no_of_persons: numberOfPersons,
                no_of_infants: numberOfInfants,
                price: totalAmount,
            };

            try {
                // Call the API to make the booking
                const response = await fetch(`${BASE_URL}/bookings/createBooking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.AccessToken}`,
                    },
                    body: JSON.stringify(bookingData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error creating booking: ${errorData.message}`);
                    return;
                }

                setBookingSuccessful(true); // Set booking status to true on success

            } catch (error) {
                console.error('Error creating booking:', error);
                alert('Error creating booking. Please try again.');
            }
        } else {
            toggleLoginModal();
        }
    };

    const handleLoginSuccess = () => {
        console.log('Login successful. Continue booking logic here');
        toggleLoginModal();
    };

    const handlePaymentSuccess = () => {
        console.log('Payment successful. Continue booking logic here');
        setBookingSuccessful(true); // Set booking status to true on payment success
    };

    return (
        <div className="booking">
            {bookingSuccessful ? (
                <div className="booking__success-message">
                    <div className="checkmark-container">
                        <img src={Img} alt="Checkmark" className="checkmark-image" />
                    </div>
                    <div className="booking__success-text">
                        <h1 className="text-center custom__heading">Your booking has been placed successfully</h1>
                        <p className="normal-text text-center custom__message">
                            Happy Vacation! You will soon be contacted by the travel agent.
                        </p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="booking__top d-flex align-items-center justify-content-between">
                        <h3>$ {packageData.price}<span>/per person</span></h3>
                    </div>

                    <div className="booking__form">
                        <h5 className='booking__detail__title'>Booking Details</h5>
                        <FormGroup>
                            <label htmlFor="bookAt">Departure Date</label>
                            <input
                                type="date"
                                placeholder=""
                                id="bookAt"
                                required
                                onChange={() => { }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="goupSize">Number of Persons (excluding infants)</label>
                            <input
                                type="number"
                                placeholder="Number of persons"
                                id="groupSize"
                                required
                                onChange={(e) => handleChange(e, 'persons')}
                                value={numberOfPersons}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="Infants">Number of Infants</label>
                            <input
                                type="number"
                                placeholder="Number of infants"
                                id="Infants"
                                required
                                onChange={(e) => handleChange(e, 'infants')}
                                value={numberOfInfants}
                            />
                        </FormGroup>
                    </div>

                    <div className="booking__bottom">
                        <ListGroup>
                            <ListGroupItem className="border-0 px-0">
                                <span>${packageData.price} <i className="ri-close-line"></i> {numberOfPersons} person </span>
                                <span>${packageData.price * numberOfPersons}</span>
                            </ListGroupItem>
                            <ListGroupItem className="border-0 px-0">
                                <span>Service charge</span>
                                <span>$10</span>
                            </ListGroupItem>
                            <ListGroupItem className="border-0 px-0">
                                <span className="total">Total </span>
                                <span className="total">${packageData.price * numberOfPersons + 10}</span>
                            </ListGroupItem>
                        </ListGroup>

                        <Button className="btn primary_btn custom-button w-100 mt-4" onClick={handleBooking}>
                            Book Now
                        </Button>

                        <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal} modalClassName="custom-login-modal">
                            <ModalHeader toggle={toggleLoginModal}>Login Required</ModalHeader>
                            <ModalBody>
                                <Login onLoginSuccess={handleLoginSuccess} />
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
