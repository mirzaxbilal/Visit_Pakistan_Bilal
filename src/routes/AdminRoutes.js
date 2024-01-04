import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/MainDash';
import UserTable from '../pages/UserTable';
import AgentTable from '../pages/AgentTable';
import PackageApprovals from '../pages/PackageApprovals';
import Locations from '../pages/Locations';
import AdminLogin from '../pages/AdminLogin';
import { AuthContext } from '../context/AuthContext';

const AdminRoutes = () => {
    const { user } = useContext(AuthContext);

    const isAdmin = user && user.role === 'admin';

    return (
        <Routes>
            {isAdmin ? (
                <>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/userTable' element={<UserTable />} />
                    <Route path='/agentTable' element={<AgentTable />} />
                    <Route path='/PackageApprovals' element={<PackageApprovals />} />
                    <Route path='/Locations' element={<Locations />} />
                </>
            ) : (
                <Route path='*' element={<AdminLogin />} />
            )}
        </Routes>
    );
};

export default AdminRoutes;
