
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaGithub, FaCode, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ProjectCard = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150; // Characters to show before truncating
  
  if (!project) return null;

  const description = project.description || '';
  const shouldTruncate = description.length > MAX_LENGTH;
  const displayDescription = shouldTruncate && !isExpanded 
    ? description.slice(0, MAX_LENGTH) + '...' 
    : description;

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="project-image-container">
        <div className="project-image-bg"></div>
        <img
          src={project.image || `/images/project-${(project.id % 3) + 1}.jpg`}
          alt={project.title}
          className="project-image"
        />
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p className="project-description">
          {displayDescription}
          {shouldTruncate && (
            <button 
              className="show-more-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              {isExpanded ? (
                <>
                  <FaChevronUp /> Show Less
                </>
              ) : (
                <>
                  <FaChevronDown /> Show More
                </>
              )}
            </button>
          )}
        </p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            <FaGithub /> Code
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link primary"
            >
              <FaCode /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
