import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = ({ setRef }) => {
    const highlights = [
        { icon: "⭐", title: "20+ Projects", desc: "Built and deployed" },
        { icon: "🚀", title: "Internship", desc: "Real-world experience" },
        { icon: "🧠", title: "AI/ML Expert", desc: "Deep Learning focus" },
        { icon: "💻", title: "Full Stack", desc: "End-to-end development" }
    ];

    const roles = [
        "AI/ML Engineer",
        "Frontend Developer",
        "Full-Stack Learner",
        "Competitive Programmer"
    ];

    const personalInfo = [
        { icon: "👤", label: "Name", value: "Dhinakaran M S" },
        { icon: "📧", label: "Email", value: "dhinakaranms123@gmail.com" },
        { icon: "📍", label: "Location", value: "Coimbatore, Tamil Nadu, India" }
    ];

    return (
        <section
            id="about"
            className="section section-bg"
            ref={(el) => setRef("about", el)}
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
                        About <span>Me</span>
                    </motion.h2>
                    <motion.div 
                        className="section-subtitle"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Get to know me better
                    </motion.div>
                </div>

                <div className="about-container-modern">
                    {/* Background Decorations */}
                    <div className="about-bg-modern">
                        <div className="about-orb-modern orb-1"></div>
                        <div className="about-orb-modern orb-2"></div>
                        <div className="about-orb-modern orb-3"></div>
                    </div>

                    {/* Identity Badges */}
                    <motion.div 
                        className="identity-badges-modern"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {roles.map((badge, index) => (
                            <motion.div
                                key={badge}
                                className="identity-badge-modern"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                {badge}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Highlight Cards Grid */}
                    <div className="highlights-grid-modern">
                        {highlights.map((card, index) => (
                            <motion.div
                                key={index}
                                className="highlight-card-modern"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                            >
                                <div className="highlight-icon-modern">{card.icon}</div>
                                <div className="highlight-content-modern">
                                    <div className="highlight-title-modern">{card.title}</div>
                                    <div className="highlight-desc-modern">{card.desc}</div>
                                </div>
                                <div className="highlight-glow"></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="about-content-grid">
                        {/* Personal Info Card */}
                        <motion.div
                            className="about-info-card-modern"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="info-card-header">
                                <h3 className="info-card-title">Personal Information</h3>
                                <div className="info-card-accent"></div>
                            </div>
                            <div className="info-card-content">
                                {personalInfo.map((info, index) => (
                                    <motion.div
                                        key={index}
                                        className="info-row-modern"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    >
                                        <div className="info-icon-modern">{info.icon}</div>
                                        <div className="info-text-modern">
                                            <span className="info-label">{info.label}</span>
                                            <span className="info-value">{info.value}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* About Text Card */}
                        <motion.div
                            className="about-text-card-modern"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="text-card-header">
                                <h3 className="text-card-title">My Story</h3>
                                <div className="text-card-accent"></div>
                            </div>
                            <div className="text-card-content">
                                <motion.p
                                    className="about-text-modern"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    I am a pre-final year Computer Science and Engineering student at KIT, specializing in <span className="text-highlight">AI and Machine Learning</span>. I'm a passionate software developer skilled in HTML, CSS, JavaScript, and Python with interests in ML and competitive programming.
                                </motion.p>

                                <motion.p
                                    className="about-text-modern"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    I enjoy building <span className="text-highlight">practical solutions</span> and constantly explore new technologies to expand my skill set. My journey in web development has taught me the importance of clean code, responsive design, and user-centric applications.
                                </motion.p>

                                <motion.p
                                    className="about-text-modern"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    I aim to contribute to <span className="text-highlight">impactful projects</span> and grow as a developer through continuous learning and collaboration. Always eager to take on new challenges and expand my horizons in both frontend and backend development.
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
