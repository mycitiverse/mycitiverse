// src/utils/GAHelper.js
import ReactGA from "react-ga4";

/**
 * Send a custom event to Google Analytics
 * @param {string} category - Group of interactions (e.g., 'Button', 'Form')
 * @param {string} action - The action performed (e.g., 'Clicked', 'Submitted')
 * @param {string} label - Additional info (e.g., 'Signup Button', 'Contact Form')
 * @param {number} value - Optional: a numerical value (e.g., price, score)
 */
export const trackEvent = ({ category, action, label, value }) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};
