
/**
 * Format date in a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

/**
 * Get file icon based on file type
 * @param {string} type - File type/extension
 * @returns {React.ReactNode} - Icon component
 */
export const getFileIcon = (type) => {
  // This function is now implemented in FilesList.jsx directly
  // But could be moved here if needed in multiple places
};
