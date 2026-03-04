import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

// Get page-1 JPG preview from a Cloudinary PDF URL (works for both image/upload and raw/upload)
const getCldPdfImage = (pdfUrl) => {
    if (!pdfUrl || !pdfUrl.includes('cloudinary.com')) return null;
    if (pdfUrl.includes('pg_1')) return pdfUrl; // already transformed
    const transform = 'pg_1,w_900,c_scale,f_jpg';
    if (pdfUrl.includes('/raw/upload/')) {
        // Convert raw resource URL to image delivery URL for transformation
        return pdfUrl
            .replace('/raw/upload/', `/image/upload/${transform}/`)
            .replace(/\.pdf$/i, '.jpg');
    }
    if (pdfUrl.includes('/image/upload/')) {
        return pdfUrl
            .replace('/image/upload/', `/image/upload/${transform}/`)
            .replace(/\.pdf$/i, '.jpg');
    }
    return null;
};


const CertificateModal = ({ selectedCertificate, setSelectedCertificate }) => {
    const cert = selectedCertificate;
    const hasPdf = cert?.pdfUrl;

    // For preview: use uploaded image, or auto-generate from PDF page 1
    const previewSrc = cert?.image || (hasPdf ? getCldPdfImage(cert.pdfUrl) : null);

    return (
        <AnimatePresence>
            {cert && (
                <motion.div
                    className="certificate-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedCertificate(null)}
                >
                    <motion.div
                        className="certificate-modal"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="certificate-modal-header">
                            <div>
                                <h3>{cert.title}</h3>
                                {cert.issuer && <p className="cert-modal-issuer">{cert.issuer}</p>}
                            </div>
                            <button
                                className="certificate-modal-close"
                                onClick={() => setSelectedCertificate(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="certificate-modal-content">
                            {previewSrc ? (
                                <img
                                    src={previewSrc}
                                    alt={cert.title}
                                    className="certificate-modal-image"
                                    style={{ objectFit: 'contain', background: '#0d0f18' }}
                                />
                            ) : (
                                <div className="cert-modal-no-preview">
                                    <span style={{ fontSize: '3rem' }}>📄</span>
                                    <span>No preview available</span>
                                </div>
                            )}

                            <div className="certificate-modal-details">
                                {cert.issuer && <p><strong>Issuer:</strong> {cert.issuer}</p>}
                                {cert.date && <p><strong>Date:</strong> {cert.date}</p>}
                                {cert.credential && <p><strong>ID:</strong> {cert.credential}</p>}

                                {/* External credential link */}
                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cert-modal-ext-link"
                                    >
                                        View Credential <FaExternalLinkAlt size={11} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CertificateModal;
