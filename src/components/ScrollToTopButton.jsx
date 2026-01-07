import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = ({ showScrollButton, scrollToTop }) => {
    if (!showScrollButton) return null;

    return (
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
    );
};

export default ScrollToTopButton;
