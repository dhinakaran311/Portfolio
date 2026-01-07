import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import './LoadingAnimation.css';
import { savePortfolioData, loadPortfolioData, backupToFirebase, restoreFromFirebase } from './firebaseService';
import { useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import ResumePreviewModal from './components/ResumePreviewModal';
import DKLoader from './components/DKLoader';
import AchievementsSection from './components/AchievementsSection';
import AchievementsEditor from './components/editors/AchievementsEditor';

// Import new extracted components
import CursorFollower from './components/CursorFollower/CursorFollower';
import ScrollToTopButton from './components/ScrollToTopButton';
import Navbar from './components/Navbar/Navbar';
import MobileMenu from './components/Navbar/MobileMenu';
import HeroSection from './components/Hero/HeroSection';
import AboutSection from './components/About/AboutSection';
import SkillsSection from './components/Skills/SkillsSection';
import ProjectsSection from './components/Projects/ProjectsSection';
import ExperienceSection from './components/Experience/ExperienceSection';
import CertificationsSection from './components/Certifications/CertificationsSection';
import CertificateModal from './components/Certifications/CertificateModal';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Footer/Footer';

// Initial data with all required fields
const initialData = {
  projects: [
    {
      id: 1,
      title: 'Food Delivery Time Prediction',
      description:
        'ML model to predict delivery times based on various factors like distance, traffic, and weather.',
      github: 'https://github.com/dhinakaran311/FOOD_DELIVERY_TIME_PREDICTION',
      live: '',
      tags: ['Python', 'ML', 'Streamlit'],
      image: '',
    },
    {
      id: 2,
      title: 'E-Commerce Analytics Dashboard',
      description:
        'Interactive dashboard for analyzing sales data with real-time visualizations.',
      github: 'https://github.com/dhinakaran311/ecommerce-dashboard',
      live: 'https://ecommerce-demo.example.com',
      tags: ['React', 'D3.js', 'Python'],
      image: '',
    },
    {
      id: 3,
      title: 'Health Monitoring System',
      description:
        'IoT-based system for real-time health tracking and analysis.',
      github: 'https://github.com/dhinakaran311/health-monitor',
      live: '',
      tags: ['IoT', 'Python', 'Flask'],
      image: '',
    },
  ],
  experiences: [
    {
      id: 1,
      role: 'ML Student Intern',
      company: 'Appin Technology',
      duration: 'Dec 2024 - Jan 2025',
      description:
        'Developed and deployed a regression model using Python and Scikit-learn to predict food delivery time based on distance, traffic, and weather.',
    },
    {
      id: 2,
      role: 'Web Development Intern',
      company: 'Digital Solutions Co.',
      duration: 'May 2023 - Aug 2023',
      description:
        'Developed responsive web applications using React and Node.js.',
    },
  ],
  certifications: [
    {
      id: 1,
      title: 'The Joy of Computing Using Python',
      issuer: 'NPTEL',
      date: '2023',
      credential: 'ELITE+Silver',
      image: '',
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      issuer: 'Sungkyunkwan University',
      date: '2023',
      credential: 'Coursera',
      image: '',
    },
    {
      id: 3,
      title: 'Advanced React Development',
      issuer: 'Meta',
      date: '2023',
      credential: 'Coursera',
      image: '',
    },
  ],
  skills: [
    { id: 1, name: 'Python', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#4B8BBE' },
    { id: 2, name: 'Machine Learning', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', color: '#FF6B6B' },
    { id: 3, name: 'JavaScript', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F0DB4F' },
    { id: 4, name: 'React', level: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
    { id: 5, name: 'Data Analysis', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#4ECDC4' },
    { id: 6, name: 'Node.js', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  ],
  achievements: [
    {
      id: 1,
      title: 'National Coding Competition',
      description: 'Secured 1st place in a national-level coding competition.',
      month: 'Feb',
      year: '2025',
      issuer: 'XYZ Institute',
      link: '',
      image: ''
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
      localStorage.setItem('portfolioData', JSON.stringify(firebaseData));
      return firebaseData;
    }

    // If Firebase fails, try localStorage as fallback
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      return JSON.parse(savedData);
    }

    return initialData;
  } catch (error) {
    console.error('Error loading data:', error);
    // Try localStorage as last resort
    try {
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
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

  const [activeSection, setActiveSection] = useState('home');
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
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {  // Only allow login shortcut if not already logged in
      let keyonePressed = false;
      let aPressedTimeout = null;

      const handleKeyDown = (e) => {
        try {
          // Skip if key is not defined or not a string
          if (!e.key || typeof e.key !== 'string') return;

          const key = e.key.toLowerCase();

          // Handle Alt+D
          if (e.altKey && key === process.env.REACT_APP_KEYONE) {
            e.preventDefault();
            keyonePressed = true;

            // Set a timeout to reset keyonePressed after 2 seconds
            clearTimeout(aPressedTimeout);
            aPressedTimeout = setTimeout(() => {
              keyonePressed = false;
            }, 2000);
          }

          // Handle Alt+A after D
          if (e.altKey && key === process.env.REACT_APP_KEYTWO && keyonePressed) {
            e.preventDefault();
            e.stopPropagation();
            setShowLoginModal(true);
            keyonePressed = false;
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
            keyonePressed = false;
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
  }, [currentUser]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load data on component mount with minimum loading time
  useEffect(() => {
    const MIN_LOADING_TIME = 3500;
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
        localStorage.setItem('portfolioData', JSON.stringify(data));

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
        console.error('Error saving data:', error);
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
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

      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
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
        toast.success('Data backed up to Firebase successfully!');
      } else {
        toast.error('Failed to backup data to Firebase');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Error backing up to Firebase');
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
        toast.success('Data restored from Firebase successfully!');
      } else {
        toast.error('No data found in Firebase to restore');
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Error restoring from Firebase');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleForceRefresh = async () => {
    setIsSyncing(true);
    try {
      // Clear localStorage cache
      localStorage.removeItem('portfolioData');

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
        localStorage.setItem('portfolioData', JSON.stringify(firebaseData));
        toast.success('Data refreshed from Firebase!');
      } else {
        toast.error('No data found in Firebase');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Error refreshing data');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auth functions
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  // Set section refs
  const setRef = useCallback((section, element) => {
    if (element) {
      sectionRefs.current[section] = element;
    }
  }, []);

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
      <CursorFollower isCursorVisible={isCursorVisible} followerPosition={followerPosition} />

      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        toggleMobileMenu={toggleMobileMenu}
        setShowResumeModal={setShowResumeModal}
        handleForceRefresh={handleForceRefresh}
        isSyncing={isSyncing}
        isAdmin={isAdmin}
        handleBackupToFirebase={handleBackupToFirebase}
        handleRestoreFromFirebase={handleRestoreFromFirebase}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowResumeModal={setShowResumeModal}
        handleForceRefresh={handleForceRefresh}
        isSyncing={isSyncing}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
      />

      {isAdmin && (
        <div className="admin-dashboard-banner">
          Welcome, Admin! You are in edit mode.
        </div>
      )}

      <HeroSection setRef={setRef} scrollToSection={scrollToSection} />

      <AboutSection setRef={setRef} />

      <SkillsSection
        skills={data.skills}
        isAdmin={isAdmin}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        setRef={setRef}
      />

      <ProjectsSection
        projects={data.projects}
        isAdmin={isAdmin}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        setRef={setRef}
      />

      <ExperienceSection
        experiences={data.experiences}
        isAdmin={isAdmin}
        expandedCards={expandedCards}
        toggleCardExpansion={toggleCardExpansion}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        setRef={setRef}
      />

      {/* Achievements Section */}
      <section
        id="achievements"
        className="section section-bg"
        ref={(el) => setRef('achievements', el)}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              My <span>Achievements</span>
            </h2>
            <div className="section-subtitle">Competitions & Awards</div>
          </div>

          {isAdmin && (
            <AchievementsEditor
              achievements={data.achievements}
              onAdd={(newAch) => addItem('achievements', newAch)}
              onUpdate={(id, updatedAch) => updateItem('achievements', id, updatedAch)}
              onDelete={(id) => deleteItem('achievements', id)}
            />
          )}

          <AchievementsSection achievements={data.achievements} />
        </div>
      </section>

      <CertificationsSection
        certifications={data.certifications}
        isAdmin={isAdmin}
        setSelectedCertificate={setSelectedCertificate}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        setRef={setRef}
      />

      <ContactSection
        setRef={setRef}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <Footer scrollToSection={scrollToSection} />

      <ScrollToTopButton showScrollButton={showScrollButton} scrollToTop={scrollToTop} />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <ResumePreviewModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />

      <CertificateModal
        selectedCertificate={selectedCertificate}
        setSelectedCertificate={setSelectedCertificate}
      />

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