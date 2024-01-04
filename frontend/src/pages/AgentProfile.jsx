
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Tooltip, Label } from 'reactstrap';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import { useNavigate } from 'react-router-dom';
import '../styles/AgentMyProfile.css';
import userIcon from '../assets/images/user.png';

const AgentProfile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cnic_image: '',
        license_image: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cnic_image: '',
        license_image: '',
    });

    const [tooltips, setTooltips] = useState({
        name: false,
        email: false,
        password: false,
        phone: false,
        cnic_image: false,
        license_image: false,
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
                const res = await fetch(`${BASE_URL}/agents/deleteprofile/${user.id}`, {
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

        // Filter out empty values from credentials
        const nonEmptyCredentials = Object.fromEntries(
            Object.entries(credentials).filter(([key, value]) => value.trim() !== '')
        );


        let newErrors = {};

        if (
            nonEmptyCredentials.name &&
            (nonEmptyCredentials.name.length < 6 ||
                nonEmptyCredentials.name.length > 30 ||
                !/^[a-zA-Z\s]+$/.test(nonEmptyCredentials.name))
        ) {
            newErrors.name =
                'Please enter a valid full name (alphabetic characters only, between 6 and 30 characters).';
            setTooltips((prev) => ({ ...prev, name: true }));
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


        if (nonEmptyCredentials.cnic_image && !nonEmptyCredentials.cnic_image.startsWith('http')) {
            newErrors.cnic_image = 'Please provide a valid URL for the CNIC image.';
            setTooltips((prev) => ({ ...prev, cnic_image: true }));
        }


        if (nonEmptyCredentials.license_image && !nonEmptyCredentials.license_image.startsWith('http')) {
            newErrors.license_image = 'Please provide a valid URL for the License image.';
            setTooltips((prev) => ({ ...prev, license_image: true }));
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                const res = await fetch(`${BASE_URL}/agents/updateAgent/${user.id}`, {
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
                    dispatch({
                        type: 'PROFILE_UPDATE_SUCCESS',
                        payload: result.existingUser,
                    });
                    alert('Profile updated successfully.');
                    window.location.reload();
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
                    const profileEndpoint = `${BASE_URL}/agents/${user.id}`;

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
                        setProfileData(result);
                    }
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        fetchProfile();
    }, [user]);

    return (
        <Container>
            <Row>
                <Col lg='8' className="m-auto">
                    {user ? (
                        profileData ? (
                            <section className='login_section'>
                                <div className="agent_profile__form">
                                    <div className="agent_user">
                                        <img src={userIcon} alt="" />
                                    </div>
                                    <h2>My Profile</h2>
                                    <Form onSubmit={handleClick}>
                                        <FormGroup>
                                            <Label for="name">Name: </Label>
                                            <input
                                                type="text"
                                                placeholder={profileData.name}
                                                id="name"
                                                onChange={handleChange}
                                                value={credentials.name}
                                            />
                                            <Tooltip isOpen={tooltips.name} target="name" toggle={() => handleTooltipToggle('name')}>
                                                {errors.name}
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
                                        <FormGroup>
                                            <Label for="cnic_image">CNIC Image URL: </Label>
                                            <br />
                                            <img src={profileData.cnic_image} alt="CNIC" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="license_image">License Image URL: </Label>
                                            <br />
                                            <img className="license_img" src={profileData.license_image} alt="License" />
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
                            </section>
                        ) : (
                            <p>Loading...</p>
                        )
                    ) : (
                        <div>
                            <h3>Please login to view your profile.</h3>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AgentProfile;
