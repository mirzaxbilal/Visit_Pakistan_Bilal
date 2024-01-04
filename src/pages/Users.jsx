import React, { useEffect, useState, useContext } from 'react';
import { Container, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext'; 
import "../styles/Users.css";
import { UilEdit, UilTrashAlt } from '@iconscout/react-unicons';
import EditUserForm from '../components/EditUserForm/EditUser'; // Adjust the path as necessary


const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { user } = useContext(AuthContext); 

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

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        setSelectedUser(userToEdit);
        setIsFormOpen(true); // Open the form
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

    const handleCancelEdit = () => {
        setIsFormOpen(false);
        setSelectedUser(null);
    };
    
    const handleSaveEdit = async (updatedUserData) => {
        const { bookings, favourites, _id, isDeleted, createdAt, updatedAt, __v, ...dataWithoutBookings } = updatedUserData;
    
        try {
            const response = await fetch(`${BASE_URL}/users/updateprofile/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.AccessToken}`,
                },
                body: JSON.stringify(dataWithoutBookings),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Error updating user');
            }
    
            alert('User updated successfully');
            setUsers(users.map((u) => (u._id === updatedUserData._id ? updatedUserData : u)));
            setIsFormOpen(false);
            setSelectedUser(null); // Close the edit form
        } catch (error) {
            console.error('Update operation failed:', error);
            alert(error.message);
        }
    };
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

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
            {isFormOpen && (
                <div className="focused-form-container">
                    <div className="focused-form">
                        {selectedUser && (
                            <EditUserForm 
                                userData={selectedUser} 
                                onSave={handleSaveEdit} 
                                onCancel={handleCancelEdit} 
                            />
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default UsersPage;
