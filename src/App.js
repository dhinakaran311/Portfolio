import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaFileDownload,
  FaArrowUp,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaLock,
  FaTimes,
  FaCloud,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import { savePortfolioData, loadPortfolioData, backupToFirebase, restoreFromFirebase } from './firebaseService';

// Initial data with all required fields
const initialData = {
  projects: [
    {
      id: 1,
      title: "Food Delivery Time Prediction",
      description:
        "ML model to predict delivery times based on various factors like distance, traffic, and weather.",
      github: "https://github.com/dhinakaran311/FOOD_DELIVERY_TIME_PREDICTION",
      live: "",
      tags: ["Python", "ML", "Streamlit"],
      image: "",
    },
    {
      id: 2,
      title: "E-Commerce Analytics Dashboard",
      description:
        "Interactive dashboard for analyzing sales data with real-time visualizations.",
      github: "https://github.com/dhinakaran311/ecommerce-dashboard",
      live: "https://ecommerce-demo.example.com",
      tags: ["React", "D3.js", "Python"],
      image: "",
    },
    {
      id: 3,
      title: "Health Monitoring System",
      description:
        "IoT-based system for real-time health tracking and analysis.",
      github: "https://github.com/dhinakaran311/health-monitor",
      live: "",
      tags: ["IoT", "Python", "Flask"],
      image: "",
    },
  ],
  experiences: [
    {
      id: 1,
      role: "ML Student Intern",
      company: "Appin Technology",
      duration: "Dec 2024 - Jan 2025",
      description:
        "Developed and deployed a regression model using Python and Scikit-learn to predict food delivery time based on distance, traffic, and weather.",
    },
    {
      id: 2,
      role: "Web Development Intern",
      company: "Digital Solutions Co.",
      duration: "May 2023 - Aug 2023",
      description:
        "Developed responsive web applications using React and Node.js.",
    },
  ],
  certifications: [
    {
      id: 1,
      title: "The Joy of Computing Using Python",
      issuer: "NPTEL",
      date: "2023",
      credential: "ELITE+Silver",
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      issuer: "Sungkyunkwan University",
      date: "2023",
      credential: "Coursera",
    },
    {
      id: 3,
      title: "Advanced React Development",
      issuer: "Meta",
      date: "2023",
      credential: "Coursera",
    },
  ],
  skills: [
    { id: 1, name: "Python", level: 90, icon: "🐍", color: "#4B8BBE" },
    { id: 2, name: "Machine Learning", level: 85, icon: "🤖", color: "#FF6B6B" },
    { id: 3, name: "JavaScript", level: 80, icon: "📜", color: "#F0DB4F" },
    { id: 4, name: "React", level: 75, icon: "⚛", color: "#61DAFB" },
    { id: 5, name: "Data Analysis", level: 85, icon: "📊", color: "#4ECDC4" },
    { id: 6, name: "Problem Solving", level: 90, icon: "🧩", color: "#FF9E6D" },
  ],
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: "dhinakaranms123@gmail.com",
  password: "Dhina@311",
};

// Safe data loading function with Firebase priority
const loadData = async () => {
  try {
    // Always try Firebase first for deployed version
    const firebaseData = await loadPortfolioData();
    if (firebaseData) {
      // Save to localStorage for offline access
      localStorage.setItem("portfolioData", JSON.stringify(firebaseData));
      return firebaseData;
    }
    
    // If Firebase fails, try localStorage as fallback
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    return initialData;
  } catch (error) {
    console.error("Error loading data:", error);
    // Try localStorage as last resort
    try {
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (localError) {
      console.error("Error loading from localStorage:", localError);
    }
    return initialData;
  }
};

// TypeAnimation component
const TypeAnimation = ({ sequence, speed = 100, repeat = Infinity }) => {
  const [text, setText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (index >= sequence.length) {
      if (repeat === Infinity) {
        setIndex(0);
      }
      return;
    }

    const currentItem = sequence[index];
    const currentText =
      typeof currentItem === "string" ? currentItem : String(currentItem);
    const timeout = speed / (isDeleting ? 2 : 1);

    if (!isDeleting && subIndex === currentText.length) {
      setTimeout(() => setIsDeleting(true), 1000);
      return;
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timer = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setText(currentText.substring(0, subIndex));
    }, timeout);

    return () => clearTimeout(timer);
  }, [sequence, index, subIndex, isDeleting, speed, repeat]);

  return <span>{text}</span>;
};

// Reusable components
const ContactItem = ({ icon, title, content }) => (
  <div className="contact-item">
    <div className="contact-icon">{icon}</div>
    <div className="contact-details">
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  </div>
);

const SocialLink = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
    whileHover={{ y: -5 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

const AdminEditButton = ({ onClick }) => (
  <motion.button
    className="edit-btn"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <FaEdit /> Edit
  </motion.button>
);

// Editor components
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

const SkillsEditor = ({ skills, onAdd, onUpdate, onDelete }) => {
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 50,
    icon: "",
    color: "#4B8BBE",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    onAdd(newSkill);
    setNewSkill({
      name: "",
      level: 50,
      icon: "",
      color: "#4B8BBE",
    });
  };

  const handleUpdateSkill = (e) => {
    e.preventDefault();
    onUpdate(editingId, newSkill);
    setEditingId(null);
    setNewSkill({
      name: "",
      level: 50,
      icon: "",
      color: "#4B8BBE",
    });
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setNewSkill({
      name: skill.name,
      level: skill.level,
      icon: skill.icon,
      color: skill.color,
    });
  };

  return (
    <motion.div
      id="skills-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Skill" : "Add New Skill"}
      </h3>
      <form onSubmit={editingId ? handleUpdateSkill : handleAddSkill}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Skill Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Level (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-group">
            <label>Icon (emoji)</label>
            <input
              type="text"
              value={newSkill.icon}
              onChange={(e) =>
                setNewSkill({ ...newSkill, icon: e.target.value })
              }
              className="editor-input"
              maxLength="2"
              required
            />
          </div>
          <div className="editor-group">
            <label>Color</label>
            <input
              type="color"
              value={newSkill.color}
              onChange={(e) =>
                setNewSkill({ ...newSkill, color: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewSkill({
                  name: "",
                  level: 50,
                  icon: "",
                  color: "#4B8BBE",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Skills</h3>
      <div className="table-container">
        <table className="skills-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.level}%</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(skill.id)}
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

const ExperienceEditor = ({ experiences, onAdd, onUpdate, onDelete }) => {
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddExp = (e) => {
    e.preventDefault();
    onAdd(newExp);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleUpdateExp = (e) => {
    e.preventDefault();
    onUpdate(editingId, newExp);
    setEditingId(null);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setNewExp({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
    });
  };

  return (
    <motion.div
      id="experience-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Experience" : "Add New Experience"}
      </h3>
      <form onSubmit={editingId ? handleUpdateExp : handleAddExp}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Role</label>
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Company</label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-group">
          <label>Duration</label>
          <input
            type="text"
            value={newExp.duration}
            onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
            className="editor-input"
            placeholder="e.g. Jan 2023 - Present"
            required
          />
        </div>

        <div className="editor-group">
          <label>Description</label>
          <textarea
            value={newExp.description}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            className="editor-input"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewExp({
                  role: "",
                  company: "",
                  duration: "",
                  description: "",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Experiences</h3>
      <div className="table-container">
        <table className="experience-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.role}</td>
                <td>{exp.company}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
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

const CertificationsEditor = ({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    date: "",
    credential: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddCert = (e) => {
    e.preventDefault();
    onAdd(newCert);
    setNewCert({
      title: "",
      issuer: "",
      date: "",
      credential: "",
    });
  };

  const handleUpdateCert = (e) => {
    e.preventDefault();
    onUpdate(editingId, newCert);
    setEditingId(null);
    setNewCert({
      title: "",
      issuer: "",
      date: "",
      credential: "",
    });
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setNewCert({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credential: cert.credential,
    });
  };

  return (
    <motion.div
      id="certifications-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Certification" : "Add New Certification"}
      </h3>
      <form onSubmit={editingId ? handleUpdateCert : handleAddCert}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Title</label>
            <input
              type="text"
              value={newCert.title}
              onChange={(e) =>
                setNewCert({ ...newCert, title: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Issuer</label>
            <input
              type="text"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert({ ...newCert, issuer: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-grid">
          <div className="editor-group">
            <label>Date</label>
            <input
              type="text"
              value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
              className="editor-input"
              placeholder="e.g. 2023"
              required
            />
          </div>
          <div className="editor-group">
            <label>Credential (optional)</label>
            <input
              type="text"
              value={newCert.credential}
              onChange={(e) =>
                setNewCert({ ...newCert, credential: e.target.value })
              }
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewCert({
                  title: "",
                  issuer: "",
                  date: "",
                  credential: "",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Certification" : "Add Certification"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Certifications</h3>
      <div className="table-container">
        <table className="certifications-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.title}</td>
                <td>{cert.issuer}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(cert.id)}
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

// Project Card component
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

// Main App component
const App = () => {
  const [data, setData] = useState(initialData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const sectionRefs = useRef({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const loadedData = await loadData();
        setData({
          projects: loadedData.projects || [],
          experiences: loadedData.experiences || [],
          certifications: loadedData.certifications || [],
          skills: loadedData.skills || [],
          ...loadedData,
        });
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Error loading portfolio data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Save data to localStorage and Firebase
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load
    
    const saveData = async () => {
      try {
        // Save to localStorage
        localStorage.setItem("portfolioData", JSON.stringify(data));
        
        // Auto-sync to Firebase if admin is logged in
        if (isAdmin) {
          setIsSyncing(true);
          const success = await savePortfolioData(data);
          if (success) {
            console.log('Data synced to Firebase');
          }
          setIsSyncing(false);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        setIsSyncing(false);
      }
    };

    saveData();
  }, [data, isAdmin, isLoading]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 300);

      const scrollPosition = window.scrollY + 100;
      for (const section in sectionRefs.current) {
        const element = sectionRefs.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  }, []);

  const onSubmit = async (formData) => {
    try {
      await emailjs.send(
        "service_jyl0yii",
        "template_s7f5fpz",
        formData,
        "eptgLPopdVQXKw_3a"
      );
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Data management functions
  const addItem = useCallback((type, newItem) => {
    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], { ...newItem, id: Date.now() }],
    }));
  }, []);

  const updateItem = useCallback((type, id, updatedItem) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  }, []);

  const deleteItem = useCallback((type, id) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  }, []);

  // Firebase sync functions
  const handleBackupToFirebase = async () => {
    setIsSyncing(true);
    try {
      const success = await backupToFirebase(data);
      if (success) {
        toast.success("Data backed up to Firebase successfully!");
      } else {
        toast.error("Failed to backup data to Firebase");
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error("Error backing up to Firebase");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestoreFromFirebase = async () => {
    setIsSyncing(true);
    try {
      const firebaseData = await restoreFromFirebase();
      if (firebaseData) {
        setData({
          projects: firebaseData.projects || [],
          experiences: firebaseData.experiences || [],
          certifications: firebaseData.certifications || [],
          skills: firebaseData.skills || [],
          ...firebaseData,
        });
        toast.success("Data restored from Firebase successfully!");
      } else {
        toast.error("No data found in Firebase to restore");
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast.error("Error restoring from Firebase");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleForceRefresh = async () => {
    setIsSyncing(true);
    try {
      // Clear localStorage cache
      localStorage.removeItem("portfolioData");
      
      // Load fresh data from Firebase
      const firebaseData = await loadPortfolioData();
      if (firebaseData) {
        setData({
          projects: firebaseData.projects || [],
          experiences: firebaseData.experiences || [],
          certifications: firebaseData.certifications || [],
          skills: firebaseData.skills || [],
          ...firebaseData,
        });
        localStorage.setItem("portfolioData", JSON.stringify(firebaseData));
        toast.success("Data refreshed from Firebase!");
      } else {
        toast.error("No data found in Firebase");
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Error refreshing data");
    } finally {
      setIsSyncing(false);
    }
  };

  // Auth functions
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.email === ADMIN_CREDENTIALS.email &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdmin(true);
      setShowLoginModal(false);
      toast.success("Logged in as admin");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  // Set section refs
  const setRef = useCallback((section, element) => {
    if (element) {
      sectionRefs.current[section] = element;
    }
  }, []);

  // Safe rendering functions
  const renderProjects = () => {
    if (!data.projects || !Array.isArray(data.projects)) return null;
    return data.projects.map((project) => (
      <ProjectCard key={project.id} project={project} />
    ));
  };

  const renderSkills = () => {
    if (!data.skills || !Array.isArray(data.skills)) return null;
    return data.skills.map((skill, index) => (
      <motion.div
        key={skill.id}
        className="skill-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="skill-header">
          <div
            className="skill-icon"
            style={{ backgroundColor: skill.color + "20" }}
          >
            <span>{skill.icon}</span>
          </div>
          <h3 className="skill-name">{skill.name}</h3>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
              style={{ backgroundColor: skill.color }}
            ></motion.div>
          </div>
          <div className="progress-value">{skill.level}%</div>
        </div>
      </motion.div>
    ));
  };

  const renderExperiences = () => {
    if (!data.experiences || !Array.isArray(data.experiences)) return null;
    return data.experiences.map((exp, index) => (
      <motion.div
        key={exp.id}
        className="experience-card"
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="experience-header">
          <div className="experience-badge">{index + 1}</div>
          <div>
            <h3 className="experience-role">{exp.role}</h3>
            <p className="experience-company">{exp.company}</p>
          </div>
          <span className="experience-duration">{exp.duration}</span>
        </div>
        <p className="experience-description">{exp.description}</p>
      </motion.div>
    ));
  };

  const renderCertifications = () => {
    if (!data.certifications || !Array.isArray(data.certifications))
      return null;
    return data.certifications.map((cert, index) => (
      <motion.div
        key={cert.id}
        className="certification-card"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="certification-image-container">
          <div className="certification-image-bg"></div>
          <img
            src={`/images/cert-${(cert.id % 3) + 1}.jpg`}
            alt={cert.title}
            className="certification-image"
          />
        </div>
        <div className="certification-content">
          <h3 className="certification-title">{cert.title}</h3>
          <p className="certification-meta">Issuer: {cert.issuer}</p>
          <p className="certification-meta">Date: {cert.date}</p>
          {cert.credential && (
            <p className="certification-credential">{cert.credential}</p>
          )}
        </div>
      </motion.div>
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.a
            href="#home"
            className="nav-logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            <span className="logo-icon">D</span>
            <span className="logo-text">Dhinakaran</span>
          </motion.a>
          <div className="nav-links">
            {[
              "home",
              "about",
              "skills",
              "projects",
              "experience",
              "contact",
            ].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className={`nav-link ${activeSection === item ? "active" : ""}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item);
                }}
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              href="/documents/resume.pdf"
              download
              className="download-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileDownload /> Resume
            </motion.a>
            <motion.button
              className="sync-btn"
              onClick={handleForceRefresh}
              disabled={isSyncing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh data from Firebase"
            >
              <FaCloud /> {isSyncing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            {isAdmin ? (
              <>
                <motion.button
                  className="sync-btn"
                  onClick={handleBackupToFirebase}
                  disabled={isSyncing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Backup to Firebase"
                >
                  <FaUpload /> {isSyncing ? 'Syncing...' : 'Backup'}
                </motion.button>
                <motion.button
                  className="sync-btn"
                  onClick={handleRestoreFromFirebase}
                  disabled={isSyncing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Restore from Firebase"
                >
                  <FaDownload /> Restore
                </motion.button>
                <motion.button
                  className="logout-btn"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt /> Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                className="login-btn"
                onClick={() => setShowLoginModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLock /> Admin
              </motion.button>
            )}
          </div>
        </div>
      </nav>
      {isAdmin && (
        <div className="admin-dashboard-banner">
          Welcome, Admin! You are in edit mode.
        </div>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setShowLoginModal(false)}
              >
                <FaTimes />
              </button>
              <h3>Admin Login</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="login-submit-btn">
                    <FaSignInAlt /> Login
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="hero" ref={(el) => setRef("home", el)}>
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="hero-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                AI/ML Enthusiast & Developer
              </motion.div>
              <h1 className="hero-title">
                Hi, I'm <span>Dhinakaran</span>
              </h1>
              <h2 className="hero-subtitle">
                <TypeAnimation
                  sequence={[
                    "AI/ML Enthusiast",
                    1000,
                    "Software Developer",
                    1000,
                    "Competitive Programmer",
                    1000,
                  ]}
                  speed={50}
                  repeat={Infinity}
                />
              </h2>
              <p className="hero-description">
                Passionate about building intelligent solutions and exploring
                new technologies.
              </p>
              <div className="hero-buttons">
                <motion.a
                  href="#contact"
                  className="primary-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                >
                  Contact Me
                </motion.a>
                <motion.a
                  href="#projects"
                  className="secondary-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                >
                  View Projects
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              className="hero-image"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="profile-border"></div>
              <div className="profile-image-container">
                <div className="profile-image-bg"></div>
                <img
                  src="/images/profile.jpeg"
                  alt="Dhinakaran"
                  className="profile-image"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hero-deco-circle-1"></div>
        <div className="hero-deco-circle-2"></div>
        <div className="hero-deco-circle-3"></div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="section section-bg"
        ref={(el) => setRef("about", el)}
      >
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              About <span>Me</span>
            </motion.h2>
            <div className="section-subtitle">Get to know me better</div>
          </div>
          <div className="about-container">
            <motion.div
              className="about-image-container"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/profile.jpeg"
                alt="Dhinakaran"
                className="about-image"
              />
              <div className="about-image-deco"></div>
            </motion.div>
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>AI & ML Enthusiast | Software Developer</h3>
              <p>
                I am a pre-final year Computer Science and Engineering student
                at KIT, specializing in AI and Machine Learning. I'm a
                passionate software developer skilled in HTML, CSS, JavaScript,
                and Python with interests in ML and competitive programming.
              </p>
              <p>
                I enjoy building practical solutions and constantly explore new
                technologies to expand my skill set. I aim to contribute to
                impactful projects and grow as a developer through continuous
                learning and collaboration.
              </p>
              <div className="about-grid">
                <div className="about-info-card">
                  <h4>Name:</h4>
                  <p>Dhinakaran M.S</p>
                </div>
                <div className="about-info-card">
                  <h4>Email:</h4>
                  <p>dhinakaranms123@gmail.com</p>
                </div>
                <div className="about-info-card">
                  <h4>Location:</h4>
                  <p>Coimbatore, India</p>
                </div>
                <div className="about-info-card">
                  <h4>Education:</h4>
                  <p>B.E. Computer Science</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="section"
        ref={(el) => setRef("skills", el)}
      >
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              My <span>Skills</span>
            </motion.h2>
            <div className="section-subtitle">Technologies I master</div>
            {isAdmin && (
              <AdminEditButton
                onClick={() => scrollToSection("skills-editor")}
              />
            )}
          </div>
          <div className="skills-grid">{renderSkills()}</div>

          {isAdmin && (
            <SkillsEditor
              skills={data.skills}
              onAdd={(newSkill) => addItem("skills", newSkill)}
              onUpdate={(id, updatedSkill) =>
                updateItem("skills", id, updatedSkill)
              }
              onDelete={(id) => deleteItem("skills", id)}
            />
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="section section-bg"
        ref={(el) => setRef("projects", el)}
      >
        <div className="container">
          <div className="section-header">
            <div className="projects-header">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                My <span>Projects</span>
              </motion.h2>
              <div className="section-subtitle">Explore my recent work</div>
            </div>
            {isAdmin && (
              <AdminEditButton
                onClick={() => scrollToSection("projects-editor")}
              />
            )}
          </div>

          {isAdmin && (
            <ProjectsEditor
              projects={data.projects}
              onAdd={(newProject) => addItem("projects", newProject)}
              onUpdate={(id, updatedProject) =>
                updateItem("projects", id, updatedProject)
              }
              onDelete={(id) => deleteItem("projects", id)}
            />
          )}

          <div className="projects-grid">{renderProjects()}</div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="section"
        ref={(el) => setRef("experience", el)}
      >
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Experience & <span>Internships</span>
            </motion.h2>
            <div className="section-subtitle">My professional journey</div>
            {isAdmin && (
              <AdminEditButton
                onClick={() => scrollToSection("experience-editor")}
              />
            )}
          </div>

          {isAdmin && (
            <ExperienceEditor
              experiences={data.experiences}
              onAdd={(newExp) => addItem("experiences", newExp)}
              onUpdate={(id, updatedExp) =>
                updateItem("experiences", id, updatedExp)
              }
              onDelete={(id) => deleteItem("experiences", id)}
            />
          )}

          <div className="experience-list">{renderExperiences()}</div>
        </div>
      </section>

      {/* Certifications Section */}
      <section
        id="certifications"
        className="section section-bg"
        ref={(el) => setRef("certifications", el)}
      >
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              My <span>Certifications</span>
            </motion.h2>
            <div className="section-subtitle">My professional achievements</div>
            {isAdmin && (
              <AdminEditButton
                onClick={() => scrollToSection("certifications-editor")}
              />
            )}
          </div>

          {isAdmin && (
            <CertificationsEditor
              certifications={data.certifications}
              onAdd={(newCert) => addItem("certifications", newCert)}
              onUpdate={(id, updatedCert) =>
                updateItem("certifications", id, updatedCert)
              }
              onDelete={(id) => deleteItem("certifications", id)}
            />
          )}

          <div className="certifications-grid">{renderCertifications()}</div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="section"
        ref={(el) => setRef("contact", el)}
      >
        <div className="container">
          <div className="section-header">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Get In <span>Touch</span>
            </motion.h2>
            <div className="section-subtitle">Let's work together</div>
          </div>
          <div className="contact-container">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3>Contact Information</h3>
              <div className="contact-items">
                <ContactItem
                  icon={<FaEnvelope />}
                  title="Email"
                  content="dhinakaranms123@gmail.com"
                />
                <ContactItem
                  icon={<FaPhone />}
                  title="Phone"
                  content="+91 7708846581"
                />
                <ContactItem
                  icon={<FaMapMarkerAlt />}
                  title="Location"
                  content="Coimbatore, Tamil Nadu, India"
                />
              </div>
              <h3>Connect With Me</h3>
              <div className="social-links">
                <SocialLink
                  href="https://github.com/dhinakaran311"
                  icon={<FaGithub />}
                  label="GitHub"
                />
                <SocialLink
                  href="https://linkedin.com/in/dhinakaran-ms"
                  icon={<FaLinkedin />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://www.codechef.com/users/Kit23bam016"
                  icon={<FaCode />}
                  label="CodeChef"
                />
              </div>
            </motion.div>
            <motion.div
              className="contact-form-container"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <h3>Send Me a Message</h3>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="form-control"
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="form-control"
                    placeholder="Your Email"
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    {...register("message", {
                      required: "Message is required",
                    })}
                    className="form-control"
                    placeholder="Your Message"
                    rows="5"
                  ></textarea>
                  {errors.message && (
                    <p className="error-message">{errors.message.message}</p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  className="submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="footer-content">
              <div className="footer-logo">
                <span className="logo-icon">D</span>
                <span className="logo-text">Dhinakaran</span>
              </div>
              <p>AI/ML Enthusiast & Software Developer</p>
              <div className="footer-links">
                {[
                  "home",
                  "about",
                  "skills",
                  "projects",
                  "experience",
                  "contact",
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item);
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Dhinakaran M.S. All rights
                reserved.
              </p>
              <div className="social-links">
                <SocialLink
                  href="https://github.com/dhinakaran311"
                  icon={<FaGithub />}
                  label="GitHub"
                />
                <SocialLink
                  href="https://linkedin.com/in/dhinakaran-ms"
                  icon={<FaLinkedin />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://www.codechef.com/users/Kit23bam016"
                  icon={<FaCode />}
                  label="CodeChef"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollButton && (
        <motion.button
          onClick={scrollToTop}
          className="scroll-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp />
        </motion.button>
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
