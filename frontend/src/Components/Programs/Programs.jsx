import React from 'react';
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

const ProgramCard = ({ image, title, delay }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.2
    });

    return (
        <div 
            ref={ref}
            className={`program ${isVisible ? 'visible' : ''}`}
            style={{ '--delay': `${delay}s` }}
            role="article"
            aria-label={title}
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
    const programs = [
        { image: program_1, title: 'Wedding' },
        { image: program_2, title: 'Birthday' },
        { image: program_3, title: 'Gender Reveal' },
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
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Programs;
