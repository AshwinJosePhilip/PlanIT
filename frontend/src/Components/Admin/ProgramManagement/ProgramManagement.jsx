import React, { useState } from 'react';
import './ProgramManagement.css';

const ProgramManagement = () => {
    const [programs, setPrograms] = useState([]);
    const [newProgram, setNewProgram] = useState({
        title: '',
        image: null,
        isActive: true
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        try {
            const formData = new FormData();
            formData.append('title', newProgram.title);
            formData.append('image', newProgram.image);
            formData.append('isActive', newProgram.isActive);

            // TODO: Add API call to save program
            
            setPrograms(prev => [...prev, {
                ...newProgram,
                image: imagePreview // Temporary - should use response from API
            }]);
            
            // Reset form
            setNewProgram({
                title: '',
                image: null,
                isActive: true
            });
            setImagePreview('');
        } catch (error) {
            console.error('Error adding program:', error);
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

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={newProgram.isActive}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, isActive: e.target.checked }))}
                            />
                            Active
                        </label>
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
                    {programs.map((program, index) => (
                        <div key={index} className="program-card">
                            <img src={program.image} alt={program.title} />
                            <div className="program-details">
                                <h3>{program.title}</h3>
                                <div className="program-actions">
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button">Delete</button>
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
