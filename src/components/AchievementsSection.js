import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaLink, FaMedal, FaStar, FaExternalLinkAlt } from "react-icons/fa";

const monthOrder = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

/* ─── trophy icon picks ─── */
const TROPHY_ICONS = [FaTrophy, FaMedal, FaStar];

/* ─── card entrance animation ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Animated background orbs ─── */
const Orbs = () => (
  <div className="ach-orbs" aria-hidden="true">
    <div className="ach-orb ach-orb--purple" />
    <div className="ach-orb ach-orb--cyan" />
    <div className="ach-orb ach-orb--pink" />
  </div>
);

/* ─── Individual achievement card ─── */
const AchievementCard = ({ ach, index }) => {
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
    >
      {/* Gradient ghost border overlay */}
      <div className="ach-card__border" aria-hidden="true" />

      {/* Card header row */}
      <div className="ach-card__header">
        {/* Icon badge */}
        <div className="ach-card__icon-wrap">
          <Icon className="ach-card__icon" />
        </div>

        {/* Date badge top-right */}
        {(ach.month || ach.year) && (
          <span className="ach-card__date">
            {ach.month} {ach.year}
          </span>
        )}
      </div>

      {/* Rank number */}
      <span className="ach-card__rank" aria-label={`Achievement number ${rankNum}`}>
        #{rankNum}
      </span>

      {/* Title */}
      <h3 className="ach-card__title">{ach.title}</h3>

      {/* Issuer chip */}
      {ach.issuer && (
        <span className="ach-card__issuer">{ach.issuer}</span>
      )}

      {/* Description */}
      {ach.description && (
        <p className="ach-card__desc">{ach.description}</p>
      )}

      {/* Optional image */}
      {ach.image && (
        <div className="ach-card__img-wrap">
          <img src={ach.image} alt={ach.title} className="ach-card__img" loading="lazy" />
        </div>
      )}

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

/* ─── Main Section ─── */
const AchievementsSection = ({ achievements }) => {
  if (!Array.isArray(achievements) || achievements.length === 0) return null;

  const sorted = [...achievements].sort((a, b) => {
    const yearDiff = (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
    if (yearDiff !== 0) return yearDiff;
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });

  return (
    <div className="achievements-nebula">
      {/* Animated background orbs */}
      <Orbs />

      {/* Bento grid of cards */}
      <div className="ach-grid">
        {sorted.map((ach, idx) => (
          <AchievementCard key={ach.id ?? idx} ach={ach} index={idx} />
        ))}
      </div>

      {/* "View All" CTA — always visible at bottom */}
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
    </div>
  );
};

export default AchievementsSection;
