import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaLink } from "react-icons/fa";

const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AchievementsSection = ({ achievements }) => {
  // console.log('AchievementsSection received:', achievements);

  // Ensure achievements is an array and has items
  if (!Array.isArray(achievements) || achievements.length === 0) {
    // console.log('No achievements to display');
    return null;
  }

  // Sort achievements by year and month
  const sorted = [...achievements].sort((a, b) => {
    // Convert years to numbers for comparison
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;

    if (yearB !== yearA) return yearB - yearA;

    // If years are the same, sort by month
    const monthA = monthOrder.indexOf(a.month);
    const monthB = monthOrder.indexOf(b.month);
    return monthB - monthA;
  });

  return (
    <div className="achievements-list">
      {sorted.map((ach, index) => (
        <motion.div
          key={ach.id}
          className="achievement-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="achievement-badge">
            <FaTrophy size={12} />
          </div>

          <div className="achievement-header">
            <div>
              <h3 className="achievement-title">{ach.title}</h3>
              {ach.issuer && <span className="achievement-issuer">{ach.issuer}</span>}
            </div>
            <span className="achievement-date">{ach.month} {ach.year}</span>
          </div>

          <p className="achievement-description">{ach.description}</p>

          {ach.image && (
            <div className="achievement-image-container">
              <img src={ach.image} alt={ach.title} className="achievement-image" />
            </div>
          )}

          {ach.link && (
            <a
              href={ach.link}
              target="_blank"
              rel="noopener noreferrer"
              className="achievement-link"
            >
              View Proof <FaLink size={12} />
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AchievementsSection;
