
import React from 'react';
import { motion } from "framer-motion";
import { FaGithub, FaCode } from "react-icons/fa";

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
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
        <p className="project-description">{project.description}</p>
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
