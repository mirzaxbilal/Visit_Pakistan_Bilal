import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './../pages/home';
import Tour from './../pages/Tours';
import Login from './../pages/Login';
import Register from './../pages/Register';
import MyProfile from './../pages/MyProfile';
import CreatePackage from '../pages/CreatePackage';
import MyPackages from '../pages/MyPackages';
import UpdatePackage from '../pages/UpdatePackage';

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/tours' element={<Tour />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/myprofile' element={<MyProfile />} />
            <Route path='/create-package' element={<CreatePackage />} />
            <Route path='/my-packages' element={<MyPackages />} />
            <Route path='/update-package/:packageId' element={<UpdatePackage />} />

        </Routes >
    )
}

export default Router