import React from 'react';
import { motion } from 'framer-motion';
import {
    FaFileDownload,
    FaCloud,
    FaUpload,
    FaDownload,
    FaCode,
    FaSignOutAlt,
    FaBars
} from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle';
import { loadPortfolioData } from '../../firebaseService';
import { toast } from 'react-toastify';

const Navbar = ({
    activeSection,
    scrollToSection,
    toggleMobileMenu,
    setShowResumeModal,
    handleForceRefresh,
    isSyncing,
    isAdmin,
    handleBackupToFirebase,
    handleRestoreFromFirebase,
    handleLogout,
    theme,
    toggleTheme
}) => {
    return (
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
                        "competitive",
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
    );
};

export default Navbar;
