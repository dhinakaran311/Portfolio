import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import CertificationsEditor from '../editors/CertificationsEditor';

// Auto-generate a JPG thumbnail of page 1 from a Cloudinary PDF URL
const getCldPdfThumbnail = (pdfUrl) => {
    if (!pdfUrl || !pdfUrl.includes('cloudinary.com')) return null;
    if (pdfUrl.includes('pg_1')) return pdfUrl;
    const transform = 'pg_1,w_600,c_scale,f_jpg';
    // raw/upload → convert to image delivery with pg_1 transformation
    if (pdfUrl.includes('/raw/upload/')) {
        return pdfUrl
            .replace('/raw/upload/', `/image/upload/${transform}/`)
            .replace(/\.pdf$/i, '.jpg');
    }
    // image/upload → insert pg_1 transformation
    if (pdfUrl.includes('/image/upload/')) {
        return pdfUrl
            .replace('/image/upload/', `/image/upload/${transform}/`)
            .replace(/\.pdf$/i, '.jpg');
    }
    return null;
};

const CATEGORY_COLORS = {
    Cloud: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.35)' },
    Frontend: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
    Backend: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16,185,129,0.35)' },
    Architecture: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251,146,60,0.35)' },
    Security: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239,68,68,0.35)' },
    Default: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99,102,241,0.35)' },
};

const sanitizeUrl = (url) => {
    if (!url) return '';
    return url.replace(/\s+/g, '');
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

                        {/* Use uploaded image, OR auto-thumbnail from PDF, OR placeholder */}
                        {(cert.image || getCldPdfThumbnail(cert.pdfUrl)) ? (
                            <img
                                src={cert.image || getCldPdfThumbnail(cert.pdfUrl)}
                                alt={cert.title}
                                className="cert-thumbnail-img"
                                onError={(e) => {
                                    // If auto-thumbnail fails, show PDF icon fallback
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}

                        {/* Fallback placeholder: shown only after image error or no source */}
                        <div
                            className="cert-thumbnail-pdf-placeholder"
                            style={{ display: (cert.image || cert.pdfUrl) ? 'none' : 'flex' }}
                        >
                            <FaFilePdf size={40} color="#ef4444" />
                            <span>Certificate PDF</span>
                        </div>

                        <div className="cert-thumbnail-overlay">
                            <span>{cert.pdfUrl ? 'View PDF' : 'View Full Size'}</span>
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
                        {cert.link && sanitizeUrl(cert.link) ? (
                            <a
                                href={sanitizeUrl(cert.link)}
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
