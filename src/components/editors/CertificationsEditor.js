
import React, { useState, useRef } from 'react';
import { motion } from "framer-motion";
import { FaUpload, FaFilePdf, FaTimesCircle, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EMPTY_CERT = {
  title: "",
  issuer: "",
  date: "",
  credential: "",
  link: "",
  image: "",
  pdfUrl: "",
  category: "",
};

// Upload a file to Cloudinary using unsigned upload (no SDK needed)
// Both images and PDFs use image/upload → enables pg_1 transformation for thumbnails
// For PDF delivery, we use the f_pdf flag on the URL (see getCldPdfImage)
const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Always use image/upload: enables Cloudinary transformations on PDFs
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

// Reusable upload field component
const UploadField = ({ label, accept, icon, currentUrl, previewType, onUpload, onRemove, uploading, progress, error }) => {
  const inputRef = useRef();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await onUpload(file);
    e.target.value = '';
  };

  return (
    <div className="cert-upload-field">
      <label className="cert-upload-label">{label}</label>
      <div className="cert-upload-area">
        {uploading ? (
          <div className="cert-upload-progress">
            <FaSpinner className="cert-spinner" />
            <span>Uploading... {progress}%</span>
            <div className="cert-progress-bar">
              <div className="cert-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : currentUrl ? (
          <div className="cert-upload-preview">
            {previewType === 'image' ? (
              <img src={currentUrl} alt="Preview" className="cert-upload-img-preview" />
            ) : (
              <div className="cert-pdf-preview">
                <FaFilePdf size={28} color="#ef4444" />
                <span>PDF uploaded ✅</span>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="cert-pdf-link">
                  View PDF ↗
                </a>
              </div>
            )}
            <button type="button" onClick={onRemove} className="cert-remove-btn">
              <FaTimesCircle size={13} /> Remove
            </button>
          </div>
        ) : (
          <>
            <label className="cert-upload-btn" onClick={() => inputRef.current?.click()}>
              {icon} {previewType === 'image' ? 'Choose Image' : 'Choose PDF'}
            </label>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
      {error && <p className="cert-upload-error-text">⚠️ {error}</p>}
    </div>
  );
};

const CertificationsEditor = ({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newCert, setNewCert] = useState({ ...EMPTY_CERT });
  const [editingId, setEditingId] = useState(null);

  // Image upload state
  const [imgUploading, setImgUploading] = useState(false);
  const [imgProgress, setImgProgress] = useState(0);
  const [imgError, setImgError] = useState('');

  // PDF upload state
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfError, setPdfError] = useState('');

  const resetForm = () => {
    setNewCert({ ...EMPTY_CERT });
    setEditingId(null);
    setImgError('');
    setPdfError('');
  };

  const handleImageUpload = async (file) => {
    setImgError('');
    setImgUploading(true);
    setImgProgress(0);
    try {
      const url = await uploadToCloudinary(file, setImgProgress);
      setNewCert(prev => ({ ...prev, image: url }));
    } catch (err) {
      setImgError('Image upload failed. Check your Cloudinary preset settings.');
      console.error(err);
    } finally {
      setImgUploading(false);
    }
  };

  const handlePdfUpload = async (file) => {
    setPdfError('');
    setPdfUploading(true);
    setPdfProgress(0);
    try {
      const url = await uploadToCloudinary(file, setPdfProgress);
      setNewCert(prev => ({ ...prev, pdfUrl: url }));
    } catch (err) {
      setPdfError('PDF upload failed. Check your Cloudinary preset settings.');
      console.error(err);
    } finally {
      setPdfUploading(false);
    }
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    onAdd(newCert);
    resetForm();
  };

  const handleUpdateCert = (e) => {
    e.preventDefault();
    onUpdate(editingId, newCert);
    resetForm();
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setNewCert({
      title: cert.title || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
      credential: cert.credential || "",
      link: cert.link || "",
      image: cert.image || "",
      pdfUrl: cert.pdfUrl || "",
      category: cert.category || "",
    });
  };

  const isUploading = imgUploading || pdfUploading;

  return (
    <motion.div
      id="certifications-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Certification" : "Add New Certification"}
      </h3>

      <form onSubmit={editingId ? handleUpdateCert : handleAddCert}>
        {/* Row 1: Title + Issuer */}
        <div className="editor-grid">
          <div className="editor-group">
            <label>Title</label>
            <input type="text" value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              className="editor-input" required placeholder="e.g. AWS Certified Developer" />
          </div>
          <div className="editor-group">
            <label>Issuer</label>
            <input type="text" value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              className="editor-input" required placeholder="e.g. Amazon Web Services" />
          </div>
        </div>

        {/* Row 2: Date + Category */}
        <div className="editor-grid">
          <div className="editor-group">
            <label>Date</label>
            <input type="text" value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
              className="editor-input" placeholder="e.g. Jan 2024" required />
          </div>
          <div className="editor-group">
            <label>Category (optional)</label>
            <input type="text" value={newCert.category}
              onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
              className="editor-input" placeholder="e.g. Cloud, Frontend, Security" />
          </div>
        </div>

        {/* Row 3: Credential ID + External Link */}
        <div className="editor-grid">
          <div className="editor-group">
            <label>Credential ID (optional)</label>
            <input type="text" value={newCert.credential}
              onChange={(e) => setNewCert({ ...newCert, credential: e.target.value })}
              className="editor-input" placeholder="e.g. ABC123XYZ" />
          </div>
          <div className="editor-group">
            <label>Credential External Link (optional)</label>
            <input type="url" value={newCert.link}
              onChange={(e) => setNewCert({ ...newCert, link: e.target.value })}
              className="editor-input" placeholder="https://www.credly.com/..." />
          </div>
        </div>

        {/* Upload Row: Image + PDF via Cloudinary */}
        <div className="cert-uploads-row">
          <UploadField
            label="Certificate Image"
            accept="image/*"
            icon={<FaUpload size={13} />}
            currentUrl={newCert.image}
            previewType="image"
            onUpload={handleImageUpload}
            onRemove={() => setNewCert(p => ({ ...p, image: '' }))}
            uploading={imgUploading}
            progress={imgProgress}
            error={imgError}
          />
          <UploadField
            label="Certificate PDF"
            accept=".pdf,application/pdf"
            icon={<FaFilePdf size={13} />}
            currentUrl={newCert.pdfUrl}
            previewType="pdf"
            onUpload={handlePdfUpload}
            onRemove={() => setNewCert(p => ({ ...p, pdfUrl: '' }))}
            uploading={pdfUploading}
            progress={pdfProgress}
            error={pdfError}
          />
        </div>

        <div className="editor-actions">
          {editingId && (
            <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
          )}
          <button type="submit" className="save-btn" disabled={isUploading}>
            {isUploading ? 'Uploading...' : editingId ? "Update Certification" : "Add Certification"}
          </button>
        </div>
      </form>

      {/* Current Certs Table */}
      <h3 className="editor-title">Current Certifications</h3>
      <div className="table-container">
        <table className="certifications-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Date</th>
              <th>PDF</th>
              <th>Link</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.title}</td>
                <td>{cert.issuer}</td>
                <td>{cert.date}</td>
                <td>
                  {cert.pdfUrl
                    ? <FaCheckCircle color="#34d399" title="PDF uploaded" />
                    : <span style={{ color: '#555', fontSize: '12px' }}>—</span>}
                </td>
                <td>
                  {cert.link ? (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#818cf8', fontSize: '12px', textDecoration: 'underline' }}>
                      View ↗
                    </a>
                  ) : <span style={{ color: '#555', fontSize: '12px' }}>—</span>}
                </td>
                <td>
                  {cert.image ? (
                    <img src={cert.image} alt={cert.title}
                      style={{ width: '50px', height: '35px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #333', background: '#0d0f18' }}
                      onError={(e) => e.target.style.display = 'none'} />
                  ) : <span style={{ color: '#555', fontSize: '12px' }}>—</span>}
                </td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => handleEdit(cert)} className="edit-table-btn">Edit</button>
                    <button onClick={() => onDelete(cert.id)} className="delete-table-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CertificationsEditor;
