import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy, FaMedal, FaStar, FaLink, FaExternalLinkAlt,
  FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaCalendarAlt,
  FaUpload, FaTimesCircle, FaSpinner
} from "react-icons/fa";

/* ─── Constants ─────────────────────────────────────────────────────── */
const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TROPHY_ICONS = [FaTrophy, FaMedal, FaStar];
const MONTHS = MONTH_ORDER;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

const CLOUD_NAME    = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EMPTY_FORM = {
  title: "", description: "", month: "", year: "", issuer: "", link: "", image: ""
};

/* ─── Cloudinary upload helper ──────────────────────────────────────── */
const uploadToCloudinary = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText).secure_url);
      else reject(new Error("Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });

/* ─── Animated background orbs ─────────────────────────────────────── */
const Orbs = () => (
  <div className="ach-orbs" aria-hidden="true">
    <div className="ach-orb ach-orb--purple" />
    <div className="ach-orb ach-orb--cyan" />
    <div className="ach-orb ach-orb--pink" />
  </div>
);

/* ─── Card entrance animation ───────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } },
};

/* ─── Achievement Form (Add / Edit modal) ───────────────────────────── */
const AchievementForm = ({ initial = EMPTY_FORM, onSubmit, onCancel, isEditing }) => {
  const [form, setForm]     = useState(initial);
  const [errors, setErrors] = useState({});

  /* image upload state */
  const [imgUploading, setImgUploading] = useState(false);
  const [imgProgress,  setImgProgress]  = useState(0);
  const [imgError,     setImgError]     = useState("");
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.month)              e.month       = "Month is required";
    if (!form.year)               e.year        = "Year is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imgUploading && validate()) onSubmit(form);
  };

  /* ── Cloudinary upload ── */
  const doUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setImgError("Please select a valid image file.");
      return;
    }
    setImgError("");
    setImgUploading(true);
    setImgProgress(0);
    try {
      const url = await uploadToCloudinary(file, setImgProgress);
      setForm(prev => ({ ...prev, image: url }));
    } catch {
      setImgError("Upload failed. Check Cloudinary settings.");
    } finally {
      setImgUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInput  = (e) => doUpload(e.target.files[0]);
  const handleDrop       = (e) => { e.preventDefault(); setDragOver(false); doUpload(e.dataTransfer.files[0]); };
  const handleDragOver   = (e) => { e.preventDefault(); setDragOver(true);  };
  const handleDragLeave  = ()  => setDragOver(false);
  const removeImage      = ()  => { setForm(prev => ({ ...prev, image: "" })); setImgError(""); };

  return (
    <motion.div
      className="ach-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="ach-modal"
        initial={{ opacity: 0, y: -30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Modal header */}
        <div className="ach-modal__header">
          <div className="ach-modal__title-row">
            <div className="ach-modal__icon-wrap"><FaTrophy /></div>
            <h3 className="ach-modal__title">
              {isEditing ? "Edit Achievement" : "Add Achievement"}
            </h3>
          </div>
          <button className="ach-modal__close" onClick={onCancel} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ach-modal__form" noValidate>

          {/* ── IMAGE UPLOAD — top of form ── */}
          <div className="ach-field">
            <label className="ach-field__label">
              <FaUpload className="ach-field__label-icon" /> Achievement Image
            </label>

            {/* Show preview when image is set */}
            {form.image && !imgUploading ? (
              <div className="ach-upload__preview">
                <img
                  src={form.image}
                  alt="Achievement preview"
                  className="ach-upload__preview-img"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="ach-upload__preview-overlay">
                  <button
                    type="button"
                    className="ach-upload__remove-btn"
                    onClick={removeImage}
                    title="Remove image"
                  >
                    <FaTimesCircle /> Remove
                  </button>
                  <button
                    type="button"
                    className="ach-upload__change-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change image"
                  >
                    <FaUpload /> Change
                  </button>
                </div>
              </div>
            ) : imgUploading ? (
              /* Upload progress */
              <div className="ach-upload__progress">
                <FaSpinner className="ach-upload__spinner" />
                <span className="ach-upload__progress-text">Uploading… {imgProgress}%</span>
                <div className="ach-upload__progress-bar">
                  <div
                    className="ach-upload__progress-fill"
                    style={{ width: `${imgProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Drop zone */
              <div
                className={`ach-upload__zone ${dragOver ? "ach-upload__zone--active" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                aria-label="Upload image"
              >
                <FaUpload className="ach-upload__zone-icon" />
                <p className="ach-upload__zone-text">
                  <span className="ach-upload__zone-cta">Click to upload</span> or drag &amp; drop
                </p>
                <p className="ach-upload__zone-hint">PNG, JPG, WEBP (max 10 MB)</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />

            {imgError && <span className="ach-field__error">⚠ {imgError}</span>}
          </div>

          {/* Divider */}
          <div className="ach-form__divider" />

          {/* Title */}
          <div className={`ach-field ${errors.title ? "ach-field--error" : ""}`}>
            <label className="ach-field__label">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 1st Place — National Hackathon"
              className="ach-field__input"
            />
            {errors.title && <span className="ach-field__error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className={`ach-field ${errors.description ? "ach-field--error" : ""}`}>
            <label className="ach-field__label">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the achievement and its significance…"
              className="ach-field__textarea"
              rows={3}
            />
            {errors.description && <span className="ach-field__error">{errors.description}</span>}
          </div>

          {/* Month + Year row */}
          <div className="ach-field-row">
            <div className={`ach-field ${errors.month ? "ach-field--error" : ""}`}>
              <label className="ach-field__label">
                <FaCalendarAlt className="ach-field__label-icon" /> Month *
              </label>
              <select name="month" value={form.month} onChange={handleChange} className="ach-field__select">
                <option value="">Select month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.month && <span className="ach-field__error">{errors.month}</span>}
            </div>
            <div className={`ach-field ${errors.year ? "ach-field--error" : ""}`}>
              <label className="ach-field__label">Year *</label>
              <select name="year" value={form.year} onChange={handleChange} className="ach-field__select">
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <span className="ach-field__error">{errors.year}</span>}
            </div>
          </div>

          {/* Issuer */}
          <div className="ach-field">
            <label className="ach-field__label">Issuing Organization</label>
            <input
              type="text"
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. Google, IEEE, HackerEarth…"
              className="ach-field__input"
            />
          </div>

          {/* Proof URL */}
          <div className="ach-field">
            <label className="ach-field__label">
              <FaLink className="ach-field__label-icon" /> Proof URL
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://…"
              className="ach-field__input"
            />
          </div>

          {/* Actions */}
          <div className="ach-modal__actions">
            <button type="button" className="ach-modal__btn ach-modal__btn--cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="ach-modal__btn ach-modal__btn--submit"
              disabled={imgUploading}
            >
              {imgUploading ? <FaSpinner className="ach-upload__spinner" /> : <FaCheck />}
              {imgUploading ? "Uploading…" : isEditing ? "Update Achievement" : "Add Achievement"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── Delete confirmation dialog ────────────────────────────────────── */
const DeleteConfirm = ({ title, onConfirm, onCancel }) => (
  <motion.div
    className="ach-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={(e) => e.target === e.currentTarget && onCancel()}
  >
    <motion.div
      className="ach-modal ach-modal--confirm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.22 }}
    >
      <div className="ach-confirm__icon">
        <FaTrash />
      </div>
      <h3 className="ach-confirm__title">Delete Achievement?</h3>
      <p className="ach-confirm__body">
        "<strong>{title}</strong>" will be permanently removed.
      </p>
      <div className="ach-modal__actions">
        <button className="ach-modal__btn ach-modal__btn--cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="ach-modal__btn ach-modal__btn--danger" onClick={onConfirm}>
          <FaTrash /> Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Individual achievement card ───────────────────────────────────── */
const AchievementCard = ({ ach, index, isAdmin, onEdit, onDelete }) => {
  const Icon = TROPHY_ICONS[index % TROPHY_ICONS.length];
  const rankNum = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className={`ach-card ach-card--${index === 0 ? "featured" : "regular"}`}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ scale: 1.025, transition: { duration: 0.22 } }}
      layout
    >
      {/* Gradient ghost border */}
      <div className="ach-card__border" aria-hidden="true" />

      {/* Admin action buttons — top-right overlay */}
      {isAdmin && (
        <div className="ach-card__admin-actions">
          <button
            className="ach-card__admin-btn ach-card__admin-btn--edit"
            onClick={() => onEdit(ach)}
            aria-label="Edit achievement"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="ach-card__admin-btn ach-card__admin-btn--delete"
            onClick={() => onDelete(ach)}
            aria-label="Delete achievement"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {/* ── Image at the TOP of the card ── */}
      {ach.image && (
        <div className="ach-card__img-wrap">
          <img src={ach.image} alt={ach.title} className="ach-card__img" loading="lazy" />
          {/* date badge overlaid on the image */}
          {(ach.month || ach.year) && (
            <span className="ach-card__date ach-card__date--overlay">
              {ach.month} {ach.year}
            </span>
          )}
        </div>
      )}

      {/* Card header row (shown when there is NO image, keeps icon + date visible) */}
      {!ach.image && (
        <div className="ach-card__header">
          <div className="ach-card__icon-wrap">
            <Icon className="ach-card__icon" />
          </div>
          {(ach.month || ach.year) && (
            <span className="ach-card__date">{ach.month} {ach.year}</span>
          )}
        </div>
      )}

      {/* When image IS present, show icon inline with title row */}
      {ach.image && (
        <div className="ach-card__meta-row">
          <div className="ach-card__icon-wrap ach-card__icon-wrap--sm">
            <Icon className="ach-card__icon" />
          </div>
          <span className="ach-card__rank" aria-label={`Achievement number ${rankNum}`}>
            #{rankNum}
          </span>
        </div>
      )}

      {/* Rank (no-image variant) */}
      {!ach.image && (
        <span className="ach-card__rank" aria-label={`Achievement number ${rankNum}`}>
          #{rankNum}
        </span>
      )}

      {/* Title */}
      <h3 className="ach-card__title">{ach.title}</h3>

      {/* Issuer chip */}
      {ach.issuer && <span className="ach-card__issuer">{ach.issuer}</span>}

      {/* Description */}
      {ach.description && <p className="ach-card__desc">{ach.description}</p>}

      {/* View Proof link */}
      {ach.link && (
        <a
          href={ach.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ach-card__proof-btn"
        >
          <FaLink className="ach-card__proof-icon" />
          View Proof
          <FaExternalLinkAlt className="ach-card__proof-arrow" />
        </a>
      )}
    </motion.article>
  );
};

/* ─── Empty state (admin only) ──────────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
  <motion.div
    className="ach-empty"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="ach-empty__icon"><FaTrophy /></div>
    <p className="ach-empty__text">No achievements yet. Add your first one!</p>
    <button className="ach-add-btn" onClick={onAdd}>
      <FaPlus /> Add Achievement
    </button>
  </motion.div>
);

/* ─── Main Section ──────────────────────────────────────────────────── */
const AchievementsSection = ({
  achievements = [],
  isAdmin = false,
  addItem,
  updateItem,
  deleteItem,
  setRef,
}) => {
  const [showForm, setShowForm]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);   // achievement being edited
  const [deleteTarget, setDeleteTarget] = useState(null); // achievement pending delete

  /* ── CRUD handlers ── */
  const handleAdd = (formData) => {
    addItem("achievements", formData);
    setShowForm(false);
  };

  const handleUpdate = (formData) => {
    updateItem("achievements", editTarget.id, formData);
    setEditTarget(null);
  };

  const handleDelete = () => {
    deleteItem("achievements", deleteTarget.id);
    setDeleteTarget(null);
  };

  /* ── Sort by date descending ── */
  const sorted = [...achievements].sort((a, b) => {
    const yearDiff = (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
    if (yearDiff !== 0) return yearDiff;
    return MONTH_ORDER.indexOf(b.month) - MONTH_ORDER.indexOf(a.month);
  });

  const isEmpty = sorted.length === 0;

  return (
    <section
      id="achievements"
      className="section section-bg"
      ref={(el) => setRef && setRef("achievements", el)}
    >
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My <span>Achievements</span>
          </motion.h2>
          <div className="section-subtitle">Competitions &amp; Awards</div>
        </div>

        {/* Admin toolbar */}
        {isAdmin && (
          <motion.div
            className="ach-admin-toolbar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="ach-admin-toolbar__label">
              <FaTrophy /> {sorted.length} achievement{sorted.length !== 1 ? "s" : ""}
            </span>
            <button className="ach-add-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Achievement
            </button>
          </motion.div>
        )}

        {/* Nebula wrapper */}
        <div className="achievements-nebula">
          <Orbs />

          {/* Empty state */}
          {isEmpty && isAdmin && <EmptyState onAdd={() => setShowForm(true)} />}
          {isEmpty && !isAdmin && null}

          {/* Bento grid */}
          {!isEmpty && (
            <motion.div className="ach-grid" layout>
              <AnimatePresence mode="popLayout">
                {sorted.map((ach, idx) => (
                  <AchievementCard
                    key={ach.id ?? idx}
                    ach={ach}
                    index={idx}
                    isAdmin={isAdmin}
                    onEdit={(a) => setEditTarget(a)}
                    onDelete={(a) => setDeleteTarget(a)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* CTA — visible to public only */}
          {!isEmpty && !isAdmin && (
            <motion.div
              className="ach-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#achievements"
                className="ach-cta__btn"
                onClick={(e) => e.preventDefault()}
              >
                <span>View All Achievements</span>
                <FaExternalLinkAlt className="ach-cta__arrow" />
              </a>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Modals (portalled via AnimatePresence) ── */}
      <AnimatePresence>
        {showForm && (
          <AchievementForm
            key="add-form"
            initial={EMPTY_FORM}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isEditing={false}
          />
        )}

        {editTarget && (
          <AchievementForm
            key={`edit-${editTarget.id}`}
            initial={{
              title:       editTarget.title       || "",
              description: editTarget.description || "",
              month:       editTarget.month       || "",
              year:        editTarget.year        || "",
              issuer:      editTarget.issuer      || "",
              link:        editTarget.link        || "",
              image:       editTarget.image       || "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            isEditing={true}
          />
        )}

        {deleteTarget && (
          <DeleteConfirm
            key={`delete-${deleteTarget.id}`}
            title={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsSection;
