import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Tooltip } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL, CloudinaryLink } from './../utils/config';

const AgentRegister = () => {
    const [agentInfo, setAgentInfo] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        cnic_image: null,
        license_image: null,
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    const [tooltips, setTooltips] = useState({
        name: false,
        phone: false,
        email: false,
        password: false,
    });

    const handleChange = (e) => {
        const { id, value, files } = e.target;

        if (files) {
            setAgentInfo((prev) => ({ ...prev, [id]: files[0] }));
        } else {
            setAgentInfo((prev) => ({ ...prev, [id]: value }));
        }

        setErrors((prev) => ({ ...prev, [id]: '' }));
        setTooltips((prev) => ({ ...prev, [id]: false }));
    };

    const handleTooltipToggle = (field) => {
        setTooltips((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'c2pmuzwc');

        try {
            const response = await fetch(`${CloudinaryLink}`, {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};


        if (!agentInfo.name || agentInfo.name.length < 3 || agentInfo.name.length > 50) {
            newErrors.name = 'Please enter a valid agency name (between 3 and 50 characters).';
            setTooltips((prev) => ({ ...prev, name: true }));
        }


        if (!agentInfo.email || !/\S+@\S+\.\S+/.test(agentInfo.email)) {
            newErrors.email = 'Please enter a valid email address.';
            setTooltips((prev) => ({ ...prev, email: true }));
        }


        if (!agentInfo.phone || !/^\d{11}$/.test(agentInfo.phone)) {
            newErrors.phone = 'Please enter a valid phone number (exactly 11 digits).';
            setTooltips((prev) => ({ ...prev, phone: true }));
        }


        if (!agentInfo.password || agentInfo.password.length < 8) {
            newErrors.password = 'Please enter a valid password (at least 8 characters).';
            setTooltips((prev) => ({ ...prev, password: true }));
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {

                const cnic_imageUrl = await uploadImageToCloudinary(agentInfo.cnic_image);
                const license_imageUrl = await uploadImageToCloudinary(agentInfo.license_image);

                const requestData = {
                    name: agentInfo.name,
                    phone: agentInfo.phone,
                    email: agentInfo.email,
                    password: agentInfo.password,
                    cnic_image: cnic_imageUrl,
                    license_image: license_imageUrl,
                };
                console.log(requestData);
                const response = await fetch(`${BASE_URL}/agents/createAgent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    const result = await response.json();
                    alert(result.message);
                    return;
                }

                const result = await response.json();
                dispatch({ type: 'REGISTER_SUCCESS' });
                navigate('/login');
            } catch (error) {
                alert('Registration failed. Please try again.');
            }
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className='m-auto'>
                        <div className='login__container d-flex justify-content-between'>
                            <div className='login__img'>
                                <img src={registerImg} alt='' />
                            </div>
                            <div className='login__form__main'>
                                <div className='user'>
                                    <img src={userIcon} alt='' />
                                </div>
                                <h2>Agent Register</h2>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <input
                                            type='text'
                                            placeholder='Travel Agency Name'
                                            required
                                            id='name'
                                            onChange={handleChange}
                                            value={agentInfo.name}
                                        />
                                        <Tooltip isOpen={tooltips.name} target='name' toggle={() => handleTooltipToggle('name')}>
                                            {errors.name}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type='email'
                                            placeholder='Email'
                                            required
                                            id='email'
                                            onChange={handleChange}
                                            value={agentInfo.email}
                                        />
                                        <Tooltip isOpen={tooltips.email} target='email' toggle={() => handleTooltipToggle('email')}>
                                            {errors.email}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type='tel'
                                            placeholder='Phone Number'
                                            required
                                            id='phone'
                                            onChange={handleChange}
                                            value={agentInfo.phone}
                                        />
                                        <Tooltip isOpen={tooltips.phone} target='phone' toggle={() => handleTooltipToggle('phone')}>
                                            {errors.phone}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type='password'
                                            placeholder='Password'
                                            required
                                            id='password'
                                            onChange={handleChange}
                                            value={agentInfo.password}
                                        />
                                        <Tooltip isOpen={tooltips.password} target='password' toggle={() => handleTooltipToggle('password')}>
                                            {errors.password}
                                        </Tooltip>
                                    </FormGroup>
                                    <FormGroup>
                                        <label htmlFor='cnic_image'>CNIC Front Picture Upload</label>
                                        <input type='file' accept='image/*' id='cnic_image' onChange={handleChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <label htmlFor='license_image'>Travel Agency License Picture Upload</label>
                                        <input type='file' accept='image/*' id='license_image' onChange={handleChange} />
                                    </FormGroup>
                                    <Button className='btn secondary__btn auth__btn' type='submit'>
                                        Create Account
                                    </Button>
                                    <p>
                                        Already have an account?<Link to='/login'>Login</Link>
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

export default AgentRegister;
