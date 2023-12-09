import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardImg, CardBody, CardText, CardTitle } from 'reactstrap';

import '../styles/MyPackages.css';
const MyPackages = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/agents/getAgentPackage/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.AccessToken}`, // Replace with your token variable
                    },
                });
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };

        fetchPackages();
    }, [user.id]);

    const handleDelete = async (packageId) => {
        // Implement the delete functionality
        // This should make a DELETE request to your backend
    };

    const handleUpdate = (packageId) => {
        // Navigate to the update package page
        navigate(`/updatePackage/${packageId}`);
    };

    return (
        <Container className="my-packages-container">
            <h1>My Packages</h1>
            <Row>
                {packages.map(pkg => (
                    <Col md="4" key={pkg._id}>
                        <Card className="package-item">
                            <CardBody>
                                <CardTitle tag="h2" className="package-title">{pkg.title}</CardTitle>
                                <CardText className="package-status">Status: {pkg.isApproved ? 'Approved' : 'Pending'}</CardText>
                                <CardText className="package-locations">Locations: {pkg.locations.join(', ')}</CardText>
                                <CardText>{pkg.overview}</CardText>
                                <div className="package-images">
                                    {pkg.images.map((image, index) => (
                                        <CardImg key={index} top src={image} alt={`Package ${pkg.title}`} className="image img-fluid" />
                                    ))}
                                </div>
                                <div className="actions">
                                    <Button color="primary" onClick={() => handleUpdate(pkg._id)}>Update</Button>{' '}
                                    <Button color="danger" onClick={() => handleDelete(pkg._id)}>Delete</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MyPackages;
