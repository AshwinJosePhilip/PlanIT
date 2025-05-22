import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ServiceManagement.css';

const ServiceManagement = () => {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        price: 150000,
        duration: 1,
        maxParticipants: '',
        isActive: true
    });
    const [priceRange] = useState({
        min: 150000,
        max: 500000,
        step: 10000
    });
    const [durationRange] = useState({
        min: 1,
        max: 2,
        step: 0.5
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingServiceIds, setDeletingServiceIds] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const updateRangeProgress = (element, value, min, max) => {
        const progress = ((value - min) / (max - min)) * 100;
        element.style.background = `linear-gradient(to right, #921a64 0%, #921a64 ${progress}%, #e0e0e0 ${progress}%, #e0e0e0 100%)`;
    };

    const handlePriceChange = (e) => {
        const value = Number(e.target.value);
        setNewService(prev => ({ ...prev, price: value }));
        updateRangeProgress(e.target, value, priceRange.min, priceRange.max);
    };

    const handleDurationChange = (e) => {
        const value = Number(e.target.value);
        setNewService(prev => ({ ...prev, duration: value }));
        updateRangeProgress(e.target, value, durationRange.min, durationRange.max);
    };

    useEffect(() => {
        const priceInput = document.getElementById('price');
        const durationInput = document.getElementById('duration');
        if (priceInput) {
            updateRangeProgress(priceInput, newService.price, priceRange.min, priceRange.max);
        }
        if (durationInput) {
            updateRangeProgress(durationInput, newService.duration, durationRange.min, durationRange.max);
        }
    }, [newService.price, newService.duration]);

    useEffect(() => {
        const fetchProgramAndServices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication required');
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [programRes, servicesRes] = await Promise.all([
                    fetch(`/api/programs/${programId}`, { headers }),
                    fetch(`/api/programs/${programId}/services`, { headers })
                ]);
                
                if (!programRes.ok) {
                    throw new Error(
                        `Failed to fetch program: ${programRes.status} ${programRes.statusText}`
                    );
                }
                if (!servicesRes.ok) {
                    throw new Error(
                        `Failed to fetch services: ${servicesRes.status} ${servicesRes.statusText}`
                    );
                }

                const [programData, servicesData] = await Promise.all([
                    programRes.json(),
                    servicesRes.json()
                ]);

                console.log('Program data:', programData);
                console.log('Services data:', servicesData);

                setProgram(programData);
                setServices(servicesData);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load program and services');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgramAndServices();
    }, [programId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!programId) {
                throw new Error('Program ID is required');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const formData = new FormData();
            
            // Validate and transform data before sending
            const validatedData = {
                title: newService.title.trim(),
                description: newService.description.trim(),
                price: parseFloat(newService.price),
                duration: newService.duration.trim(),
                maxParticipants: parseInt(newService.maxParticipants),
                isActive: newService.isActive
            };

            // Client-side validation
            if (!validatedData.title) throw new Error('Title is required');
            if (!validatedData.description) throw new Error('Description is required');
            if (isNaN(validatedData.price) || validatedData.price <= 0) throw new Error('Price must be a positive number');
            if (!validatedData.duration) throw new Error('Duration is required');
            if (isNaN(validatedData.maxParticipants) || validatedData.maxParticipants <= 0) throw new Error('Maximum participants must be a positive number');
            if (!selectedImage) throw new Error('Image is required');

            // Append validated data to FormData
            Object.entries(validatedData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            formData.append('image', selectedImage);

            console.log('Sending service data:', validatedData);

            const response = await fetch(`/api/programs/${programId}/services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create service');
            }

            console.log('Service created successfully:', data);
            setServices(prev => [...prev, data]);
            toast.success('Service added successfully!');

            // Reset form
            setNewService({
                title: '',
                description: '',
                price: '',
                duration: '',
                maxParticipants: '',
                isActive: true
            });
            setSelectedImage(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error creating service:', error);
            toast.error(error.message || 'Failed to create service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setNewService({
            title: service.title,
            description: service.description,
            price: service.price,
            duration: service.duration,
            maxParticipants: service.maxParticipants,
            isActive: service.isActive
        });
        setImagePreview(service.image);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEditingService(null);
        setNewService({
            title: '',
            description: '',
            price: '',
            duration: '',
            maxParticipants: '',
            isActive: true
        });
        setSelectedImage(null);
        setImagePreview('');
        setIsEditing(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const formData = new FormData();
            Object.entries(newService).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch(`/api/programs/${programId}/services/${editingService._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update service');
            }

            setServices(prev => prev.map(s => 
                s._id === editingService._id ? data : s
            ));
            toast.success('Service updated successfully!');
            handleCancelEdit();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error(error.message || 'Failed to update service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        setDeletingServiceIds(prev => [...prev, serviceId]);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await fetch(`/api/programs/${programId}/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete service');
            }

            setServices(prev => prev.filter(s => s._id !== serviceId));
            toast.success('Service deleted successfully!');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to delete service');
        } finally {
            setDeletingServiceIds(prev => prev.filter(id => id !== serviceId));
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (!program) {
        return <div className="loading">Failed to load program details.</div>;
    }

    return (
        <div className="service-management">
            <header className="program-header">
                <h1>{program.title} - Services</h1>
                <p className="program-description">{program.description}</p>
            </header>

            <section className="add-service-section">
                <h2>{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
                <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="add-service-form">
                    <div className="form-group">
                        <label htmlFor="title">Service Title</label>
                        <input
                            type="text"
                            id="title"
                            value={newService.title}
                            onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter service title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={newService.description}
                            onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter service description"
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Service Image</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!isEditing}
                            />
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group service-field">
                        <label htmlFor="price">Price Range (₹)</label>
                        <div className="price-range-wrapper">
                            <span className="range-value">
                                ₹{newService.price.toLocaleString('en-IN')}
                            </span>
                            <input
                                type="range"
                                id="price"
                                min={priceRange.min}
                                max={priceRange.max}
                                step={priceRange.step}
                                value={newService.price}
                                onChange={handlePriceChange}
                                required
                            />
                            <div className="range-limits">
                                <span>₹{priceRange.min.toLocaleString('en-IN')}</span>
                                <span>₹{priceRange.max.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group service-field">
                        <label htmlFor="duration">Duration (Days)</label>
                        <div className="duration-range-wrapper">
                            <span className="range-value">
                                {newService.duration} {newService.duration === 1 ? 'Day' : 'Days'}
                            </span>
                            <input
                                type="range"
                                id="duration"
                                min={durationRange.min}
                                max={durationRange.max}
                                step={durationRange.step}
                                value={newService.duration}
                                onChange={handleDurationChange}
                                required
                            />
                            <div className="range-limits">
                                <span>{durationRange.min} Day</span>
                                <span>{durationRange.max} Days</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxParticipants">Maximum Participants</label>
                        <input
                            type="number"
                            id="maxParticipants"
                            value={newService.maxParticipants}
                            onChange={(e) => setNewService(prev => ({ ...prev, maxParticipants: e.target.value }))}
                            placeholder="Enter maximum participants"
                            required
                            min="1"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? (isEditing ? 'Updating...' : 'Adding...') 
                            : (isEditing ? 'Update Service' : 'Add Service')}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </section>

            <section className="services-list-section">
                <h2>Existing Services</h2>
                {services.length === 0 ? (
                    <div className="no-services">No services found for this program. Add your first service using the form above.</div>
                ) : (
                    <div className="services-grid">
                        {services.map((service) => (
                        <div key={service._id} className="service-card">
                            {service.image && (
                                <div className="service-image">
                                    <img src={service.image} alt={service.title} />
                                </div>
                            )}
                            <div className="service-details">
                                <h3>{service.title}</h3>
                                <p className="service-description">{service.description}</p>                                <div className="service-info">
                                    <p><strong>Price:</strong> ₹{Number(service.price).toLocaleString('en-IN')}</p>
                                    <p><strong>Duration:</strong> {service.duration} {Number(service.duration) === 1 ? 'Day' : 'Days'}</p>
                                    <p><strong>Max Participants:</strong> {service.maxParticipants}</p>
                                </div>
                                <div className="service-actions">
                                    <button 
                                        className="edit-button" 
                                        onClick={() => handleEdit(service)}
                                        disabled={isEditing && editingService?._id === service._id}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-button" 
                                        onClick={() => handleDelete(service._id)}
                                        disabled={isEditing || deletingServiceIds.includes(service._id)}
                                    >
                                        {deletingServiceIds.includes(service._id) ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ServiceManagement;
