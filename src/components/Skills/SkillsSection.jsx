import React from 'react';
import { motion } from 'framer-motion';
import SkillsEditor from '../editors/SkillsEditor';

const SkillsSection = ({
    skills,
    isAdmin,
    addItem,
    updateItem,
    deleteItem,
    setRef
}) => {
    const renderSkills = () => {
        if (!skills || !Array.isArray(skills)) return null;
        return skills.map((skill, index) => (
            <div
                key={skill.id}
                className="skill-card"
                style={{ animationDelay: `${index * 0.2}s, ${index * 0.3}s` }}
            >
                <div className="skill-header">
                    <div
                        className="skill-icon"
                        style={{ backgroundColor: skill.color + "20" }}
                    >
                        {skill.icon && skill.icon.startsWith('<svg') ? (
                            // Inline SVG code
                            <div
                                className="skill-icon-img"
                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                            />
                        ) : (
                            // Image URL
                            <img
                                src={skill.icon}
                                alt={skill.name}
                                className="skill-icon-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                    <h3 className="skill-name">{skill.name}</h3>
                </div>
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                backgroundColor: skill.color,
                                width: `${skill.level}%`,
                                transition: 'width 1s ease-out'
                            }}
                        ></div>
                    </div>
                    <div className="progress-value">{skill.level}%</div>
                </div>
            </div>
        ));
    };

    return (
        <section
            id="skills"
            className="section"
            ref={(el) => setRef("skills", el)}
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
                        My <span>Skills</span>
                    </motion.h2>
                    <div className="section-subtitle">Technologies I master</div>
                </div>
                <div className="skills-grid">{renderSkills()}</div>

                {isAdmin && (
                    <SkillsEditor
                        skills={skills}
                        onAdd={(newSkill) => addItem("skills", newSkill)}
                        onUpdate={(id, updatedSkill) =>
                            updateItem("skills", id, updatedSkill)
                        }
                        onDelete={(id) => deleteItem("skills", id)}
                    />
                )}
            </div>
        </section>
    );
};

export default SkillsSection;
