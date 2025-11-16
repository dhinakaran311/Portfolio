import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FaSun className="theme-icon" />
      ) : (
        <FaMoon className="theme-icon" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
