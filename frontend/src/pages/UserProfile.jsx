
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Tooltip, Label } from 'reactstrap';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import userIcon from '../assets/images/user.png';
import registerImg from '../assets/images/profilepic.png';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
    });

    const [tooltips, setTooltips] = useState({
        username: false,
        email: false,
        password: false,
        phone: false,
    });

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.id]: '' }));
        setTooltips((prev) => ({ ...prev, [e.target.id]: false }));
    };

    const handleTooltipToggle = (field) => {
        setTooltips((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile?')) {
            try {
                const res = await fetch(`${BASE_URL}/users/deleteprofile/${user.id}`, {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${user.AccessToken}`,
                    },
                    credentials: 'same-origin',
                });

                const result = await res.json();

                if (!res.ok) {
                    alert(result.message);
                } else {
                    dispatch({
                        type: 'LOGOUT',
                    });
                    alert('Profile deleted successfully.');
                    navigate('/login');
                }
            } catch (error) {
                console.error(error.message);
                alert('An error occurred while deleting the profile.');
            }
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();


        const nonEmptyCredentials = Object.fromEntries(
            Object.entries(credentials).filter(([key, value]) => value.trim() !== '')
        );

        let newErrors = {};


        if (
            nonEmptyCredentials.username &&
            (nonEmptyCredentials.username.length < 6 ||
                nonEmptyCredentials.username.length > 30 ||
                !/^[a-zA-Z\s]+$/.test(nonEmptyCredentials.username))
        ) {
            newErrors.username =
                'Please enter a valid full name (alphabetic characters only, between 6 and 30 characters).';
            setTooltips((prev) => ({ ...prev, username: true }));
        }


        if (nonEmptyCredentials.email && !/\S+@\S+\.\S+/.test(nonEmptyCredentials.email)) {
            newErrors.email = 'Please enter a valid email address.';
            setTooltips((prev) => ({ ...prev, email: true }));
        }


        if (
            nonEmptyCredentials.password &&
            (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(nonEmptyCredentials.password) ||
                nonEmptyCredentials.password.length < 8)
        ) {
            newErrors.password =
                'Please enter a valid password (at least 8 characters, with at least one lowercase letter, one uppercase letter, one digit, and one special character).';
            setTooltips((prev) => ({ ...prev, password: true }));
        }

        if (nonEmptyCredentials.phone && !/^\d{11}$/.test(nonEmptyCredentials.phone)) {
            newErrors.phone = 'Please enter a valid phone number (exactly 11 digits).';
            setTooltips((prev) => ({ ...prev, phone: true }));
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                const res = await fetch(`${BASE_URL}/users/updateprofile/${user.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${user.AccessToken}`,
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(nonEmptyCredentials),
                });

                const result = await res.json();

                if (!res.ok) {
                    alert(result.message);
                } else {
                    // Update the local state with the new profile data
                    // setProfileData({ ...result, name: result.username });

                    // dispatch({
                    //     type: 'PROFILE_UPDATE_SUCCESS',
                    //     payload: result.existingUser,
                    // });

                    alert('Profile updated successfully.');
                }
            } catch (err) {
                alert(err.message);
            }
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const profileEndpoint = `${BASE_URL}/users/${user.id}`;

                    const res = await fetch(profileEndpoint, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${user.AccessToken}`,
                        },
                        credentials: 'same-origin',
                    });

                    const result = await res.json();

                    if (!res.ok) {
                        alert(result.message);
                        console.error('something went wrong');
                    } else {
                        const profileName = result.username;
                        setProfileData({ ...result, name: profileName });
                        setUpdateStatus(!updateStatus);
                    }
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        fetchProfile();
    }, [user, updateStatus]);

    return (
        <Container>
            <Row>
                <Col>
                    {user ? (
                        profileData ? (
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
                                                    <h2>My Profile</h2>
                                                    <Form onSubmit={handleClick}>
                                                        <FormGroup>
                                                            <Label for="username">Name: </Label>
                                                            <input
                                                                type="text"
                                                                placeholder={profileData.name}
                                                                id="username"
                                                                onChange={handleChange}
                                                                value={credentials.username}
                                                            />
                                                            <Tooltip isOpen={tooltips.username} target="username" toggle={() => handleTooltipToggle('username')}>
                                                                {errors.username}
                                                            </Tooltip>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="email">Email: </Label>
                                                            <input
                                                                type="email"
                                                                placeholder={profileData.email}
                                                                id="email"
                                                                onChange={handleChange}
                                                                value={credentials.email}
                                                            />
                                                            <Tooltip isOpen={tooltips.email} target="email" toggle={() => handleTooltipToggle('email')}>
                                                                {errors.email}
                                                            </Tooltip>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="phone">Phone: </Label>
                                                            <input
                                                                type="tel"
                                                                placeholder={profileData.phone}
                                                                id="phone"
                                                                onChange={handleChange}
                                                                value={credentials.phone}
                                                            />
                                                            <Tooltip isOpen={tooltips.phone} target="phone" toggle={() => handleTooltipToggle('phone')}>
                                                                {errors.phone}
                                                            </Tooltip>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="password">New Password: </Label>
                                                            <input
                                                                type="password"
                                                                placeholder="Enter new password."
                                                                id="password"
                                                                onChange={handleChange}
                                                                value={credentials.password}
                                                            />
                                                            <Tooltip isOpen={tooltips.password} target="password" toggle={() => handleTooltipToggle('password')}>
                                                                {errors.password}
                                                            </Tooltip>
                                                        </FormGroup>
                                                        <br />
                                                        <Button className="btn secondary__btn auth__btn" type="submit">
                                                            Update Profile
                                                        </Button>
                                                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                                            <Button type="button" onClick={handleDeleteProfile}>
                                                                Delete Profile
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </section>
                        ) : (
                            <p>Loading...</p>
                        )
                    ) : (
                        <div>
                            <p>Please login to view your profile.</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
