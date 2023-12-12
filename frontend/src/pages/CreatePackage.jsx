import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePackage.css';
import { BASE_URL } from './../utils/config';
import { CloudinaryLink } from './../utils/config';
const CreatePackage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [checkedLocations, setCheckedLocations] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        overview: '',
        whatsIncluded: '',
        tourItinerary: '',
        price: 0,
        duration: 0,
        images: [],
        locations: [],
    });

    useEffect(() => {
        // Fetch locations when the component mounts
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${BASE_URL}/locations/`);
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);
    const handleLocationCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setCheckedLocations(prev => ({ ...prev, [value]: checked }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const selectedLocations = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prevData) => ({ ...prevData, locations: selectedLocations }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const uploadImagesToCloudinary = async () => {
        const urls = [];
        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'c2pmuzwc');

            try {
                const response = await fetch(`${CloudinaryLink}`, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors', // Added CORS mode
                });
                const data = await response.json();
                console.log(data);
                urls.push(data.secure_url);
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
            }
        }
        return urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedLocations = Object.entries(checkedLocations)
            .filter(([_, checked]) => checked)
            .map(([id, _]) => id);

        const imageUrls = await uploadImagesToCloudinary();
        const completeFormData = {
            ...formData,
            images: imageUrls,
            locations: selectedLocations, // Use selectedLocations here
        };

        try {
            const response = await fetch('http://localhost:5000/packages/createPackage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.AccessToken}`,
                },
                body: JSON.stringify(completeFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating package:', errorData.message);
                // Show error alert
                alert(`Error creating package: ${errorData.message}`);
                return;
            }

            const result = await response.json();
            console.log('Package created successfully:', result);
            // Show success alert
            alert('Package created successfully');
            navigate('/packages');
        } catch (error) {
            console.error('Error creating package:', error);
            // Show error alert
            alert('Error creating package. Please try again.');
        }
    };


    return (
        <div className="create-package-container">
            {user && user.role === 'agent' ? (
                <div>
                    <h1>Create Package</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Overview:</label>
                            <textarea name="overview" value={formData.overview} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="form-group">
                            <label>What's Included:</label>
                            <textarea
                                name="whatsIncluded"
                                value={formData.whatsIncluded}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Tour Itinerary:</label>
                            <textarea
                                name="tourItinerary"
                                value={formData.tourItinerary}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration (in days):</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Images:</label>
                            <input type="file" multiple onChange={handleFileChange} />
                        </div>

                        <div className="form-group">
                            <label>Select Locations:</label>
                            <div className="locations-checkbox-container" style={{ overflowY: 'auto', maxHeight: '200px' }}>
                                {locations.map((location) => (
                                    <div key={location._id} className="location-checkbox">
                                        <input
                                            type="checkbox"
                                            id={location._id}
                                            value={location._id}
                                            checked={checkedLocations[location._id] || false}
                                            onChange={handleLocationCheckboxChange}
                                        />
                                        <label htmlFor={location._id}>{location.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit">Create Package</button>
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default CreatePackage;
