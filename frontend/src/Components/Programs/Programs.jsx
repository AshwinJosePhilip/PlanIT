import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './Programs.css';
import program_1 from '../../assets/programs-1.jpg';
import program_2 from '../../assets/programs-2.jpg';
import program_3 from '../../assets/programs-3.jpeg';
import program_4 from '../../assets/programs-4.webp';
import program_5 from '../../assets/programs-5.jpeg';
import program_6 from '../../assets/programs-6.jpeg';
import program_7 from '../../assets/programs-7.jpeg';
import program_8 from '../../assets/programs-8.jpg';
import program_9 from '../../assets/programs-9.jpeg';
import program_10 from '../../assets/programs-10.webp';
import program_11 from '../../assets/programs-11.jpeg';
import program_12 from '../../assets/programs-12.jpeg';
import program_icon_3 from '../../assets/program_icon_3.jpg';

const ProgramCard = ({ image, title, delay, onClick }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.2
    });

    return (
        <div 
            ref={ref}
            className={`program ${isVisible ? 'visible' : ''}`}
            style={{ '--delay': `${delay}s` }}
            role="button"
            tabIndex="0"
            aria-label={`View ${title} services`}
            onClick={onClick}
            onKeyPress={(e) => e.key === 'Enter' && onClick()}
        >
            <img src={image} alt={title} />
            <div className="caption">
                <img src={program_icon_3} alt="" aria-hidden="true" />
                <p>{title}</p>
            </div>
        </div>
    );
};

const Programs = () => {
    const navigate = useNavigate();
    
    const programs = [
        { image: program_1, title: 'Wedding', path: '/programs/wedding' },
        { image: program_2, title: 'Birthday', path: '/programs/birthday' },
        { image: program_3, title: 'Gender Reveal', path: '/programs/gender-reveal' },
        { image: program_4, title: 'Bridal Shower', path: '/programs/bridal-shower' },
        { image: program_5, title: 'Baptism', path: '/programs/baptism' },
        { image: program_6, title: 'Bachelorette', path: '/programs/bachelorette' },
        { image: program_7, title: 'Anniversary', path: '/programs/anniversary' },
        { image: program_8, title: 'Corporate Meetings', path: '/programs/corporate' },
        { image: program_9, title: 'Naming Ceremony', path: '/programs/naming-ceremony' },
        { image: program_10, title: 'Pet Parties', path: '/programs/pet-parties' },
        { image: program_11, title: 'College Events', path: '/programs/college-events' },
        { image: program_12, title: 'Concerts', path: '/programs/concerts' },
        { image: program_4, title: 'Bridal Shower' },
        { image: program_5, title: 'Baptism' },
        { image: program_6, title: 'Bachelorette' },
        { image: program_7, title: 'Anniversary' },
        { image: program_8, title: 'Corporate Meetings' },
        { image: program_9, title: 'Naming Ceremony' },
        { image: program_10, title: 'Pet Parties' },
        { image: program_11, title: 'College Events' },
        { image: program_12, title: 'Concerts' }
    ];

    return (
        <div className='programs' role="region" aria-label="Our Programs">
            {[0, 1, 2].map((rowIndex) => (
                <div key={rowIndex} className='program-row'>
                    {programs.slice(rowIndex * 4, (rowIndex + 1) * 4).map((program, index) => (
                        <ProgramCard 
                            key={index}
                            image={program.image}
                            title={program.title}
                            delay={0.1 * (rowIndex * 4 + index)}
                            onClick={() => navigate(program.path)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Programs;
