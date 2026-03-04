
import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const MAX_LENGTH = 100;

const ProjectCard = memo(({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { shouldTruncate, displayDescription, imageSrc } = useMemo(() => {
    if (!project) return { shouldTruncate: false, displayDescription: '', imageSrc: '' };

    const desc = project.description || '';
    const truncate = desc.length > MAX_LENGTH;
    const display = truncate && !isExpanded
      ? desc.slice(0, MAX_LENGTH) + '...'
      : desc;
    const img = project.image || `/images/project-${(project.id % 3) + 1}.jpg`;

    return { shouldTruncate: truncate, displayDescription: display, imageSrc: img };
  }, [project, isExpanded]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  if (!project) return null;

  return (
    <motion.div
      className="project-card-elegant"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background Effect */}
      <div className="project-gradient-bg"></div>

      {/* Image Section */}
      <div className="project-image-elegant">
        <div className="project-image-inner">
          <img
            src={imageSrc}
            alt={project.title}
            className="project-image-img"
            loading="lazy"
          />
          <div className="project-image-shine"></div>
        </div>

        {/* Status Badge */}
        {project.live && (
          <motion.div
            className="project-status-elegant"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <span className="status-indicator"></span>
            <span>Live</span>
          </motion.div>
        )}

        {/* Hover Overlay with Quick Actions */}
        <motion.div
          className="project-hover-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="project-quick-actions">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-action-btn github-quick"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub />
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn live-quick"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="project-content-elegant">
        <div className="project-header-elegant">
          <h3 className="project-title-elegant">{project.title}</h3>
          <div className="project-accent-line"></div>
        </div>

        <p className="project-description-elegant">
          {displayDescription}
          {shouldTruncate && (
            <button
              className="expand-btn-elegant"
              onClick={toggleExpand}
              aria-label={isExpanded ? 'Show less' : 'Show more'}
            >
              {isExpanded ? ' Show Less' : ' Show More'}
            </button>
          )}
        </p>

        {/* Tags */}
        <div className="project-tags-elegant">
          {project.tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="project-tag-elegant"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="project-actions-elegant">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn-elegant github-btn-elegant"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub />
            <span>Code</span>
          </motion.a>
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-elegant live-btn-elegant"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt />
              <span>Demo</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
