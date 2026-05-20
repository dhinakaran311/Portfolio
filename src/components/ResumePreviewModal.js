import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ResumePreviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="resume-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="resume-modal-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="resume-modal-header">
          <h2 className="resume-modal-title">Resume Preview</h2>
          <button
            className="resume-modal-close"
            onClick={onClose}
            aria-label="Close resume preview"
          >
            <FaTimes />
          </button>
        </div>

        {/* Resume Content */}
        <div className="resume-modal-content">
          <iframe
            src="/documents/Dhinakaran_MS_resume.pdf"
            className="resume-preview-frame"
            title="Resume Preview"
            loading="lazy"
          />
        </div>

        {/* Download Button */}
        <div className="resume-modal-footer">
          <a
            href="/documents/Dhinakaran_MS_resume.pdf"
            download
            className="resume-download-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Resume
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumePreviewModal;
