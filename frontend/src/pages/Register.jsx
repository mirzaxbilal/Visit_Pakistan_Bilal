import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Tooltip } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });

    const [tooltips, setTooltips] = useState({
        username: false,
        email: false,
        password: false,
        phone: false
    });

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.id]: '' }));
        setTooltips(prev => ({ ...prev, [e.target.id]: false }));
    };

    const handleTooltipToggle = field => {
        setTooltips(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleClick = async e => {
        e.preventDefault();

        // Validate input fields
        let newErrors = {};

        // Validate username
        if (!credentials.username || credentials.username.length < 6 || credentials.username.length > 30 || !/^[a-zA-Z\s]+$/.test(credentials.username)) {
            newErrors.username = 'Please enter a valid full name (alphabetic characters only, between 6 and 30 characters).';
            setTooltips(prev => ({ ...prev, username: true }));
        }

        // Validate email
        if (!credentials.email || !/\S+@\S+\.\S+/.test(credentials.email)) {
            newErrors.email = 'Please enter a valid email address.';
            setTooltips(prev => ({ ...prev, email: true }));
        }

        // Validate password
        if (!credentials.password || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(credentials.password) || credentials.password.length < 8) {
            newErrors.password = 'Please enter a valid password (at least 8 characters, with at least one lowercase letter, one uppercase letter, one digit, and one special character).';
            setTooltips(prev => ({ ...prev, password: true }));
        }

        // Validate phone number
        if (!credentials.phone || !/^\d{11}$/.test(credentials.phone)) {
            newErrors.phone = 'Please enter a valid phone number (exactly 11 digits).';
            setTooltips(prev => ({ ...prev, phone: true }));
        }

        // If there are errors, set the state with the new error messages
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {

                const res = await fetch(`${BASE_URL}/users/signup`, {
                    method: 'post',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                });

                const result = await res.json();

                if (!res.ok) alert(result.message);
                dispatch({ type: 'REGISTER_SUCCESS' });

                navigate('/login');
            } catch (err) {
                alert(err.message)
            };
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className="m-auto">
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={registerImg} alt="" />
                            </div>
                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>
                                <h2>Register</h2>
                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input
                                            type="text"
                                            placeholder="Your Full Name"
                                            required
                                            id="username"
                                            onChange={handleChange}
                                            value={credentials.username}
                                        />
                                        <Tooltip isOpen={tooltips.username} target="username" toggle={() => handleTooltipToggle('username')}>
                                            {errors.username}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            id="email"
                                            onChange={handleChange}
                                            value={credentials.email}
                                        />
                                        <Tooltip isOpen={tooltips.email} target="email" toggle={() => handleTooltipToggle('email')}>
                                            {errors.email}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            required
                                            id="phone"
                                            onChange={handleChange}
                                            value={credentials.phone}
                                        />
                                        <Tooltip isOpen={tooltips.phone} target="phone" toggle={() => handleTooltipToggle('phone')}>
                                            {errors.phone}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            id="password"
                                            onChange={handleChange}
                                            value={credentials.password}
                                        />
                                        <Tooltip isOpen={tooltips.password} target="password" toggle={() => handleTooltipToggle('password')}>
                                            {errors.password}
                                        </Tooltip>
                                    </FormGroup>
                                    <Button className="btn secondary__btn auth__btn" type="submit">
                                        Create Account
                                    </Button>
                                    <p>
                                        Already have an account?<Link to='/login'>Login</Link>
                                    </p>
                                    <p>
                                        <Link to='/AgentRegister'>Register as a Travel Agent</Link>
                                    </p>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Register;
