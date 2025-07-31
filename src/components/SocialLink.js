
import React from 'react';
import { motion } from "framer-motion";

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

export default SocialLink;
