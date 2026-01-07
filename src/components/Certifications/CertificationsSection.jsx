import React from 'react';
import { motion } from 'framer-motion';
import CertificationsEditor from '../editors/CertificationsEditor';

const CertificationsSection = ({
    certifications,
    isAdmin,
    setSelectedCertificate,
    addItem,
    updateItem,
    deleteItem,
    setRef
}) => {
    const renderCertifications = () => {
        if (!certifications || !Array.isArray(certifications))
            return null;
        return certifications.map((cert, index) => (
            <motion.div
                key={cert.id}
                className="certification-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
            >
                <div
                    className="certification-image-container"
                    onClick={() => setSelectedCertificate(cert)}
                >
                    <div className="certification-image-bg"></div>
                    <img
                        src={cert.image || `/images/cert-${(cert.id % 3) + 1}.jpg`}
                        alt={cert.title}
                        className="certification-image"
                        onError={(e) => {
                            e.target.src = `/images/cert-${(cert.id % 3) + 1}.jpg`;
                        }}
                    />
                    <div className="certification-overlay">
                        <span>Click to view full size</span>
                    </div>
                </div>
                <div className="certification-content">
                    <h3 className="certification-title">{cert.title}</h3>
                    <p className="certification-meta">Issuer: {cert.issuer}</p>
                    <p className="certification-meta">Date: {cert.date}</p>
                    {cert.credential && (
                        <p className="certification-credential">{cert.credential}</p>
                    )}
                </div>
            </motion.div>
        ));
    };

    return (
        <section
            id="certifications"
            className="section section-bg"
            ref={(el) => setRef("certifications", el)}
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
                        My <span>Certifications</span>
                    </motion.h2>
                    <div className="section-subtitle">My professional achievements</div>
                </div>

                {isAdmin && (
                    <CertificationsEditor
                        certifications={certifications}
                        onAdd={(newCert) => addItem("certifications", newCert)}
                        onUpdate={(id, updatedCert) =>
                            updateItem("certifications", id, updatedCert)
                        }
                        onDelete={(id) => deleteItem("certifications", id)}
                    />
                )}

                <div className="certifications-grid">{renderCertifications()}</div>
            </div>
        </section>
    );
};

export default CertificationsSection;
