import React, { useState } from "react";
import { FaCalendarAlt, FaLink, FaImage, FaTrophy, FaCheck, FaEdit, FaTrash } from "react-icons/fa";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

const AchievementsEditor = ({ achievements = [], onAdd, onUpdate, onDelete }) => {
  console.log('AchievementsEditor received achievements:', achievements);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: "",
    year: "",
    issuer: "",
    link: "",
    image: ""
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.year) newErrors.year = 'Year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing && editingId) {
      onUpdate(editingId, formData);
      setIsEditing(false);
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    
    // Reset form
    setFormData({ 
      title: "", 
      description: "", 
      month: "", 
      year: "", 
      issuer: "", 
      link: "", 
      image: "" 
    });
  };

  const handleEdit = (achievement) => {
    setFormData({
      title: achievement.title || "",
      description: achievement.description || "",
      month: achievement.month || "",
      year: achievement.year || "",
      issuer: achievement.issuer || "",
      link: achievement.link || "",
      image: achievement.image || ""
    });
    setIsEditing(true);
    setEditingId(achievement.id);
  };

  const handleCancel = () => {
    setFormData({ 
      title: "", 
      description: "", 
      month: "", 
      year: "", 
      issuer: "", 
      link: "", 
      image: "" 
    });
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3><FaTrophy className="icon" /> {isEditing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="editor-form">
        <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
          <input 
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Achievement Title"
            className="form-input"
            required
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your achievement and its significance"
            className="form-textarea"
            rows="3"
            required
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.month ? 'has-error' : ''}`} style={{ flex: 1 }}>
            <div className="select-wrapper">
              <FaCalendarAlt className="input-icon" />
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            {errors.month && <span className="error-message">{errors.month}</span>}
          </div>

          <div className={`form-group ${errors.year ? 'has-error' : ''}`} style={{ flex: 1 }}>
            <div className="select-wrapper">
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errors.year && <span className="error-message">{errors.year}</span>}
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="Issuing Organization (optional)"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <FaLink className="input-icon" />
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Proof URL (optional)"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <FaImage className="input-icon" />
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL (optional)"
              className="form-input"
            />
          </div>
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FaCheck /> {isEditing ? 'Update' : 'Add'} Achievement
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {achievements.length > 0 && (
        <div className="achievements-list">
          <h4>Your Achievements ({achievements.length})</h4>
          <div className="achievements-grid">
            {achievements.map(ach => (
              <div key={ach.id} className="achievement-item">
                <div className="achievement-content">
                  <h5>{ach.title}</h5>
                  <p className="achievement-meta">
                    {ach.month} {ach.year} {ach.issuer && `• ${ach.issuer}`}
                  </p>
                </div>
                <div className="achievement-actions">
                  <button 
                    onClick={() => handleEdit(ach)}
                    className="btn-icon"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => onDelete(ach.id)}
                    className="btn-icon danger"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsEditor;
