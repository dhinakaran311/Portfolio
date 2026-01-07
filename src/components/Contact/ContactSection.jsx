import React from 'react';
import { motion } from 'framer-motion';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGithub,
    FaLinkedin,
    FaCode
} from 'react-icons/fa';
import ContactItem from '../ContactItem';
import SocialLink from '../SocialLink';

const ContactSection = ({
    setRef,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting
}) => {
    return (
        <section
            id="contact"
            className="section"
            ref={(el) => setRef("contact", el)}
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
                        Get In <span>Touch</span>
                    </motion.h2>
                    <div className="section-subtitle">Let's work together</div>
                </div>
                <div className="contact-container">
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3>Contact Information</h3>
                        <div className="contact-items">
                            <ContactItem
                                icon={<FaEnvelope />}
                                title="Email"
                                content="dhinakaranms123@gmail.com"
                            />
                            <ContactItem
                                icon={<FaPhone />}
                                title="Phone"
                                content="+91 7708846581"
                            />
                            <ContactItem
                                icon={<FaMapMarkerAlt />}
                                title="Location"
                                content="Coimbatore, Tamil Nadu, India"
                            />
                        </div>
                        <h3>Connect With Me</h3>
                        <div className="social-links">
                            <SocialLink
                                href="https://github.com/dhinakaran311"
                                icon={<FaGithub />}
                                label="GitHub"
                            />
                            <SocialLink
                                href="https://www.linkedin.com/in/dhinakaran-ms-934296378/"
                                icon={<FaLinkedin />}
                                label="LinkedIn"
                            />
                            <SocialLink
                                href="https://www.codechef.com/users/Kit23bam016"
                                icon={<FaCode />}
                                label="CodeChef"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        className="contact-form-container"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                            <h3>Send Me a Message</h3>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", { required: "Name is required" })}
                                    className="form-control"
                                    placeholder="Your Name"
                                />
                                {errors.name && (
                                    <p className="error-message">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="form-control"
                                    placeholder="Your Email"
                                />
                                {errors.email && (
                                    <p className="error-message">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    {...register("message", {
                                        required: "Message is required",
                                    })}
                                    className="form-control"
                                    placeholder="Your Message"
                                    rows="5"
                                ></textarea>
                                {errors.message && (
                                    <p className="error-message">{errors.message.message}</p>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                className="submit-btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
