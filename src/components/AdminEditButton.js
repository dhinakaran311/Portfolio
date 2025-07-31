
import React from 'react';
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";

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

export default AdminEditButton;
