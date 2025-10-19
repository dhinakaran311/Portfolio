
import React, { useState } from 'react';
import { motion } from "framer-motion";

const SkillsEditor = ({ skills, onAdd, onUpdate, onDelete }) => {
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 50,
    icon: "",
    color: "#4B8BBE",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    onAdd(newSkill);
    setNewSkill({
      name: "",
      level: 50,
      icon: "",
      color: "#4B8BBE",
    });
  };

  const handleUpdateSkill = (e) => {
    e.preventDefault();
    onUpdate(editingId, newSkill);
    setEditingId(null);
    setNewSkill({
      name: "",
      level: 50,
      icon: "",
      color: "#4B8BBE",
    });
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setNewSkill({
      name: skill.name,
      level: skill.level,
      icon: skill.icon,
      color: skill.color,
    });
  };

  return (
    <motion.div
      id="skills-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Skill" : "Add New Skill"}
      </h3>
      <form onSubmit={editingId ? handleUpdateSkill : handleAddSkill}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Skill Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Level (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-group">
            <label>Icon URL</label>
            <input
              type="url"
              value={newSkill.icon}
              onChange={(e) =>
                setNewSkill({ ...newSkill, icon: e.target.value })
              }
              className="editor-input"
              placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
              required
            />
          </div>
          <div className="editor-group">
            <label>Color</label>
            <input
              type="color"
              value={newSkill.color}
              onChange={(e) =>
                setNewSkill({ ...newSkill, color: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewSkill({
                  name: "",
                  level: 50,
                  icon: "",
                  color: "#4B8BBE",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Skills</h3>
      <div className="table-container">
        <table className="skills-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.level}%</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(skill.id)}
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

export default SkillsEditor;
