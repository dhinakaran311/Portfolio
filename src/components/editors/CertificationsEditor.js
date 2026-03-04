
import React, { useState } from 'react';
import { motion } from "framer-motion";

const EMPTY_CERT = {
  title: "",
  issuer: "",
  date: "",
  credential: "",
  link: "",
  image: "",
  category: "",
};

const CertificationsEditor = ({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newCert, setNewCert] = useState({ ...EMPTY_CERT });
  const [editingId, setEditingId] = useState(null);

  const handleAddCert = (e) => {
    e.preventDefault();
    onAdd(newCert);
    setNewCert({ ...EMPTY_CERT });
  };

  const handleUpdateCert = (e) => {
    e.preventDefault();
    onUpdate(editingId, newCert);
    setEditingId(null);
    setNewCert({ ...EMPTY_CERT });
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
      category: cert.category || "",
    });
  };

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
            <input
              type="text"
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              className="editor-input"
              required
              placeholder="e.g. AWS Certified Developer"
            />
          </div>
          <div className="editor-group">
            <label>Issuer</label>
            <input
              type="text"
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              className="editor-input"
              required
              placeholder="e.g. Amazon Web Services"
            />
          </div>
        </div>

        {/* Row 2: Date + Category */}
        <div className="editor-grid">
          <div className="editor-group">
            <label>Date</label>
            <input
              type="text"
              value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
              className="editor-input"
              placeholder="e.g. Jan 2024"
              required
            />
          </div>
          <div className="editor-group">
            <label>Category (optional)</label>
            <input
              type="text"
              value={newCert.category}
              onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
              className="editor-input"
              placeholder="e.g. Cloud, Frontend, Security"
            />
          </div>
        </div>

        {/* Row 3: Credential ID + External Link */}
        <div className="editor-grid">
          <div className="editor-group">
            <label>Credential ID (optional)</label>
            <input
              type="text"
              value={newCert.credential}
              onChange={(e) => setNewCert({ ...newCert, credential: e.target.value })}
              className="editor-input"
              placeholder="e.g. ABC123XYZ"
            />
          </div>
          <div className="editor-group">
            <label>Credential External Link (optional)</label>
            <input
              type="url"
              value={newCert.link}
              onChange={(e) => setNewCert({ ...newCert, link: e.target.value })}
              className="editor-input"
              placeholder="https://www.credly.com/..."
            />
          </div>
        </div>

        {/* Certificate Image URL */}
        <div className="editor-group">
          <label>Certificate Image URL (optional)</label>
          <input
            type="url"
            value={newCert.image}
            onChange={(e) => setNewCert({ ...newCert, image: e.target.value })}
            className="editor-input"
            placeholder="Paste certificate image URL here"
          />
          {newCert.image && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={newCert.image}
                alt="Certificate Preview"
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  border: "2px solid #6366f1",
                  background: "#0d0f18",
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', color: '#ef4444', fontSize: '14px', marginTop: '5px' }}>
                ❌ Invalid image URL
              </div>
            </div>
          )}
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewCert({ ...EMPTY_CERT });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Certification" : "Add Certification"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Certifications</h3>
      <div className="table-container">
        <table className="certifications-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Date</th>
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
                  {cert.link ? (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#818cf8', fontSize: '12px', textDecoration: 'underline' }}
                    >
                      View Link ↗
                    </a>
                  ) : (
                    <span style={{ color: '#666', fontSize: '12px' }}>No link</span>
                  )}
                </td>
                <td>
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      style={{
                        width: '50px',
                        height: '35px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        background: '#0d0f18',
                      }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <span style={{ color: '#666', fontSize: '12px' }}>No image</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(cert.id)}
                      className="delete-table-btn"
                    >
                      Delete
                    </button>
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
