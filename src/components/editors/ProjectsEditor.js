
import React, { useState, useRef } from 'react';
import { motion } from "framer-motion";
import { FaUpload, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EMPTY_PROJECT = {
  title: "",
  description: "",
  github: "",
  live: "",
  tags: [],
  image: "",
};

// Upload image to Cloudinary via unsigned upload (no SDK)
const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
};

const ProjectsEditor = ({ projects, onAdd, onUpdate, onDelete }) => {
  const [newProject, setNewProject] = useState({ ...EMPTY_PROJECT });
  const [editingId, setEditingId] = useState(null);
  const [currentTag, setCurrentTag] = useState("");

  // Image upload state
  const [imgUploading, setImgUploading] = useState(false);
  const [imgProgress, setImgProgress] = useState(0);
  const [imgError, setImgError] = useState('');
  const inputRef = useRef();

  const resetForm = () => {
    setNewProject({ ...EMPTY_PROJECT });
    setEditingId(null);
    setImgError('');
    setCurrentTag('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgError('');
    setImgUploading(true);
    setImgProgress(0);
    try {
      const url = await uploadToCloudinary(file, setImgProgress);
      setNewProject(prev => ({ ...prev, image: url }));
    } catch (err) {
      setImgError('Image upload failed. Check Cloudinary settings.');
    } finally {
      setImgUploading(false);
      e.target.value = '';
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    onAdd(newProject);
    resetForm();
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    onUpdate(editingId, newProject);
    resetForm();
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
      setNewProject((prev) => ({ ...prev, tags: [...prev.tags, currentTag] }));
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
            <input type="text" value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="editor-input" required />
          </div>
          <div className="editor-group">
            <label>GitHub URL</label>
            <input type="url" value={newProject.github}
              onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
              className="editor-input" required />
          </div>
        </div>

        <div className="editor-group">
          <label>Description</label>
          <textarea value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="editor-input" rows="3" required />
        </div>

        <div className="editor-group">
          <label>Live Demo URL (optional)</label>
          <input type="url" value={newProject.live}
            onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
            className="editor-input" />
        </div>

        {/* Cloudinary Image Upload */}
        <div className="cert-upload-field">
          <label className="cert-upload-label">Project Screenshot / Image</label>
          <div className="cert-upload-area">
            {imgUploading ? (
              <div className="cert-upload-progress">
                <FaSpinner className="cert-spinner" />
                <span>Uploading... {imgProgress}%</span>
                <div className="cert-progress-bar">
                  <div className="cert-progress-fill" style={{ width: `${imgProgress}%` }} />
                </div>
              </div>
            ) : newProject.image ? (
              <div className="cert-upload-preview">
                <img src={newProject.image} alt="Project Preview" className="cert-upload-img-preview"
                  style={{ maxHeight: '130px' }} />
                <button type="button"
                  onClick={() => setNewProject(p => ({ ...p, image: '' }))}
                  className="cert-remove-btn">
                  <FaTimesCircle size={13} /> Remove
                </button>
              </div>
            ) : (
              <>
                <label className="cert-upload-btn" onClick={() => inputRef.current?.click()}>
                  <FaUpload size={13} /> Choose Image
                </label>
                <input ref={inputRef} type="file" accept="image/*"
                  onChange={handleImageUpload} style={{ display: 'none' }} />
              </>
            )}
          </div>
          {imgError && <p className="cert-upload-error-text">⚠️ {imgError}</p>}
        </div>

        <div className="editor-group">
          <label>Tags</label>
          <div className="tags-input">
            <input type="text" value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="editor-input" placeholder="Add a tag"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
            <button type="button" onClick={addTag} className="add-tag-btn">Add</button>
          </div>
          <div className="tags-list">
            {newProject.tags.map((tag) => (
              <div key={tag} className="tag-item">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="remove-tag">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
          )}
          <button type="submit" className="save-btn" disabled={imgUploading}>
            {imgUploading ? 'Uploading...' : editingId ? "Update Project" : "Add Project"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Projects</h3>
      <div className="table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  {project.image ? (
                    <img src={project.image} alt={project.title}
                      style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }}
                      onError={(e) => e.target.style.display = 'none'} />
                  ) : <span style={{ color: '#555', fontSize: '12px' }}>—</span>}
                </td>
                <td>{project.description.substring(0, 50)}...</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => handleEdit(project)} className="edit-table-btn">Edit</button>
                    <button onClick={() => onDelete(project.id)} className="delete-table-btn">Delete</button>
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
