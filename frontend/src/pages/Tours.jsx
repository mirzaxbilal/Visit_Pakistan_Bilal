import React, { useEffect, useState } from 'react';
import CommonSection from '../shared/CommonSection'
import '../styles/tour.css'
//import tourData from '../assets/data/tours';
import TourCard from './../shared/TourCard';
import { Container, Row, Col } from 'reactstrap'
import { BASE_URL } from './../utils/config';
const Tours = () => {

    const [tourData, setTourData] = useState([]);

    useEffect(() => {
        const fetchTourData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/packages/`, {
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

        fetchTourData();
    }, []);



    return (
        <>
            <CommonSection title={"All Tours"} />
            <section className="pt-0">
                <Container>
                    <Row className="tour-row">
                        {
                            tourData?.map(tour =>
                                <Col lg='3' key={tour.id}>
                                    <TourCard tour={tour} />
                                </Col>)
                        }
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default Tours