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

// Import components
import TypeAnimation from './components/TypeAnimation';
import ContactItem from './components/ContactItem';
import SocialLink from './components/SocialLink';
import AdminEditButton from './components/AdminEditButton';
import ProjectCard from './components/ProjectCard';
import ProjectsEditor from './components/editors/ProjectsEditor';
import SkillsEditor from './components/editors/SkillsEditor';
import ExperienceEditor from './components/editors/ExperienceEditor';
import CertificationsEditor from './components/editors/CertificationsEditor';

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
      
      // Check if footer is visible
      const footer = document.querySelector('.footer');
      const navbar = document.querySelector('.navbar');
      
      if (footer && navbar) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Hide navbar when footer is 50% visible
        if (footerRect.top < windowHeight * 0.5) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
      }

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
                    2000,
                    "Software Developer",
                    2000,
                    "Competitive Programmer",
                    2000,
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
          <motion.div
            className="about-content-single"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
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