import React, { useState, useEffect } from 'react'
import CommonSection from "./../shared/CommonSection";
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from "react-router-dom";
import TourCard from './../shared/TourCard';
import SearchBar from './../shared/SearchBar';
import '../styles/SearchResultList.css';

const SearchResultList = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state);

    useEffect(() => {
        setData(location.state); // Update data whenever location changes
    }, [location]);
    console.log("data", data);
    console.log("data length", data.length);
    return (
        <>
            <CommonSection title={"Package Search Result"} />

            <section>

                <Container>
                    <Row className='search__row'>

                        <SearchBar />

                    </Row>
                    <Row>
                        {data.length === 0 ? (
                            <h4 className="text-center">No tour found</h4>
                        ) : (
                            data?.map(tour => (
                                <Col lg='3' className="mb-4" key={tour._id}>
                                    <TourCard tour={tour} />

                                </Col>

                            ))
                        )}
                    </Row>
                </Container>

            </section>

        </>
    )
}

export default SearchResultList