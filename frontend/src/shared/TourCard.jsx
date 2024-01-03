import React from 'react'
import { Card, CardBody } from "reactstrap";
import { Link } from 'react-router-dom';
import "./tour-card.css"

const TourCard = ({ tour }) => {
    const { _id, title, locations, images, price, agentId } = tour

    console.log(agentId)
    return (
        <div className="tour__card">
            <Card>
                <div className="tour__img">
                    <img src={images[0]} alt="tour-img" />
                    {/* <span>Featured</span> */}
                </div>

                <CardBody>
                    <div className="card__top d-flex align-items-center justify-content-between">
                        <span className="tour__location d-flex align-items-center gap-1">
                            <i className="ri-map-pin-line"></i> {locations.map(location => location.name).join(', ')}
                        </span>
                        <span className="agent__name d-flex align-items-center gap-1">
                            <i class="ri-store-line"></i> {agentId.name}
                        </span>
                    </div>
                    <h5 className="tour__title">
                        <Link to={`/tours/${_id}`}>{title}</Link>
                    </h5>
                    <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
                        <h5>${price}<span> /per person</span></h5>
                        <button className="btn booking__btn">
                            <Link to={`/tours/${_id}`}>Book Now</Link>
                        </button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};


export default TourCard