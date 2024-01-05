import React, { useState, useEffect } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import TourCard from './../shared/TourCard';
import SearchBar from './../shared/SearchBar';
import { useLocation } from 'react-router-dom';
import '../styles/SearchResultList.css';
import { BASE_URL } from './../utils/config';

const SearchResultList = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const searchQuery = new URLSearchParams(location.search).get('title') || '';
            const res = await fetch(`${BASE_URL}/packages/getPackageBySearch?title=${searchQuery}&page=${page}`);
            const result = await res.json();
            setData(result.packages);
            setPageCount(Math.ceil(result.totalCount / 4));
        };

        fetchData();
    }, [location, page]);

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <>
            <CommonSection title={'Package Search Result'} />

            <section>
                <Container>
                    <Row className='search__row'>
                        <SearchBar />
                    </Row>
                    <Row>
                        {data.length === 0 ? (
                            <h4 className='text-center'>No tour found</h4>
                        ) : (
                            data.map((tour) => (
                                <Col lg='3' className='mb-4' key={tour._id}>
                                    <TourCard tour={tour} />
                                </Col>
                            ))
                        )}
                    </Row>
                    <Row>
                        <Col lg='12'>
                            <div className='pagination d-flex align-items-center justify-content-center mt-4 gap-3'>
                                {[...Array(pageCount).keys()].map((number) => (
                                    <span
                                        key={number}
                                        onClick={() => handlePageClick(number)}
                                        className={page === number ? 'active__page' : ''}
                                    >
                                        {number + 1}
                                    </span>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default SearchResultList;
