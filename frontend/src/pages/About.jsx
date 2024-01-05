import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import '../styles/About.css'; // Make sure to create this CSS file

const About = () => {
    const [aboutPageContent, setAboutPageContent] = useState({});
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
            // Retrieve the username from local storage
        const username = localStorage.getItem('username'); // Assuming the username is stored with the key 'username'

        if (!username) {
            console.error('No username found in local storage');
            return; // Optionally, handle this case more gracefully in your UI
        }
        if (!newReview.trim()) {
            console.error('Review text is empty');
            return; // Optionally, show an error message to the user
        }

        const newReviewObject = { username: username, comment: newReview };
        const updatedReviews = [...reviews, newReviewObject];

        try {
            const response = await fetch('http://localhost:5000/aboutpage/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add other headers like authorization if needed
                },
                body: JSON.stringify({ Reviews: updatedReviews })
            });
            if (response.ok) {
                setReviews(updatedReviews);
                setNewReview('');
            } else {
                console.error('Failed to update reviews');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

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
                    <Row key={review._id} className="review-row">
                        <Col md="3" className="review-username">
                            {review.Username} {/* Render the Username string */}
                        </Col>
                        <Col md="9" className="review-comment">
                            {review.Comment} {/* Render the Comment string */}
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
                <Container>
                <form onSubmit={handleReviewSubmit}>
                    <div className="submit-review-btn-wrapper">
                    <input
                        type="text"
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write a Review here..."
                        className="review-input"
                    />
                    </div>                
                    <div className="submit-review-btn-wrapper">
                        <button type="submit" className="submit-review-btn">Submit Review</button>
                    </div>                
                </form>
            </Container>
            </Container>
        </>
    );
};

export default About;
