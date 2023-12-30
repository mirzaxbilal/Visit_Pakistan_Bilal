import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';
import '../styles/CreatePackage.css';
import { BASE_URL, CloudinaryLink } from './../utils/config';

const UpdatePackage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { packageId } = useParams();
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
        maxPersons: 1, // Added field
        locations: [],
        images: [],
    });

    useEffect(() => {
        const fetchLocationsAndPackageData = async () => {
            try {
                const authHeader = {
                    'Authorization': `Bearer ${user.AccessToken}`
                };

                const [locationsResponse, packageResponse] = await Promise.all([
                    fetch(`${BASE_URL}/locations/`, {
                        method: 'GET',
                        headers: authHeader
                    }),
                    fetch(`${BASE_URL}/packages/getPackage/${packageId}`, {
                        method: 'GET',
                        headers: authHeader
                    })
                ]);

                if (!locationsResponse.ok || !packageResponse.ok) {
                    throw new Error(`HTTP error while fetching data! Status: ${locationsResponse.status} and ${packageResponse.status}`);
                }

                const [locationsData, packageData] = await Promise.all([locationsResponse.json(), packageResponse.json()]);

                const checkedLocationsMap = locationsData.reduce((acc, location) => {
                    const isLocationChecked = packageData.locations.some(packageLocation => packageLocation._id === location._id);
                    acc[location._id] = isLocationChecked;
                    return acc;
                }, {});

                setLocations(locationsData);
                setCheckedLocations(checkedLocationsMap);
                setFormData({ ...packageData });
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLocationsAndPackageData();
    }, [packageId, user.AccessToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Add specific logic for individual fields if needed
        // Example: Ensure that maxPersons is not less than 1
        const newValue = name === 'maxPersons' ? Math.max(1, parseInt(value, 10) || 1) : value;

        setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    };

    const handleLocationCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setCheckedLocations((prev) => ({ ...prev, [value]: checked }));
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
                const response = await fetch(CloudinaryLink, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                });
                const data = await response.json();
                urls.push(data.secure_url);
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
            }
        }
        return urls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrls = formData.images;

        if (selectedFiles.length > 0) {
            imageUrls = await uploadImagesToCloudinary();
        }

        const { isDeleted, isApproved, agentId, __v, ...formDataWithoutFlags } = formData;

        const updatedFormData = {
            ...formDataWithoutFlags,
            images: imageUrls,
            locations: Object.keys(checkedLocations).filter(key => checkedLocations[key]),
        };

        try {
            const response = await fetch(`${BASE_URL}/packages/updatePackage/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.AccessToken}`,
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error updating package: ${errorData.message}`);
                return;
            }

            alert('Package updated successfully');
            navigate('/packages');
        } catch (error) {
            console.error('Error updating package:', error);
            alert('Error updating package. Please try again.');
        }
    };

    return (
        <div className="create-package-container">
            {user && user.role === 'agent' ? (
                <form onSubmit={handleSubmit}>
                    <h1>Update Package</h1>

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
                        <textarea name="whatsIncluded" value={formData.whatsIncluded} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Tour Itinerary:</label>
                        <textarea name="tourItinerary" value={formData.tourItinerary} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Duration (in days):</label>
                        <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Max Persons Allowed:</label>
                        <input type="number" name="maxPersons" value={formData.maxPersons} onChange={handleInputChange} />
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

                    <button type="submit">Update Package</button>
                </form>
            ) : null}
        </div>
    );
};

export default UpdatePackage;
