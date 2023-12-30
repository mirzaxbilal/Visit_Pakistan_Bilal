import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './../pages/home';
import Tour from './../pages/Tours';
import Login from './../pages/Login';
import Register from './../pages/Register';
// import MyProfile from './../pages/MyProfile';
import CreatePackage from '../pages/CreatePackage';
import MyPackages from '../pages/MyPackages';
import UpdatePackage from '../pages/UpdatePackage';
import AgentRegister from '../pages/AgentRegister';
import AgentProfile from '../pages/AgentProfile';
import UserProfile from '../pages/UserProfile';
import PackageDetails from '../pages/PackageDetails';
import MyBookings from '../pages/MyBookings';

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/tours' element={<Tour />} />
            <Route path='/tours/:id' element={<PackageDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {/* <Route path='/myprofile' element={<MyProfile />} /> */}
            <Route path='/create-package' element={<CreatePackage />} />
            <Route path='/my-packages' element={<MyPackages />} />
            <Route path='/update-package/:packageId' element={<UpdatePackage />} />
            <Route path='/AgentRegister' element={<AgentRegister />} />
            <Route path='/AgentProfile' element={<AgentProfile />} />
            <Route path='/UserProfile' element={<UserProfile />} />
            <Route path='/MyBookings' element={<MyBookings />} />
        </Routes >
    )
}

export default Router