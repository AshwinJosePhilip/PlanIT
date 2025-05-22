import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditProgram.css';

const EditProgram = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);    const [program, setProgram] = useState({
        title: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');
    
    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await fetch(`/api/programs/${programId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch program');
                
                const data = await response.json();
                setProgram(data);
                setImagePreview(data.image);
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
                navigate('/admin/programs');
            }
        };

        fetchProgram();
    }, [programId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProgram(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProgram(prev => ({
                ...prev,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {            const formData = new FormData();
            formData.append('title', program.title);
            formData.append('description', program.description);
            if (program.image instanceof File) {
                formData.append('image', program.image);
            }            const token = localStorage.getItem('token');
            const response = await fetch(`/api/programs/${programId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do not set Content-Type header, let the browser handle it for FormData
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update program');
            }

            toast.success('Program updated successfully');
            navigate('/admin/programs');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="edit-program-container">
            <h2>Edit Program</h2>
            <form onSubmit={handleSubmit} className="edit-program-form">
                <div className="form-group">
                    <label htmlFor="title">Program Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={program.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={program.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                </div>                <div className="form-group">
                    <label htmlFor="image">Program Image</label>
                    <div className="image-upload-container">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={() => navigate('/admin/programs')}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Program'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProgram;
