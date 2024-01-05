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
import AgentMyBookings from '../pages/AgentMyBookings';
import LocationPage from '../pages/LocationPage';
import SearchResultList from '../pages/SearchResultList';
import About from '../pages/About';

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/tours' element={<Tour />} />
            <Route path='/tours/search' element={<SearchResultList />} />
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
            <Route path='/AgentMyBookings' element={<AgentMyBookings />} />
            <Route path='/location/:id' element={<LocationPage />} />
            <Route path='/about' element={<About />} />
        </Routes >
    )
}

export default Router