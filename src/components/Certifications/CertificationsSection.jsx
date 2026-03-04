import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import CertificationsEditor from '../editors/CertificationsEditor';

const CATEGORY_COLORS = {
    Cloud: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.35)' },
    Frontend: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
    Backend: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16,185,129,0.35)' },
    Architecture: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251,146,60,0.35)' },
    Security: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239,68,68,0.35)' },
    Default: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99,102,241,0.35)' },
};

const getCategory = (cert) => {
    if (!cert.category) return 'Default';
    return CATEGORY_COLORS[cert.category] ? cert.category : 'Default';
};

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
        if (!certifications || !Array.isArray(certifications)) return null;

        return certifications.map((cert, index) => {
            const cat = getCategory(cert);
            const catStyle = CATEGORY_COLORS[cat];

            return (
                <motion.div
                    key={cert.id}
                    className="cert-card-premium"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                    {/* Verified Badge */}
                    <div className="cert-verified-badge">
                        <FaCheckCircle size={10} />
                        <span>Verified</span>
                    </div>

                    {/* Thumbnail */}
                    <div
                        className="cert-thumbnail"
                        onClick={() => setSelectedCertificate(cert)}
                    >
                        <div className="cert-thumbnail-shimmer" />
                        <img
                            src={cert.image || `/images/cert-${(cert.id % 3) + 1}.jpg`}
                            alt={cert.title}
                            className="cert-thumbnail-img"
                            onError={(e) => {
                                e.target.src = `/images/cert-${(cert.id % 3) + 1}.jpg`;
                            }}
                        />
                        <div className="cert-thumbnail-overlay">
                            <span>View Full Size</span>
                        </div>

                        {/* Category chip bottom-left */}
                        <div
                            className="cert-category-chip"
                            style={{
                                background: catStyle.bg,
                                color: catStyle.text,
                                border: `1px solid ${catStyle.border}`,
                            }}
                        >
                            {cert.category || 'General'}
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="cert-body">
                        <h3 className="cert-title">{cert.title}</h3>

                        <div className="cert-meta-row">
                            <span className="cert-issuer">{cert.issuer}</span>
                            {cert.date && (
                                <span className="cert-date-pill">{cert.date}</span>
                            )}
                        </div>

                        {cert.credential && (
                            <p className="cert-credential-id">ID: {cert.credential}</p>
                        )}

                        {/* View Credential button */}
                        {cert.link ? (
                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cert-credential-btn"
                            >
                                View Credential <FaExternalLinkAlt size={11} />
                            </a>
                        ) : (
                            <button className="cert-credential-btn cert-credential-btn--disabled" disabled>
                                View Credential <FaExternalLinkAlt size={11} />
                            </button>
                        )}
                    </div>
                </motion.div>
            );
        });
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
                    <div className="section-subtitle">Professional credentials &amp; achievements</div>
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

                <div className="certifications-grid-premium">
                    {renderCertifications()}
                </div>
            </div>
        </section>
    );
};

export default CertificationsSection;
