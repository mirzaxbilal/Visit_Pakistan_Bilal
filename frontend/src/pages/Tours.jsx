import React, { useEffect, useState } from 'react';
import CommonSection from '../shared/CommonSection'
import '../styles/tour.css'
//import tourData from '../assets/data/tours';
import TourCard from './../shared/TourCard';
import { Container, Row, Col } from 'reactstrap'
import { BASE_URL } from './../utils/config';
import SearchBar from "../shared/SearchBar";

const Tours = () => {

    const [tourData, setTourData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);

    const [count, setCount] = useState(0);

    useEffect(() => {

        const fetchCount = async () => {
            try {
                const countResponse = await fetch(`${BASE_URL}/packages/getApprovedPackagesCount`, {
                    method: 'GET',
                });
                if (!countResponse.ok) {
                    throw new Error('Failed to fetch package count');
                }
                const countData = await countResponse.json();
                setCount(countData.count);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchCount();


        const fetchTourData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/packages/?page=${page}`, {
                    method: 'GET',
                });
                //console.log(res);
                if (!res.ok) {
                    throw new Error('Failed to fetch tour data');
                }
                const data = await res.json();
                console.log(data);
                setTourData(data);
            } catch (error) {
                console.error(error.message);
            }
        };
        const pages = Math.ceil(count / 1);
        setPageCount(pages)
        fetchTourData();
    }, [page, count]);



    return (
        <>
            <CommonSection title={"All Packages"} />
            <section className="pt-0">
                <Container>
                    <Row className='tour__search__row'>
                        <SearchBar />
                    </Row>

                    <Row className="tour-row">
                        {
                            tourData?.map(tour =>
                                <Col lg='3' key={tour.id}>
                                    <TourCard tour={tour} />
                                </Col>)
                        }

                        <Col lg="12">
                            <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                                {[...Array(pageCount).keys()].map(number => (
                                    <span
                                        key={number}
                                        onClick={() => setPage(number)}
                                        className={page === number ? "active__page" : ""}
                                    >
                                        {number + 1}
                                    </span>

                                ))
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Tours