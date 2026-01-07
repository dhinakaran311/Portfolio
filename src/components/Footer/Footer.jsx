import React from 'react';
import { motion } from 'framer-motion';
import {
    FaCode,
    FaGithub,
    FaLinkedin,
    FaArrowUp
} from 'react-icons/fa';
import SocialLink from '../SocialLink';

const Footer = ({ scrollToSection }) => {
    return (
        <footer className="footer">
            <div className="container">
                <motion.div
                    className="footer-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Branding Block */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon"><FaCode /></span>
                            <span className="logo-text">Dhinakaran</span>
                        </div>
                        <p className="footer-tagline">AI/ML Enthusiast & Software Developer</p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="footer-nav">
                        <h3 className="nav-title">Quick Links</h3>
                        <div className="footer-links">
                            {[
                                { id: 'home', label: 'Home' },
                                { id: 'about', label: 'About' },
                                { id: 'skills', label: 'Skills' },
                                { id: 'projects', label: 'Projects' },
                                { id: 'experience', label: 'Experience' },
                                { id: 'contact', label: 'Contact' },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="footer-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.id);
                                    }}
                                    aria-label={`Go to ${item.label} section`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* Contact & Social */}
                    <div className="footer-contact">
                        <h3 className="contact-title">Get In Touch</h3>
                        <div className="footer-socials">
                            <SocialLink
                                href="https://github.com/dhinakaran311"
                                icon={<FaGithub />}
                                label="GitHub Profile"
                                className="social-icon"
                            />
                            <SocialLink
                                href="https://www.linkedin.com/in/dhinakaran-ms-934296378/"
                                icon={<FaLinkedin />}
                                label="LinkedIn Profile"
                                className="social-icon"
                            />
                            <SocialLink
                                href="https://www.codechef.com/users/Kit23bam016"
                                icon={<FaCode />}
                                label="CodeChef Profile"
                                className="social-icon"
                            />
                        </div>
                    </div>

                    {/* Back to Top Button */}
                    <button
                        className="back-to-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                    >
                        <FaArrowUp />
                        <span>Back to Top</span>
                    </button>
                </motion.div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} Dhinakaran M.S. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
