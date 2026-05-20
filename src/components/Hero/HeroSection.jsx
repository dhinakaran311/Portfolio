import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TypeAnimation from '../TypeAnimation';

const HeroSection = ({ setRef, scrollToSection }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    return (
        <section 
            id="home" 
            className="hero-modern" 
            ref={(el) => setRef("home", el)}
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Elements */}
            <div className="hero-bg-modern">
                <div className="hero-gradient-orb orb-1"></div>
                <div className="hero-gradient-orb orb-2"></div>
                <div className="hero-gradient-orb orb-3"></div>
                <div className="hero-grid-pattern"></div>
            </div>

            <div className="container">
                <div className="hero-content-modern">
                    {/* Left Content Section */}
                    <motion.div
                        className="hero-text-section"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="hero-greeting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <span className="greeting-text">Hello, I'm</span>
                        </motion.div>

                        <motion.h1
                            className="hero-title-modern"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <span className="name-gradient">Dhinakaran</span>
                            <span className="name-suffix"> M S</span>
                        </motion.h1>

                        <motion.div
                            className="hero-role-badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        >
                            <div className="role-icon">💻</div>
                            <TypeAnimation
                                sequence={[
                                    'AI/ML Engineer',
                                    2000,
                                    'Full Stack Developer',
                                    2000,
                                    'Competitive Programmer',
                                    2000
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className="role-text"
                            />
                        </motion.div>

                        <motion.p
                            className="hero-description-modern"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            Passionate about building <span className="highlight-text">intelligent solutions</span> and exploring new technologies.
                            I specialize in creating <span className="highlight-text">seamless web experiences</span> with modern frameworks.
                        </motion.p>

                        <motion.div
                            className="hero-stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <div className="stat-item">
                                <div className="stat-number">20+</div>
                                <div className="stat-label">Projects</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">2+</div>
                                <div className="stat-label">Years Experience</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">100%</div>
                                <div className="stat-label">Dedication</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero-buttons-modern"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <motion.a
                                href="#contact"
                                className="btn-hero-primary"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("contact");
                                }}
                            >
                                <span>Get In Touch</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#projects"
                                className="btn-hero-secondary"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("projects");
                                }}
                            >
                                <span>View Work</span>
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Right Profile Image Section */}
                    <motion.div
                        className="hero-profile-section"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="profile-container-modern">
                            <div 
                                className="profile-glow-modern"
                                style={{
                                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.4), transparent 70%)`
                                }}
                            ></div>
                            <div className="profile-border-ring"></div>
                            <div className="profile-image-wrapper-modern">
                                <img
                                    src="/images/profile.png"
                                    alt="Dhinakaran"
                                    className="profile-image-modern"
                                    loading="eager"
                                />
                            </div>
                            <div className="profile-decoration decoration-1"></div>
                            <div className="profile-decoration decoration-2"></div>
                            <div className="profile-decoration decoration-3"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
