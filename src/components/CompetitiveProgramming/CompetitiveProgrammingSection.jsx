import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode, FaTrophy, FaFire, FaStar, FaExternalLinkAlt,
  FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaLink,
  FaBolt, FaMedal, FaChartLine
} from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

/* ─── Platform config ───────────────────────────────────────────────── */
const PLATFORMS = {
  leetcode: {
    label: "LeetCode",
    Icon: SiLeetcode,
    color: "#FFA116",
    glow: "rgba(255, 161, 22, 0.35)",
    gradient: "linear-gradient(135deg, #FFA116 0%, #FF6B35 100%)",
    bg: "rgba(255, 161, 22, 0.08)",
    border: "rgba(255, 161, 22, 0.25)",
  },
  codeforces: {
    label: "Codeforces",
    Icon: SiCodeforces,
    color: "#1F8ACB",
    glow: "rgba(31, 138, 203, 0.35)",
    gradient: "linear-gradient(135deg, #1F8ACB 0%, #1565C0 100%)",
    bg: "rgba(31, 138, 203, 0.08)",
    border: "rgba(31, 138, 203, 0.25)",
  },
  codechef: {
    label: "CodeChef",
    Icon: SiCodechef,
    color: "#5B4638",
    glow: "rgba(91, 70, 56, 0.5)",
    gradient: "linear-gradient(135deg, #8D6E63 0%, #5B4638 100%)",
    bg: "rgba(139, 115, 85, 0.12)",
    border: "rgba(139, 115, 85, 0.3)",
  },
};

const EMPTY_FORM = {
  platform: "leetcode",
  username: "",
  profileUrl: "",
  rating: "",
  globalRank: "",
  problemsSolved: "",
  streak: "",
  longestStreak: "",
  badges: "",
  contestsParticipated: "",
};

/* ─── Framer variants ───────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

const statsBarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Animated counter ──────────────────────────────────────────────── */
const AnimatedNumber = ({ value }) => {
  const num = parseInt(value) || 0;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {num.toLocaleString()}
    </motion.span>
  );
};

/* ─── Platform Card ─────────────────────────────────────────────────── */
const PlatformCard = ({ entry, index, isAdmin, onEdit, onDelete }) => {
  const cfg = PLATFORMS[entry.platform] || PLATFORMS.leetcode;
  const { Icon } = cfg;
  const badges = Array.isArray(entry.badges)
    ? entry.badges
    : (entry.badges || "").split(",").map((b) => b.trim()).filter(Boolean);

  return (
    <motion.article
      className="cp-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      style={{
        "--cp-color": cfg.color,
        "--cp-glow": cfg.glow,
        "--cp-gradient": cfg.gradient,
        "--cp-bg": cfg.bg,
        "--cp-border": cfg.border,
      }}
    >
      {/* Top accent bar */}
      <div className="cp-card__accent" />

      {/* Admin actions */}
      {isAdmin && (
        <div className="cp-card__admin">
          <button
            className="cp-card__admin-btn cp-card__admin-btn--edit"
            onClick={() => onEdit(entry)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="cp-card__admin-btn cp-card__admin-btn--delete"
            onClick={() => onDelete(entry)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {/* Platform header */}
      <div className="cp-card__header">
        <div className="cp-card__icon-wrap">
          <Icon className="cp-card__icon" />
        </div>
        <div className="cp-card__platform-info">
          <h3 className="cp-card__platform-name">{cfg.label}</h3>
          {entry.username && (
            <span className="cp-card__username">@{entry.username}</span>
          )}
        </div>
        {entry.profileUrl && (
          <a
            href={entry.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cp-card__profile-link"
            title={`Visit ${cfg.label} profile`}
          >
            <FaExternalLinkAlt />
          </a>
        )}
      </div>

      {/* Stats grid */}
      <div className="cp-card__stats">
        {entry.problemsSolved && (
          <div className="cp-stat">
            <FaCode className="cp-stat__icon" />
            <div className="cp-stat__body">
              <span className="cp-stat__value">
                <AnimatedNumber value={entry.problemsSolved} />
              </span>
              <span className="cp-stat__label">Problems Solved</span>
            </div>
          </div>
        )}

        {entry.rating && (
          <div className="cp-stat">
            <FaChartLine className="cp-stat__icon" />
            <div className="cp-stat__body">
              <span className="cp-stat__value">
                <AnimatedNumber value={entry.rating} />
              </span>
              <span className="cp-stat__label">Rating</span>
            </div>
          </div>
        )}

        {entry.streak && (
          <div className="cp-stat">
            <FaFire className="cp-stat__icon cp-stat__icon--fire" />
            <div className="cp-stat__body">
              <span className="cp-stat__value">
                <AnimatedNumber value={entry.streak} />
                <span className="cp-stat__unit"> days</span>
              </span>
              <span className="cp-stat__label">Current Streak</span>
            </div>
          </div>
        )}

        {entry.longestStreak && (
          <div className="cp-stat">
            <FaBolt className="cp-stat__icon" />
            <div className="cp-stat__body">
              <span className="cp-stat__value">
                <AnimatedNumber value={entry.longestStreak} />
                <span className="cp-stat__unit"> days</span>
              </span>
              <span className="cp-stat__label">Longest Streak</span>
            </div>
          </div>
        )}

        {entry.contestsParticipated && (
          <div className="cp-stat">
            <FaTrophy className="cp-stat__icon" />
            <div className="cp-stat__body">
              <span className="cp-stat__value">
                <AnimatedNumber value={entry.contestsParticipated} />
              </span>
              <span className="cp-stat__label">Contests</span>
            </div>
          </div>
        )}

        {entry.globalRank && (
          <div className="cp-stat">
            <FaMedal className="cp-stat__icon" />
            <div className="cp-stat__body">
              <span className="cp-stat__value cp-stat__value--rank">{entry.globalRank}</span>
              <span className="cp-stat__label">Global Rank</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="cp-card__badges">
          {badges.map((badge, i) => (
            <span key={i} className="cp-badge">
              <FaStar className="cp-badge__star" />
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {entry.profileUrl && (
        <a
          href={entry.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cp-card__cta"
        >
          <FaLink /> View Profile
          <FaExternalLinkAlt className="cp-card__cta-arrow" />
        </a>
      )}
    </motion.article>
  );
};

/* ─── Edit/Add Modal Form ───────────────────────────────────────────── */
const CPForm = ({ initial = EMPTY_FORM, onSubmit, onCancel, isEditing }) => {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initial,
    badges: Array.isArray(initial.badges)
      ? initial.badges.join(", ")
      : initial.badges || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.platform) e.platform = "Platform is required";
    if (!form.username.trim()) e.username = "Username is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...form,
        badges: form.badges.split(",").map((b) => b.trim()).filter(Boolean),
      });
    }
  };

  return (
    <motion.div
      className="cp-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="cp-modal"
        initial={{ opacity: 0, y: -30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="cp-modal__header">
          <div className="cp-modal__title-row">
            <div className="cp-modal__icon-wrap">
              <FaCode />
            </div>
            <h3 className="cp-modal__title">
              {isEditing ? "Edit Platform" : "Add Platform"}
            </h3>
          </div>
          <button className="cp-modal__close" onClick={onCancel} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cp-modal__form" noValidate>
          {/* Platform select */}
          <div className={`cp-field ${errors.platform ? "cp-field--error" : ""}`}>
            <label className="cp-field__label">Platform *</label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="cp-field__select"
            >
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">Codeforces</option>
              <option value="codechef">CodeChef</option>
            </select>
            {errors.platform && <span className="cp-field__error">{errors.platform}</span>}
          </div>

          {/* Two-column row */}
          <div className="cp-field-row">
            <div className={`cp-field ${errors.username ? "cp-field--error" : ""}`}>
              <label className="cp-field__label">Username *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. dhinakaran311"
                className="cp-field__input"
              />
              {errors.username && <span className="cp-field__error">{errors.username}</span>}
            </div>
            <div className="cp-field">
              <label className="cp-field__label">Profile URL</label>
              <input
                type="url"
                name="profileUrl"
                value={form.profileUrl}
                onChange={handleChange}
                placeholder="https://leetcode.com/username"
                className="cp-field__input"
              />
            </div>
          </div>

          {/* Stats row 1 */}
          <div className="cp-field-row">
            <div className="cp-field">
              <label className="cp-field__label">Rating</label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="e.g. 1547"
                className="cp-field__input"
              />
            </div>
            <div className="cp-field">
              <label className="cp-field__label">Global Rank</label>
              <input
                type="text"
                name="globalRank"
                value={form.globalRank}
                onChange={handleChange}
                placeholder="e.g. Top 25%"
                className="cp-field__input"
              />
            </div>
          </div>

          {/* Stats row 2 */}
          <div className="cp-field-row">
            <div className="cp-field">
              <label className="cp-field__label">Problems Solved</label>
              <input
                type="number"
                name="problemsSolved"
                value={form.problemsSolved}
                onChange={handleChange}
                placeholder="e.g. 320"
                className="cp-field__input"
              />
            </div>
            <div className="cp-field">
              <label className="cp-field__label">Contests Participated</label>
              <input
                type="number"
                name="contestsParticipated"
                value={form.contestsParticipated}
                onChange={handleChange}
                placeholder="e.g. 12"
                className="cp-field__input"
              />
            </div>
          </div>

          {/* Stats row 3 */}
          <div className="cp-field-row">
            <div className="cp-field">
              <label className="cp-field__label">Current Streak (days)</label>
              <input
                type="number"
                name="streak"
                value={form.streak}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="cp-field__input"
              />
            </div>
            <div className="cp-field">
              <label className="cp-field__label">Longest Streak (days)</label>
              <input
                type="number"
                name="longestStreak"
                value={form.longestStreak}
                onChange={handleChange}
                placeholder="e.g. 42"
                className="cp-field__input"
              />
            </div>
          </div>

          {/* Badges */}
          <div className="cp-field">
            <label className="cp-field__label">
              <FaStar className="cp-field__label-icon" /> Badges (comma-separated)
            </label>
            <input
              type="text"
              name="badges"
              value={form.badges}
              onChange={handleChange}
              placeholder="e.g. 100 Days, SQL-50, Guardian"
              className="cp-field__input"
            />
          </div>

          {/* Actions */}
          <div className="cp-modal__actions">
            <button
              type="button"
              className="cp-modal__btn cp-modal__btn--cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="cp-modal__btn cp-modal__btn--submit">
              <FaCheck />
              {isEditing ? "Update Platform" : "Add Platform"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── Delete confirm dialog ─────────────────────────────────────────── */
const DeleteConfirm = ({ platform, onConfirm, onCancel }) => {
  const cfg = PLATFORMS[platform] || PLATFORMS.leetcode;
  return (
    <motion.div
      className="cp-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="cp-modal cp-modal--confirm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.22 }}
      >
        <div className="cp-confirm__icon"><FaTrash /></div>
        <h3 className="cp-confirm__title">Remove {cfg.label}?</h3>
        <p className="cp-confirm__body">
          This platform entry will be permanently deleted.
        </p>
        <div className="cp-modal__actions">
          <button className="cp-modal__btn cp-modal__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="cp-modal__btn cp-modal__btn--danger" onClick={onConfirm}>
            <FaTrash /> Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Summary stats bar ─────────────────────────────────────────────── */
const SummaryBar = ({ entries }) => {
  const totalProblems = entries.reduce(
    (sum, e) => sum + (parseInt(e.problemsSolved) || 0), 0
  );
  const totalContests = entries.reduce(
    (sum, e) => sum + (parseInt(e.contestsParticipated) || 0), 0
  );
  const activePlatforms = entries.length;

  if (totalProblems === 0 && totalContests === 0) return null;

  return (
    <motion.div
      className="cp-summary"
      variants={statsBarVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="cp-summary__item">
        <FaCode className="cp-summary__icon" />
        <div>
          <span className="cp-summary__value">{totalProblems.toLocaleString()}</span>
          <span className="cp-summary__label">Total Problems Solved</span>
        </div>
      </div>
      <div className="cp-summary__divider" />
      <div className="cp-summary__item">
        <FaTrophy className="cp-summary__icon" />
        <div>
          <span className="cp-summary__value">{totalContests}</span>
          <span className="cp-summary__label">Contests Participated</span>
        </div>
      </div>
      <div className="cp-summary__divider" />
      <div className="cp-summary__item">
        <FaBolt className="cp-summary__icon" />
        <div>
          <span className="cp-summary__value">{activePlatforms}</span>
          <span className="cp-summary__label">Active Platforms</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Section ──────────────────────────────────────────────────── */
const CompetitiveProgrammingSection = ({
  competitiveProgramming = [],
  isAdmin = false,
  addItem,
  updateItem,
  deleteItem,
  setRef,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = (formData) => {
    addItem("competitiveProgramming", formData);
    setShowForm(false);
  };

  const handleUpdate = (formData) => {
    updateItem("competitiveProgramming", editTarget.id, formData);
    setEditTarget(null);
  };

  const handleDelete = () => {
    deleteItem("competitiveProgramming", deleteTarget.id);
    setDeleteTarget(null);
  };

  const isEmpty = competitiveProgramming.length === 0;

  return (
    <section
      id="competitive"
      className="section section-bg cp-section"
      ref={(el) => setRef && setRef("competitive", el)}
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
            Competitive <span>Programming</span>
          </motion.h2>
          <div className="section-subtitle">
            Problem Solving &amp; Contest Performance
          </div>
        </div>

        {/* Summary bar */}
        {!isEmpty && <SummaryBar entries={competitiveProgramming} />}

        {/* Admin toolbar */}
        {isAdmin && (
          <motion.div
            className="cp-admin-toolbar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="cp-admin-toolbar__label">
              <FaCode /> {competitiveProgramming.length} platform
              {competitiveProgramming.length !== 1 ? "s" : ""}
            </span>
            <button className="cp-add-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Platform
            </button>
          </motion.div>
        )}

        {/* Cards grid */}
        {isEmpty && isAdmin && (
          <motion.div
            className="cp-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="cp-empty__icon"><FaCode /></div>
            <p className="cp-empty__text">No platforms yet. Add your first one!</p>
            <button className="cp-add-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Platform
            </button>
          </motion.div>
        )}

        {!isEmpty && (
          <motion.div className="cp-grid" layout>
            <AnimatePresence mode="popLayout">
              {competitiveProgramming.map((entry, idx) => (
                <PlatformCard
                  key={entry.id ?? idx}
                  entry={entry}
                  index={idx}
                  isAdmin={isAdmin}
                  onEdit={(e) => setEditTarget(e)}
                  onDelete={(e) => setDeleteTarget(e)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <CPForm
            key="add-form"
            initial={EMPTY_FORM}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isEditing={false}
          />
        )}
        {editTarget && (
          <CPForm
            key={`edit-${editTarget.id}`}
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            isEditing={true}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            key={`delete-${deleteTarget.id}`}
            platform={deleteTarget.platform}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CompetitiveProgrammingSection;
