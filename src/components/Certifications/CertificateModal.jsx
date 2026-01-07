import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const CertificateModal = ({ selectedCertificate, setSelectedCertificate }) => {
    return (
        <AnimatePresence>
            {selectedCertificate && (
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
                        <div className="certificate-modal-header">
                            <h3>{selectedCertificate.title}</h3>
                            <button
                                className="certificate-modal-close"
                                onClick={() => setSelectedCertificate(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="certificate-modal-content">
                            <img
                                src={selectedCertificate.image || `/images/cert-${(selectedCertificate.id % 3) + 1}.jpg`}
                                alt={selectedCertificate.title}
                                className="certificate-modal-image"
                            />
                            <div className="certificate-modal-details">
                                <p><strong>Issuer:</strong> {selectedCertificate.issuer}</p>
                                <p><strong>Date:</strong> {selectedCertificate.date}</p>
                                {selectedCertificate.credential && (
                                    <p><strong>Credential:</strong> {selectedCertificate.credential}</p>
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
