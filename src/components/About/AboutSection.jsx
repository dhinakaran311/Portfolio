import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = ({ setRef }) => {
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
                    <div className="section-subtitle">Get to know me better</div>
                </div>

                <div className="about-glass-container">
                    {/* Background Decorations */}
                    <div className="about-bg-orb orb-1"></div>
                    <div className="about-bg-orb orb-2"></div>
                    <div className="about-bg-orb orb-3"></div>

                    {/* Identity Badges */}
                    <div className="identity-badges">
                        {[
                            "AI/ML Engineer",
                            "Frontend Developer",
                            "Full-Stack Learner",
                            "Competitive Programmer"
                        ].map((badge, index) => (
                            <motion.div
                                key={badge}
                                className="identity-badge"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {badge}
                            </motion.div>
                        ))}
                    </div>

                    {/* Highlight Cards */}
                    <div className="highlight-cards">
                        {[
                            { icon: "⭐", text: "Built 20+ Projects" },
                            { icon: "🚀", text: "Internship Experience" },
                            { icon: "🧠", text: "Machine Learning & Deep Learning" },
                            { icon: "💻", text: "Strong Web Development Skills" }
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                className="highlight-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="highlight-icon">{card.icon}</div>
                                <div className="highlight-text">{card.text}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Personal Details Info Box */}
                    <motion.div
                        className="about-info-box"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            className="about-info-row"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <span className="about-info-icon">👤</span>
                            <span>Name: Dhinakaran M S</span>
                        </motion.div>

                        <motion.div
                            className="about-info-row"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <span className="about-info-icon">📧</span>
                            <span>Email: dhinakaranms123@gmail.com</span>
                        </motion.div>

                        <motion.div
                            className="about-info-row"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <span className="about-info-icon">📍</span>
                            <span>Location: Coimbatore, Tamil Nadu, India</span>
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="about-text-content">
                        <motion.p
                            className="about-text-block"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            I am a pre-final year Computer Science and Engineering student at KIT, specializing in AI and Machine Learning. I'm a passionate software developer skilled in HTML, CSS, JavaScript, and Python with interests in ML and competitive programming.
                        </motion.p>

                        <motion.p
                            className="about-text-block"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            I enjoy building practical solutions and constantly explore new technologies to expand my skill set. My journey in web development has taught me the importance of clean code, responsive design, and user-centric applications.
                        </motion.p>

                        <motion.p
                            className="about-text-block"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            I aim to contribute to impactful projects and grow as a developer through continuous learning and collaboration. Always eager to take on new challenges and expand my horizons in both frontend and backend development.
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
