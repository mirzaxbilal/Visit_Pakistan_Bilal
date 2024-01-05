import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import '../styles/About.css'; // Make sure to create this CSS file

const About = () => {
    const [aboutPageContent, setAboutPageContent] = useState({});
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                // Fetch about page content
                const aboutResponse = await fetch('http://localhost:5000/aboutpage/');
                const aboutData = await aboutResponse.json();
                if (aboutResponse.ok) {
                    setAboutPageContent(aboutData);
                    setReviews(aboutData.Reviews);
                } else {
                    throw new Error(aboutData.message);
                }
            } catch (error) {
                console.error('Fetching about data failed:', error);
            }
        };

        fetchAboutData();
    }, []);

    // Calculate the current reviews to display
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reviews.length / reviewsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Container>
                <h1 className="about-heading">{aboutPageContent.AboutTagline}</h1>
                <Row className="about-section">
                    <Col md="6">
                        <p>{aboutPageContent.AboutDescription}</p>
                    </Col>
                    <Col md="6">
                        <img src={aboutPageContent.AboutImage} alt="About Us" className="about-image"/>
                    </Col>
                </Row>
            </Container>
            <Container>
                <h2 className="reviews-heading">Reviews</h2>
                {currentReviews.map((review, index) => (
                    <Row key={index} className="review-row">
                        <Col md="6" className="review-username">
                            {review.username}
                        </Col>
                        <Col md="6" className="review-comment">
                            {review.comment}
                        </Col>
                    </Row>
                ))}
                <Pagination aria-label="Review Pagination">
                    {pageNumbers.map(number => (
                        <PaginationItem key={number} active={number === currentPage}>
                            <PaginationLink onClick={() => paginate(number)}>
                                {number}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </Pagination>
            </Container>
        </>
    );
};

export default About;
