import React, { useState, useContext } from 'react';
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AuthContext } from './../../context/AuthContext';
import './booking.css';
import Login from '../../pages/Login';

const Booking = ({ packageData }) => {
    const { user } = useContext(AuthContext);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [numberOfPersons, setNumberOfPersons] = useState(1);

    const toggleLoginModal = () => {
        setLoginModalOpen(!isLoginModalOpen);
    };

    const handleChange = (e) => {

        setNumberOfPersons(parseInt(e.target.value, 10) || 1);
    };

    const handleBooking = () => {
        if (user) {

            const basePrice = packageData.price * numberOfPersons;
            const serviceCharge = 10;
            const totalAmount = basePrice + serviceCharge;

            console.log('Booking logic here');
            console.log('Number of Persons:', numberOfPersons);
            console.log('Base Price:', basePrice);
            console.log('Service Charge:', serviceCharge);
            console.log('Total Amount:', totalAmount);
        } else {

            toggleLoginModal();
        }
    };

    const handleLoginSuccess = () => {

        console.log('Login successful. Continue booking logic here');

        toggleLoginModal();
    };

    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>$ {packageData.price}<span>/per person</span></h3>
            </div>

            <div className="booking__form">
                <h5>Booking Details</h5>
                <FormGroup>
                    <input
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        required
                        onChange={() => { }}
                    />
                </FormGroup>
                <FormGroup>
                    <input
                        type="number"
                        placeholder="Phone"
                        id="phone"
                        required
                        onChange={() => { }}
                    />
                </FormGroup>
                <FormGroup className="d-flex align-items-center gap-3">
                    <input
                        type="date"
                        placeholder=""
                        id="bookAt"
                        required
                        onChange={() => { }}
                    />
                    <input
                        type="number"
                        placeholder="Number of persons"
                        id="groupSize"
                        required
                        onChange={handleChange}
                        value={numberOfPersons}
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
    );
};

export default Booking;
