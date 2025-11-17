
import React, { useState } from 'react';
import { motion } from "framer-motion";

const ExperienceEditor = ({ experiences, onAdd, onUpdate, onDelete }) => {
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    duration: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Format date from month inputs to readable string
  const formatDuration = (startDate, endDate) => {
    if (!startDate) return "";
    
    const formatDate = (dateString) => {
      const date = new Date(dateString + '-01');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    
    return startDate === endDate ? start : `${start} - ${end}`;
  };

  // Handle date changes
  const handleDateChange = (field, value) => {
    setNewExp(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate duration when dates change
      if (updated.startDate || updated.endDate) {
        updated.duration = formatDuration(updated.startDate, updated.endDate);
      }
      return updated;
    });
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    onAdd(newExp);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleUpdateExp = (e) => {
    e.preventDefault();
    onUpdate(editingId, newExp);
    setEditingId(null);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setNewExp({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description,
    });
  };

  return (
    <motion.div
      id="experience-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Experience" : "Add New Experience"}
      </h3>
      <form onSubmit={editingId ? handleUpdateExp : handleAddExp}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Role</label>
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Company</label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-group">
            <label>Start Date</label>
            <input
              type="month"
              value={newExp.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>End Date (Optional)</label>
            <input
              type="month"
              value={newExp.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="editor-input"
              min={newExp.startDate}
            />
          </div>
        </div>

        <div className="editor-group">
          <label>Duration (Auto-generated)</label>
          <input
            type="text"
            value={newExp.duration}
            readOnly
            className="editor-input"
            placeholder="e.g. Jan 2023 - Present"
          />
        </div>

        <div className="editor-group">
          <label>Description</label>
          <textarea
            value={newExp.description}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            className="editor-input"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewExp({
                  role: "",
                  company: "",
                  duration: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Experiences</h3>
      <div className="table-container">
        <table className="experience-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.role}</td>
                <td>{exp.company}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
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

export default ExperienceEditor;
