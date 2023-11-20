import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './../pages/home';
import Tour from './../pages/Tours';
import Login from './../pages/Login';
import Register from './../pages/Register';
import MyProfile from './../pages/MyProfile';

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/tours' element={<Tour />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/myprofile' element={<MyProfile />} />
        </Routes >
    )
}

export default Router