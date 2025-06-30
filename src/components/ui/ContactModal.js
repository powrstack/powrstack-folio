'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../forms/ContactForm';

const ContactModal = memo(function ContactModal({ 
  isOpen, 
  onClose, 
  resumeData 
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal modal-open"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <div className="modal-action">
          <motion.button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
            aria-label="Close contact form"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>
        <ContactForm resumeData={resumeData} />
      </motion.div>
      <div className="modal-backdrop" onClick={onClose}>
        <button aria-label="Close modal">close</button>
      </div>
    </motion.div>
  );
});

export default ContactModal;
