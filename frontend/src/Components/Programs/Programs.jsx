import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Programs.css';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Handle both development and production environments
    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
};

const Programs = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('/api/programs');
                if (!response.ok) {
                    throw new Error('Failed to fetch programs');
                }
                const data = await response.json();
                setPrograms(data);
            } catch (error) {
                console.error('Error fetching programs:', error);
                toast.error('Failed to load programs');
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    if (loading) {
        return <div className="loading">Loading programs...</div>;
    }

    if (programs.length === 0) {
        return <div className="no-programs">No programs available at the moment.</div>;
    }

    return (
        <div className="programs">
            <div className="programs-grid">
                {programs.map((program) => (
                    <div 
                        key={program._id}
                        className="program-card"
                        onClick={() => navigate(`/admin/programs/${program._id}`)}
                    >
                        <img src={getImageUrl(program.image)} alt={program.title} />
                        <div className="program-info">
                            <h3>{program.title}</h3>
                            <p>{program.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Programs;
