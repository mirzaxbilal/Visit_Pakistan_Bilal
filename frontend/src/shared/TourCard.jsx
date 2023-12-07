import React from 'react'
import { Card, CardBody } from "reactstrap";
import { Link } from 'react-router-dom';
import "./tour-card.css"

const TourCard = ({ tour }) => {
    const { _id, title, locations, images, price } = tour
    console.log(images[0]);

    return (
        <div className="tour__card">
            <Card>
                <div className="tour__img">
                    {/* <img src={images[0]} alt="tour-img" /> */}
                    <img src={require(`../assets/images/${images[0]}`)} alt="tour-img" />
                    {/* '../assets/images/tour-img02.jpg' */}
                    <span>Featured</span>
                </div>

                <CardBody>
                    <div className="card__top d-flex align-items-center justify-content-between">
                        <span className="tour__location d-flex align-items-center gap-1">
                            <i class="ri-map-pin-line"></i> {locations[0].name}
                        </span>
                    </div>
                    <h5 className="tour__title"><Link to={`/tours/${_id}`}>{title}</Link></h5>
                    <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
                        <h5>${price}<span> /per person</span></h5>
                        <button className="btn booking__btn">
                            <Link to={`/tours/${_id}`}>Book Now</Link>
                        </button>

                    </div>
                </CardBody>
            </Card>


        </div>
    )
}

export default TourCard