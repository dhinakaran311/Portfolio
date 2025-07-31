
import React, { useState } from 'react';
import { motion } from "framer-motion";

const ProjectsEditor = ({ projects, onAdd, onUpdate, onDelete }) => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    github: "",
    live: "",
    tags: [],
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddProject = (e) => {
    e.preventDefault();
    onAdd(newProject);
    setNewProject({
      title: "",
      description: "",
      github: "",
      live: "",
      tags: [],
      image: "",
    });
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    onUpdate(editingId, newProject);
    setEditingId(null);
    setNewProject({
      title: "",
      description: "",
      github: "",
      live: "",
      tags: [],
      image: "",
    });
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      github: project.github,
      live: project.live,
      tags: [...project.tags],
      image: project.image || "",
    });
  };

  const addTag = () => {
    if (currentTag && !newProject.tags.includes(currentTag)) {
      setNewProject((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <motion.div
      id="projects-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Project" : "Add New Project"}
      </h3>
      <form onSubmit={editingId ? handleUpdateProject : handleAddProject}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>GitHub URL</label>
            <input
              type="url"
              value={newProject.github}
              onChange={(e) =>
                setNewProject({ ...newProject, github: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-group">
          <label>Description</label>
          <textarea
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="editor-input"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="editor-group">
          <label>Live Demo URL (optional)</label>
          <input
            type="url"
            value={newProject.live}
            onChange={(e) =>
              setNewProject({ ...newProject, live: e.target.value })
            }
            className="editor-input"
          />
        </div>

        <div className="editor-group">
          <label>Image URL (optional)</label>
          <input
            type="text"
            value={newProject.image}
            onChange={(e) =>
              setNewProject({ ...newProject, image: e.target.value })
            }
            className="editor-input"
            placeholder="Paste image URL here"
          />
          {newProject.image && (
            <img
              src={newProject.image}
              alt="Preview"
              style={{
                marginTop: "10px",
                borderRadius: "8px",
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <div className="editor-group">
          <label>Tags</label>
          <div className="tags-input">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="editor-input"
              placeholder="Add a tag"
            />
            <button type="button" onClick={addTag} className="add-tag-btn">
              Add
            </button>
          </div>
          <div className="tags-list">
            {newProject.tags.map((tag) => (
              <div key={tag} className="tag-item">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewProject({
                  title: "",
                  description: "",
                  github: "",
                  live: "",
                  tags: [],
                  image: "",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Projects</h3>
      <div className="table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description.substring(0, 50)}...</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(project)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
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

export default ProjectsEditor;
