import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProgramManagement.css';

const ProgramManagement = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);    const [newProgram, setNewProgram] = useState({
        title: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);    
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/programs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch programs');
                }
                const data = await response.json();
                setPrograms(data);
            } catch (error) {
                console.error('Error fetching programs:', error);
                toast.error('Failed to load programs');
            }
        };

        fetchPrograms();
    }, []);

    const handleDelete = async (programId) => {
        if (!window.confirm('Are you sure you want to delete this program?')) return;
        
        try {            
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/programs/${programId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete program');
            }

            setPrograms(prev => prev.filter(p => p._id !== programId));
            toast.success('Program deleted successfully!');
        } catch (error) {
            console.error('Error deleting program:', error);
            toast.error(error.message || 'Failed to delete program');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProgram(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {            const formData = new FormData();
            formData.append('title', newProgram.title);
            formData.append('description', newProgram.description);
            formData.append('image', newProgram.image);
            const token = localStorage.getItem('token');            const response = await fetch('/api/programs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type header, let the browser set it with the boundary
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create program');
            }            const savedProgram = await response.json();
            
            setPrograms(prev => [...prev, savedProgram]);
            toast.success('Program added successfully!');
            
            // Reset form
            setNewProgram({
                title: '',
                description: '',
                image: null
            });
            setImagePreview('');
        } catch (error) {
            console.error('Error adding program:', error);
            toast.error(error.message || 'Failed to add program');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="program-management">
            <section className="add-program-section">
                <h2>Add New Program</h2>
                <form onSubmit={handleSubmit} className="add-program-form">
                    <div className="form-group">
                        <label htmlFor="title">Program Title</label>
                        <input
                            type="text"
                            id="title"
                            value={newProgram.title}
                            onChange={(e) => setNewProgram(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter program title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={newProgram.description}
                            onChange={(e) => setNewProgram(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter program description"
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Program Image</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Program'}
                    </button>
                </form>
            </section>

            <section className="programs-list-section">
                <h2>Existing Programs</h2>
                <div className="programs-grid">
                    {programs.map((program) => (
                        <div key={program._id} className="program-card">
                            <img src={program.image} alt={program.title} />                            <div className="program-details">
                                <h3>{program.title}</h3>
                                <p className="program-description">{program.description}</p>
                                <div className="program-actions">
                                    <button 
                                        className="manage-services-button"
                                        onClick={() => navigate(`/admin/programs/${program._id}/services`)}
                                    >
                                        Manage Services
                                    </button>
                                    <button 
                                        className="edit-button"
                                        onClick={() => navigate(`/admin/programs/${program._id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-button" 
                                        onClick={() => handleDelete(program._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProgramManagement;
