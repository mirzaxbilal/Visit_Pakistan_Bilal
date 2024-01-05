import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Button } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import "../components/Cards/Cards.css";
import "../styles/PackageConfirmation.css"
import Card from '../components/Card/Card'; // Adjust the import path as needed



const PackageConfirmation = () => {
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchUnconfirmedPackages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/packages/getUnapprovedPackages`, {
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
        

        fetchUnconfirmedPackages();
    }, [user]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = packages.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleConfirm = async (packageId) => {
        try {
            const response = await fetch(`${BASE_URL}/packages/updatePackage/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
                body: JSON.stringify({ isApproved: true }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Error confirming package');
            }
    
            alert('Package confirmed successfully');
            // Update local state to reflect the change
            setPackages(packages.map(pkg => pkg._id === packageId ? { ...pkg, isApproved: true } : pkg));
        } catch (error) {
            console.error('Confirm operation failed:', error);
            alert(error.message);
        }
    };
    

    const handleCancel = async (packageId) => {
        try {
            const response = await fetch(`${BASE_URL}/packages/updatePackage/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
                body: JSON.stringify({ isApproved: false }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Error canceling package');
            }
    
            alert('Package canceled successfully');
            // Update local state to reflect the change
            setPackages(packages.map(pkg => pkg._id === packageId ? { ...pkg, isApproved: false } : pkg));
        } catch (error) {
            console.error('Cancel operation failed:', error);
            alert(error.message);
        }
    };
    

    if (!user) {
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Please login to manage packages.</h3>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (loading) {
        return <Container><p>Loading...</p></Container>;
    }

    if (error) {
        return <Container><p>{error}</p></Container>;
    }

    return (
        <Container>
            <div className='PackageConfirmation'>
            <h1>Package Confirmations</h1>
            <Col>
                {packages.map((pkg, index) => (
                    <Col md="4" key={index}> {/* Each card takes up 4 columns in a 12-column grid */}
                        <div className='Cards'>
                        <Card
                            title={pkg.title}
                            agentName={pkg.agentName} // Adjust according to your data structure
                            images={pkg.images}
                            overview={pkg.overview}
                            whatsIncluded={pkg.whatsIncluded}
                            tourItinerary={pkg.tourItinerary}
                            price={pkg.price}
                            maxPersons={pkg.maxPersons}
                            duration={pkg.duration}
                            onConfirm={() => handleConfirm(pkg._id)}
                            onCancel={() => handleCancel(pkg._id)}
                        />
                        </div>
                    </Col>
                ))}
            </Col>
            <div className="pagination">
                <Button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage}</span>
                <Button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(packages.length / itemsPerPage)}
                >
                    Next
                </Button>
            </div>
            </div>
        </Container>
    )
};

export default PackageConfirmation;
