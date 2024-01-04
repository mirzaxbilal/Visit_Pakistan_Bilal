import React, { useState } from 'react';

const EditUserForm = ({ userData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(userData);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="username">Name: </label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div className="form-row form-group-single">
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} />
                <button onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    togglePasswordVisibility();
                }}>
                    {showPassword ? "Hide" : "Show"}
                </button>            </div>
            </div>
            <div className="form-buttons">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
            </div>
            </form>
        </div>
    );
};

export default EditUserForm;