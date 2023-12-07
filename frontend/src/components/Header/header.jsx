import React, { useRef, useEffect, useContext, useState } from 'react';
import { Container, Row, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/images/logo.png';
import './header.css';
import { AuthContext } from './../../context/AuthContext';

const nav_links = [
    {
        path: '/home',
        display: 'Home'
    },
    {
        path: 'about',
        display: 'About'
    },
    {
        path: '/tours',
        display: 'Tours'
    }
];

const Header = () => {
    const headerRef = useRef(null);
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [locations, setLocations] = useState([]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openDropdown = () => {
        setDropdownOpen(true);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:5000/locations/');
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
        stickyHeaderFunc();
        return () => window.removeEventListener('scroll', stickyHeaderFunc);
    }, []);

    const redirectToLocation = (locationId) => {
        navigate(`/location/${locationId}`);
    };

    const renderLocationsDropdown = () => {
        return locations.map((location) => (
            <DropdownItem key={location._id} onClick={() => redirectToLocation(location._id)}>
                {location.name}
            </DropdownItem>
        ));
    };

    const stickyHeaderFunc = () => {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        });
    };

    return (
        <header className="header" ref={headerRef}>
            <Container>
                <Row>
                    <div className="nav_wrapper d-flex align-items-center justify-content-between">
                        <div className="logo">
                            <img src={logo} alt="" />
                        </div>
                        <div className="navigation">
                            <ul className="menu d-flex align-items-center gap-5">
                                {nav_links.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <NavLink
                                            to={item.path}
                                            className={(navClass) => (navClass.isActive ? 'active__link' : '')}
                                        >
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))}
                                <li className="nav__item">
                                    <UncontrolledDropdown
                                        onMouseOver={openDropdown}
                                        onMouseLeave={closeDropdown}
                                        isOpen={dropdownOpen}
                                    >
                                        <DropdownToggle caret>Places to Visit</DropdownToggle>
                                        <DropdownMenu>{renderLocationsDropdown()}</DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        </div>
                        <div className="nav__right d-flex align-items-center gap-4">
                            <div className="nav__btns d-flex align-items-center gap-4">
                                {user ? (
                                    <>
                                        <Button className="btn secondary__btn">
                                            <Link to="/myprofile">{user.name}</Link>
                                        </Button>
                                        <Button className="btn btn-dark" onClick={logout}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="btn secondary__btn">
                                            <Link to="/login">Login</Link>
                                        </Button>
                                        <Button className="btn primary__btn">
                                            <Link to="/register">Register</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                            <span className="mobile__menu">
                                <i className="ri-menu-line"></i>
                            </span>
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
