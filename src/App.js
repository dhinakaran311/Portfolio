import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaFileDownload,
  FaArrowUp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCloud,
  FaDownload,
  FaUpload,
  FaBars,
  FaTimes,
  FaCertificate,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaSyncAlt,
  FaUserShield,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import "./LoadingAnimation.css";
import { savePortfolioData, loadPortfolioData, backupToFirebase, restoreFromFirebase } from './firebaseService';
import { useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import ResumePreviewModal from './components/ResumePreviewModal';
import ThemeToggle from './components/ThemeToggle';
import DKLoader from './components/DKLoader';

// Import components
import TypeAnimation from './components/TypeAnimation';
import ContactItem from './components/ContactItem';
import SocialLink from './components/SocialLink';
import ProjectCard from './components/ProjectCard';
import ProjectsEditor from './components/editors/ProjectsEditor';
import SkillsEditor from './components/editors/SkillsEditor';
import ExperienceEditor from './components/editors/ExperienceEditor';
import CertificationsEditor from './components/editors/CertificationsEditor';
import AchievementsSection from "./components/AchievementsSection";
import AchievementsEditor from "./components/editors/AchievementsEditor";

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
      image: "",
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      issuer: "Sungkyunkwan University",
      date: "2023",
      credential: "Coursera",
      image: "",
    },
    {
      id: 3,
      title: "Advanced React Development",
      issuer: "Meta",
      date: "2023",
      credential: "Coursera",
      image: "",
    },
  ],
  skills: [
    { id: 1, name: "Python", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#4B8BBE" },
    { id: 2, name: "Machine Learning", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", color: "#FF6B6B" },
    { id: 3, name: "JavaScript", level: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#F0DB4F" },
    { id: 4, name: "React", level: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB" },
    { id: 5, name: "Data Analysis", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", color: "#4ECDC4" },
    { id: 6, name: "Node.js", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#339933" },
  ],
  achievements: [
    {
      id: 1,
      title: "National Coding Competition",
      description: "Secured 1st place in a national-level coding competition.",
      month: "Feb",
      year: "2025",
      issuer: "XYZ Institute",
      link: "",
      image: ""
    }
  ]
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

// Admin credentials (in a real app, these should be handled by Firebase Auth)
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;
// Main App component
const App = () => {
  const [data, setData] = useState(initialData);
  const [expandedCards, setExpandedCards] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const [activeSection, setActiveSection] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Cursor follower state
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const cursorTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isMobileRef = useRef(false);

  const { currentUser, login, logout } = useAuth();
  const sectionRefs = useRef({});

  // Apply theme to body and save to localStorage
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Cursor follower mouse tracking
  useEffect(() => {
    // Check if mobile
    isMobileRef.current = window.innerWidth < 768;
    if (isMobileRef.current) return;

    const handleMouseMove = (e) => {
      if (isMobileRef.current) return;

      // Clear existing timeout
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }

      // Update cursor position
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Show cursor follower
      setIsCursorVisible(true);

      // Hide after 1.2 seconds of inactivity
      cursorTimeoutRef.current = setTimeout(() => {
        setIsCursorVisible(false);
      }, 1200);
    };

    // Smooth following animation
    const animateFollower = () => {
      setFollowerPosition(prev => {
        const lerpFactor = 0.14;
        const newX = prev.x + (cursorPosition.x - prev.x) * lerpFactor;
        const newY = prev.y + (cursorPosition.y - prev.y) * lerpFactor;
        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(animateFollower);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateFollower);

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
      if (isMobileRef.current) {
        setIsCursorVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cursorPosition]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  // Check if user is admin when auth state changes
  useEffect(() => {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]); // ADMIN_EMAIL is a constant and doesn't need to be in the dependency array

  // Handle keyboard shortcut Alt+D then A to toggle login form
  useEffect(() => {
    if (!currentUser) {  // Only allow login shortcut if not already logged in
      let dPressed = false;
      let aPressedTimeout = null;

      const handleKeyDown = (e) => {
        try {
          // Skip if key is not defined or not a string
          if (!e.key || typeof e.key !== 'string') return;

          const key = e.key.toLowerCase();

          // Handle Alt+D
          if (e.altKey && key === 'd') {
            e.preventDefault();
            dPressed = true;

            // Set a timeout to reset dPressed after 2 seconds
            clearTimeout(aPressedTimeout);
            aPressedTimeout = setTimeout(() => {
              dPressed = false;
            }, 2000);
          }

          // Handle Alt+A after D
          if (e.altKey && key === 'a' && dPressed) {
            e.preventDefault();
            e.stopPropagation();
            setShowLoginModal(true);
            dPressed = false;
            clearTimeout(aPressedTimeout);
          }
        } catch (error) {
          console.error('Error in keyboard handler:', error);
        }
      };

      const handleKeyUp = (e) => {
        try {
          // Check if Alt key is released
          if (e && e.key && typeof e.key === 'string' && e.key.toLowerCase() === 'alt') {
            dPressed = false;
            clearTimeout(aPressedTimeout);
          }
        } catch (error) {
          console.error('Error in keyup handler:', error);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        clearTimeout(aPressedTimeout);
      };
    }
  }, [currentUser]);  // Only re-run if currentUser changes

  // Removed welcome notification

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load data on component mount with minimum loading time
  useEffect(() => {
    const MIN_LOADING_TIME = 3500; // 2.5 seconds minimum loading time for smoother animation
    const startTime = Date.now();

    const initializeData = async () => {
      setIsLoading(true);
      try {
        const loadedData = await loadData();
        console.log('Loaded data:', loadedData);
        const newData = {
          projects: loadedData.projects || [],
          experiences: loadedData.experiences || [],
          certifications: loadedData.certifications || [],
          skills: loadedData.skills || [],
          ...loadedData,
        };
        console.log('Setting data with achievements:', newData.achievements);
        setData(newData);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Error loading portfolio data');
      } finally {
        // Calculate remaining time to ensure minimum loading time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        // Set timeout to ensure minimum loading time is met
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
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
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const onSubmit = async (formData) => {
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Data management functions
  const addItem = useCallback((type, newItem) => {
    console.log(`Adding item to ${type}:`, newItem);
    setData((prev) => {
      const currentItems = Array.isArray(prev[type]) ? prev[type] : [];
      const newItemWithId = { ...newItem, id: Date.now() };
      const updatedItems = [...currentItems, newItemWithId];
      console.log(`Updated ${type}:`, updatedItems);
      return {
        ...prev,
        [type]: updatedItems,
      };
    });
  }, []);

  const updateItem = useCallback((type, id, updatedItem) => {
    setData((prev) => ({
      ...prev,
      [type]: (prev[type] || []).map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  }, []);

  const deleteItem = useCallback((type, id) => {
    setData((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((item) => item.id !== id),
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
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
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
      <div
        key={skill.id}
        className="skill-card"
        style={{ animationDelay: `${index * 0.2}s, ${index * 0.3}s` }}
      >
        <div className="skill-header">
          <div
            className="skill-icon"
            style={{ backgroundColor: skill.color + "20" }}
          >
            {skill.icon && skill.icon.startsWith('<svg') ? (
              // Inline SVG code
              <div
                className="skill-icon-img"
                dangerouslySetInnerHTML={{ __html: skill.icon }}
              />
            ) : (
              // Image URL
              <img
                src={skill.icon}
                alt={skill.name}
                className="skill-icon-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
          <h3 className="skill-name">{skill.name}</h3>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                backgroundColor: skill.color,
                width: `${skill.level}%`,
                transition: 'width 1s ease-out'
              }}
            ></div>
          </div>
          <div className="progress-value">{skill.level}%</div>
        </div>
      </div>
    ));
  };

  const renderExperiences = () => {
    if (!data.experiences || !Array.isArray(data.experiences)) return null;

    // Date parsing function for accurate month + year sorting
    const parseDateString = (str) => {
      if (!str) return { month: 0, year: 0 };

      const monthMap = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
      };

      // Extract all month-year pairs
      const parts = str.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/g);
      const years = str.match(/\b(19|20)\d{2}\b/g);

      // Case: Full month-year matches found
      if (parts) {
        const parsed = parts.map(p => {
          const [m, y] = p.split(" ");
          return { month: monthMap[m], year: Number(y) };
        });
        // Return the latest date in the range
        return parsed.reduce((latest, curr) =>
          curr.year > latest.year || (curr.year === latest.year && curr.month > latest.month)
            ? curr : latest
        );
      }

      // Case: Only year provided - assume December of that year
      if (years) {
        const y = Number(years[years.length - 1]); // Use the latest year in range
        return { month: 12, year: y };
      }

      return { month: 0, year: 0 };
    };

    // Sort internships by month + year (latest first)
    const sortedExperiences = [...data.experiences].sort((a, b) => {
      const A = parseDateString(a.duration);
      const B = parseDateString(b.duration);

      // Compare year first, then month
      if (B.year !== A.year) return B.year - A.year;
      return B.month - A.month;
    });

    return (
      <div className="internships-scroll-container">
        {sortedExperiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="intern-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
          >
            {/* Company Logo/Icon Section */}
            <div className="intern-header">
              <div className="intern-badge">{index + 1}</div>
              <div className="intern-info">
                <h3 className="intern-company">{exp.company}</h3>
                <p className="intern-role">{exp.role}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="intern-duration">
              <FaCalendarAlt /> {exp.duration}
            </div>

            {/* Markdown Description */}
            <div className="intern-description-container">
              <div className={`intern-desc-wrapper ${expandedCards[exp.id] ? 'expanded' : ''}`}>
                <div className="intern-description-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {exp.description}
                  </ReactMarkdown>
                </div>
              </div>

              {/* See More / Show Less Button */}
              <button
                className="view-more-btn"
                onClick={() => toggleCardExpansion(exp.id)}
              >
                {expandedCards[exp.id] ? 'Show Less' : 'See More'}
              </button>
            </div>

            {/* Buttons */}
            {(exp.certificate || exp.link) && (
              <div className="intern-buttons">
                {exp.certificate && (
                  <a
                    href={exp.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="intern-btn"
                  >
                    <FaCertificate /> Certificate
                  </a>
                )}
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="intern-btn"
                  >
                    <FaExternalLinkAlt /> View
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
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
        <div
          className="certification-image-container"
          onClick={() => setSelectedCertificate(cert)}
        >
          <div className="certification-image-bg"></div>
          <img
            src={cert.image || `/images/cert-${(cert.id % 3) + 1}.jpg`}
            alt={cert.title}
            className="certification-image"
            onError={(e) => {
              e.target.src = `/images/cert-${(cert.id % 3) + 1}.jpg`;
            }}
          />
          <div className="certification-overlay">
            <span>Click to view full size</span>
          </div>
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

  // Handle loading screen fade out effect
  useEffect(() => {
    if (!isLoading) {
      const loadingScreen = document.querySelector('.loading-screen');
      if (loadingScreen) {
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
        }, 500);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <DKLoader isLoading={isLoading} />;
  }

  return (
    <div className="app">
      {/* Cursor Follower */}
      <div
        className={`cursor-follower ${isCursorVisible ? 'visible' : ''}`}
        style={{
          transform: `translate3d(${followerPosition.x - 14}px, ${followerPosition.y - 14}px, 0)`
        }}
      >
        <FaCode />
      </div>

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
            <span className="logo-icon-dk">&lt;/&gt;</span>
            <span className="logo-text">Dhinakaran</span>
          </motion.a>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBars />
          </motion.button>

          {/* Desktop Navigation */}
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
            <motion.button
              className="download-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResumeModal(true)}
            >
              <FaFileDownload /> Resume
            </motion.button>
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

            {/* Admin Controls */}
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
                  className="sync-btn"
                  onClick={async () => {
                    console.log('🔍 Checking Firebase data...');
                    const firebaseData = await loadPortfolioData();
                    console.log('📊 Current Firebase data:', firebaseData);
                    toast.info('Check console for Firebase data');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Check Firebase Data"
                >
                  <FaCode /> Debug
                </motion.button>
                <motion.button
                  className="logout-btn"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Logout"
                >
                  <FaSignOutAlt /> Logout
                </motion.button>
              </>
            ) : (
              <></>
            )}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="mobile-menu"
              initial={{ transform: "translateX(100%)" }}
              animate={{ transform: "translateX(0%)" }}
              exit={{ transform: "translateX(100%)" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              <button className="close-menu-btn" onClick={closeMobileMenu}>
                <FaTimes />
              </button>

              <div className="menu-top">
                <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.2rem' }}>Menu</h3>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>

              <div className="menu-items">
                <a href="#home" className="menu-item" onClick={closeMobileMenu}>Home</a>
                <a href="#about" className="menu-item" onClick={closeMobileMenu}>About</a>
                <a href="#skills" className="menu-item" onClick={closeMobileMenu}>Skills</a>
                <a href="#projects" className="menu-item" onClick={closeMobileMenu}>Projects</a>
                <a href="#internships" className="menu-item" onClick={closeMobileMenu}>Internships</a>
                <a href="#contact" className="menu-item" onClick={closeMobileMenu}>Contact</a>
              </div>

              <div className="menu-actions">
                <motion.button
                  className="menu-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowResumeModal(true);
                    closeMobileMenu();
                  }}
                >
                  <FaFileDownload /> Resume
                </motion.button>
                <motion.button
                  className="menu-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleForceRefresh();
                    closeMobileMenu();
                  }}
                  disabled={isSyncing}
                >
                  <FaSyncAlt className={isSyncing ? 'spinning' : ''} /> Refresh
                </motion.button>
                {currentUser ? (
                  <motion.button
                    className="menu-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </motion.button>
                ) : (
                  <motion.button
                    className="menu-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowLoginModal(true);
                      closeMobileMenu();
                    }}
                  >
                    <FaUserShield /> Admin
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {isAdmin && (
        <div className="admin-dashboard-banner">
          Welcome, Admin! You are in edit mode.
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero" ref={(el) => setRef("home", el)}>
        <div className="hero-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-glass"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Hi, I'm <span className="gradient-text">Dhinakaran</span>
              </motion.h1>

              <motion.div
                className="hero-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <TypeAnimation
                  sequence={[
                    'AI/ML Engineer',
                    1500,
                    'Full Stack Developer',
                    1500,
                    'Competitive Programmer',
                    1500
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </motion.div>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Passionate about building intelligent solutions and exploring new technologies.
                I specialize in creating seamless web experiences with modern technologies.
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.a
                  href="#contact"
                  className="btn-primary"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 5px 20px rgba(99, 102, 241, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                >
                  Contact Me
                </motion.a>
                <motion.a
                  href="#projects"
                  className="btn-secondary"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                >
                  View Projects
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              className="profile-image-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            >
              <div className="profile-glow"></div>
              <div className="profile-image-wrapper">
                <img
                  src="/images/profile.jpeg"
                  alt="Dhinakaran"
                  className="profile-image"
                />
              </div>
            </motion.div>
          </div>
        </div>
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

          <div className="about-glass-container">
            {/* Background Decorations */}
            <div className="about-bg-orb orb-1"></div>
            <div className="about-bg-orb orb-2"></div>
            <div className="about-bg-orb orb-3"></div>

            {/* Identity Badges */}
            <div className="identity-badges">
              {[
                "AI/ML Engineer",
                "Frontend Developer",
                "Full-Stack Learner",
                "Competitive Programmer"
              ].map((badge, index) => (
                <motion.div
                  key={badge}
                  className="identity-badge"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {badge}
                </motion.div>
              ))}
            </div>

            {/* Highlight Cards */}
            <div className="highlight-cards">
              {[
                { icon: "⭐", text: "Built 20+ Projects" },
                { icon: "🚀", text: "Internship Experience" },
                { icon: "🧠", text: "Machine Learning & Deep Learning" },
                { icon: "💻", text: "Strong Web Development Skills" }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="highlight-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="highlight-icon">{card.icon}</div>
                  <div className="highlight-text">{card.text}</div>
                </motion.div>
              ))}
            </div>

            {/* Personal Details Info Box */}
            <motion.div
              className="about-info-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                className="about-info-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="about-info-icon">👤</span>
                <span>Name: Dhinakaran M S</span>
              </motion.div>

              <motion.div
                className="about-info-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="about-info-icon">📧</span>
                <span>Email: dhinakaranms123@gmail.com</span>
              </motion.div>

              <motion.div
                className="about-info-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span className="about-info-icon">📍</span>
                <span>Location: Coimbatore, Tamil Nadu, India</span>
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <div className="about-text-content">
              <motion.p
                className="about-text-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                I am a pre-final year Computer Science and Engineering student at KIT, specializing in AI and Machine Learning. I'm a passionate software developer skilled in HTML, CSS, JavaScript, and Python with interests in ML and competitive programming.
              </motion.p>

              <motion.p
                className="about-text-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                I enjoy building practical solutions and constantly explore new technologies to expand my skill set. My journey in web development has taught me the importance of clean code, responsive design, and user-centric applications.
              </motion.p>

              <motion.p
                className="about-text-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                I aim to contribute to impactful projects and grow as a developer through continuous learning and collaboration. Always eager to take on new challenges and expand my horizons in both frontend and backend development.
              </motion.p>
            </div>
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

          <div className="internship-container">
            {renderExperiences()}
          </div>
        </div>
      </section>
      {/* Achievements Section */}
      <section
        id="achievements"
        className="section section-bg"
        ref={(el) => setRef("achievements", el)}
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
              My <span>Achievements</span>
            </motion.h2>
            <div className="section-subtitle">Competitions & Awards</div>
          </div>

          {isAdmin && (
            <AchievementsEditor
              achievements={data.achievements}
              onAdd={(newAch) => addItem("achievements", newAch)}
              onUpdate={(id, updatedAch) => updateItem("achievements", id, updatedAch)}
              onDelete={(id) => deleteItem("achievements", id)}
            />
          )}

          <AchievementsSection achievements={data.achievements} />
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
                  href="https://www.linkedin.com/in/dhinakaran-ms-934296378/"
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

      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="container">
          <motion.div
            className="footer-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Branding Block */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon"><FaCode /></span>
                <span className="logo-text">Dhinakaran</span>
              </div>
              <p className="footer-tagline">AI/ML Enthusiast & Software Developer</p>
            </div>

            {/* Navigation Links */}
            <nav className="footer-nav">
              <h3 className="nav-title">Quick Links</h3>
              <div className="footer-links">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'contact', label: 'Contact' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    aria-label={`Go to ${item.label} section`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Contact & Social */}
            <div className="footer-contact">
              <h3 className="contact-title">Get In Touch</h3>
              <div className="footer-socials">
                <SocialLink
                  href="https://github.com/dhinakaran311"
                  icon={<FaGithub />}
                  label="GitHub Profile"
                  className="social-icon"
                />
                <SocialLink
                  href="https://www.linkedin.com/in/dhinakaran-ms-934296378/"
                  icon={<FaLinkedin />}
                  label="LinkedIn Profile"
                  className="social-icon"
                />
                <SocialLink
                  href="https://www.codechef.com/users/Kit23bam016"
                  icon={<FaCode />}
                  label="CodeChef Profile"
                  className="social-icon"
                />
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
            >
              <FaArrowUp />
              <span>Back to Top</span>
            </button>
          </motion.div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Dhinakaran M.S. All rights reserved.
            </p>
          </div>
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="certificate-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              className="certificate-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="certificate-modal-header">
                <h3>{selectedCertificate.title}</h3>
                <button
                  className="certificate-modal-close"
                  onClick={() => setSelectedCertificate(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="certificate-modal-content">
                <img
                  src={selectedCertificate.image || `/images/cert-${(selectedCertificate.id % 3) + 1}.jpg`}
                  alt={selectedCertificate.title}
                  className="certificate-modal-image"
                />
                <div className="certificate-modal-details">
                  <p><strong>Issuer:</strong> {selectedCertificate.issuer}</p>
                  <p><strong>Date:</strong> {selectedCertificate.date}</p>
                  {selectedCertificate.credential && (
                    <p><strong>Credential:</strong> {selectedCertificate.credential}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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