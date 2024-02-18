import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardImg, CardBody, CardText, CardTitle } from 'reactstrap';

import '../styles/MyPackages.css';

const MyPackages = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/agents/getAgentPackage/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.AccessToken}`,
                    },
                });
                const data = await response.json();
                setPackages(data);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setError('Error fetching packages');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPackages();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (packageId) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this package?');

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/packages/deletePackage/${packageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error deleting package: ${errorData.message}`);
            }

            setPackages(prevPackages => prevPackages.filter(pkg => pkg._id !== packageId));

            const data = await response.json();
            alert(`${data.message}`);
        } catch (error) {
            console.error('Error deleting package:', error.message);
            alert(`Couldn't delete package: ${error.message}`);
        }
    };

    const handleUpdate = (packageId) => {

        navigate(`/update-package/${packageId}`);
    };
    if (!user) {
        return (
            <Container className="my-packages-container">
                <Row>
                    <Col>
                        <h3>Please login to view your packages.</h3>

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
        <Container className="my-packages-container">
            <h1>My Packages</h1>
            <Row>
                {Array.isArray(packages) && packages.length > 0 ? (
                    packages.map(pkg => (
                        <Col md="4" key={pkg._id}>
                            <Card className="package-item">
                                <CardBody>
                                    <CardTitle tag="h2" className="package-title">{pkg.title}</CardTitle>
                                    <CardText className="package-status">Status: {pkg.isApproved ? 'Approved' : 'Pending'}</CardText>
                                    <CardText className="package-locations">Locations: {pkg.locations.map(location => location.name).join(', ')}</CardText>
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
                    ))
                ) : (
                    <Col>
                        <p>No packages available</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default MyPackages;
