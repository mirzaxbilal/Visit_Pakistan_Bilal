import React, { useEffect, useState, useContext } from 'react';
import { Container, Button } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext'; 
import "../styles/Users.css";
import { UilEdit, UilTrashAlt } from '@iconscout/react-unicons';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext); // Access the user from context

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/users/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.AccessToken}`, // Include the auth token
                    },
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchUsers();
    }, [user]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const handleEdit = (userId) => {
        // Logic to handle edit
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${BASE_URL}/users/deleteprofile/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.AccessToken}`,
                    },
                    credentials: 'same-origin',
                });
    
                const result = await response.json();
    
                if (!response.ok) {
                    throw new Error(result.message || 'Error deleting user');
                }
    
                alert('User deleted successfully');
                setUsers(users.filter((user) => user._id !== userId)); // Update local state
            } catch (error) {
                console.error('Delete operation failed:', error);
                alert(error.message);
            }
        }
    };
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(users.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    }
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }


    return (
        <Container>
        <div className="Users">
            <h1>Users</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleEdit(user._id)}><UilEdit /></button>
                                <button onClick={() => handleDelete(user._id)}><UilTrashAlt /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="pagination-controls">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            <span>Page {currentPage} of {Math.ceil(users.length / itemsPerPage)}</span>
            <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(users.length / itemsPerPage)}>Next</Button>
        </div>
        </Container>
    );
};

export default UsersPage;
