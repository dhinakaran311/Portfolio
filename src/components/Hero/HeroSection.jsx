import React from 'react';
import { motion } from 'framer-motion';
import TypeAnimation from '../TypeAnimation';

const HeroSection = ({ setRef, scrollToSection }) => {
    return (
        <section id="home" className="hero" ref={(el) => setRef("home", el)}>
            <div className="hero-bg">
                <div className="hero-orb orb-1"></div>
                <div className="hero-orb orb-2"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="hero-glass"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h1
                            className="hero-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Hi, I'm <span className="gradient-text">Dhinakaran</span>
                        </motion.h1>

                        <motion.div
                            className="hero-badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <TypeAnimation
                                sequence={[
                                    'AI/ML Engineer',
                                    1500,
                                    'Full Stack Developer',
                                    1500,
                                    'Competitive Programmer',
                                    1500
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </motion.div>

                        <motion.p
                            className="hero-description"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Passionate about building intelligent solutions and exploring new technologies.
                            I specialize in creating seamless web experiences with modern technologies.
                        </motion.p>

                        <motion.div
                            className="hero-buttons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <motion.a
                                href="#contact"
                                className="btn-primary"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 5px 20px rgba(99, 102, 241, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("contact");
                                }}
                            >
                                Contact Me
                            </motion.a>
                            <motion.a
                                href="#projects"
                                className="btn-secondary"
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("projects");
                                }}
                            >
                                View Projects
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="profile-image-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                    >
                        <div className="profile-glow"></div>
                        <div className="profile-image-wrapper">
                            <img
                                src="/images/profile.jpeg"
                                alt="Dhinakaran"
                                className="profile-image"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
