import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ExperienceEditor from '../editors/ExperienceEditor';

const ExperienceSection = ({
    experiences,
    isAdmin,
    expandedCards,
    toggleCardExpansion,
    addItem,
    updateItem,
    deleteItem,
    setRef
}) => {
    // Date parsing function for accurate month + year sorting
    const parseDateString = (str) => {
        if (!str) return { month: 0, year: 0 };

        const monthMap = {
            jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
            jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
        };

        // Extract all month-year pairs
        const parts = str.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/g);
        const years = str.match(/\b(19|20)\d{2}\b/g);

        // Case: Full month-year matches found
        if (parts) {
            const parsed = parts.map(p => {
                const [m, y] = p.split(" ");
                return { month: monthMap[m], year: Number(y) };
            });
            // Return the latest date in the range
            return parsed.reduce((latest, curr) =>
                curr.year > latest.year || (curr.year === latest.year && curr.month > latest.month)
                    ? curr : latest
            );
        }

        // Case: Only year provided - assume December of that year
        if (years) {
            const y = Number(years[years.length - 1]); // Use the latest year in range
            return { month: 12, year: y };
        }

        return { month: 0, year: 0 };
    };

    const renderExperiences = () => {
        if (!experiences || !Array.isArray(experiences)) return null;

        // Sort internships by month + year (latest first)
        const sortedExperiences = [...experiences].sort((a, b) => {
            const A = parseDateString(a.duration);
            const B = parseDateString(b.duration);

            // Compare year first, then month
            if (B.year !== A.year) return B.year - A.year;
            return B.month - A.month;
        });

        return (
            <div className="internships-scroll-container">
                {sortedExperiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        className="intern-card"
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: index * 0.1 }}
                    >
                        {/* Company Logo/Icon Section */}
                        <div className="intern-header">
                            <div className="intern-badge">{index + 1}</div>
                            <div className="intern-info">
                                <h3 className="intern-company">{exp.company}</h3>
                                <p className="intern-role">{exp.role}</p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="intern-duration">
                            <FaCalendarAlt /> {exp.duration}
                        </div>

                        {/* Markdown Description */}
                        <div className="intern-description-container">
                            <div className={`intern-desc-wrapper ${expandedCards[exp.id] ? 'expanded' : ''}`}>
                                <div className="intern-description-md">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {exp.description}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* See More / Show Less Button */}
                            <button
                                className="view-more-btn"
                                onClick={() => toggleCardExpansion(exp.id)}
                            >
                                {expandedCards[exp.id] ? 'Show Less' : 'See More'}
                            </button>
                        </div>

                        {/* Buttons */}
                        {(exp.certificate || exp.link) && (
                            <div className="intern-buttons">
                                {exp.certificate && (
                                    <a
                                        href={exp.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="intern-btn"
                                    >
                                        <FaCertificate /> Certificate
                                    </a>
                                )}
                                {exp.link && (
                                    <a
                                        href={exp.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="intern-btn"
                                    >
                                        <FaExternalLinkAlt /> View
                                    </a>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <section
            id="experience"
            className="section"
            ref={(el) => setRef("experience", el)}
        >
            <div className="container">
                <div className="section-header">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Experience & <span>Internships</span>
                    </motion.h2>
                    <div className="section-subtitle">My professional journey</div>
                </div>

                {isAdmin && (
                    <ExperienceEditor
                        experiences={experiences}
                        onAdd={(newExp) => addItem("experiences", newExp)}
                        onUpdate={(id, updatedExp) =>
                            updateItem("experiences", id, updatedExp)
                        }
                        onDelete={(id) => deleteItem("experiences", id)}
                    />
                )}

                <div className="internship-container">
                    {renderExperiences()}
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
