import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes,
    FaFileDownload,
    FaSyncAlt,
    FaSignOutAlt,
    FaUserShield
} from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle';

const MobileMenu = ({
    isMobileMenuOpen,
    closeMobileMenu,
    theme,
    toggleTheme,
    setShowResumeModal,
    handleForceRefresh,
    isSyncing,
    currentUser,
    handleLogout,
    setShowLoginModal
}) => {
    return (
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
                            <a href="#competitive" className="menu-item" onClick={closeMobileMenu}>CP</a>
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
    );
};

export default MobileMenu;
