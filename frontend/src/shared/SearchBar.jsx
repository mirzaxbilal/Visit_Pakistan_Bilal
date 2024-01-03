import React, { useRef } from 'react';
import './search-bar.css';
import { Col, Form, FormGroup } from 'reactstrap';
import { BASE_URL } from './../utils/config';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const locationRef = useRef('');
    const navigate = useNavigate();

    const searchHandler = async () => {
        const location = locationRef.current.value;
        const res = await fetch(`${BASE_URL}/packages/getPackageBySearch?title=${location}`);
        const result = await res.json();
        if (!res.ok) alert('Something went wrong');
        navigate(`/tours/search/?title=${location}`, { state: result, replace: true });
    };

    return (
        <Col lg='12' className="d-flex justify-content-center align-items-center">
            <div className="search__bar">
                <Form className="d-flex align-items-center gap-4">
                    <FormGroup className="d-flex gap-3 form__group form__group-fast">
                        <span>
                            <i class="ri-map-pin-line"></i>
                        </span>
                        <div>
                            {/* <h6>Location</h6> */}
                            <input type="text" placeholder="Where are you going?" ref={locationRef} />
                        </div>
                    </FormGroup>
                    <span className="search__icon" onClick={searchHandler}>
                        <i class="ri-search-line"></i>
                    </span>
                </Form>
            </div>
        </Col>
    );
};

export default SearchBar;
