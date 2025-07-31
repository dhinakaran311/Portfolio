
import React, { useState } from 'react';
import { motion } from "framer-motion";

const CertificationsEditor = ({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    date: "",
    credential: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddCert = (e) => {
    e.preventDefault();
    onAdd(newCert);
    setNewCert({
      title: "",
      issuer: "",
      date: "",
      credential: "",
    });
  };

  const handleUpdateCert = (e) => {
    e.preventDefault();
    onUpdate(editingId, newCert);
    setEditingId(null);
    setNewCert({
      title: "",
      issuer: "",
      date: "",
      credential: "",
    });
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setNewCert({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credential: cert.credential,
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
        <div className="editor-grid">
          <div className="editor-group">
            <label>Title</label>
            <input
              type="text"
              value={newCert.title}
              onChange={(e) =>
                setNewCert({ ...newCert, title: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Issuer</label>
            <input
              type="text"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert({ ...newCert, issuer: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-group">
            <label>Date</label>
            <input
              type="text"
              value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
              className="editor-input"
              placeholder="e.g. 2023"
              required
            />
          </div>
          <div className="editor-group">
            <label>Credential (optional)</label>
            <input
              type="text"
              value={newCert.credential}
              onChange={(e) =>
                setNewCert({ ...newCert, credential: e.target.value })
              }
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewCert({
                  title: "",
                  issuer: "",
                  date: "",
                  credential: "",
                });
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.title}</td>
                <td>{cert.issuer}</td>
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
