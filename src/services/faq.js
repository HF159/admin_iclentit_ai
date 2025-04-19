// src/services/faq.js
// Service for FAQ management-related API calls

import apiClient from './apiClient';

/**
 * Get FAQ content for a specific language
 * @param {string} lang - Language code (default: 'en')
 * @returns {Promise} - Promise that resolves to FAQ content
 */
export const getFaqContent = (lang = 'en') => {
  return apiClient.get(`/admin/faq/${lang}`);
};

/**
 * Update FAQ content for a specific language
 * @param {string} lang - Language code
 * @param {Object} content - Updated FAQ content
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const updateFaqContent = (lang, content) => {
  return apiClient.put(`/admin/faq/${lang}`, content);
};

/**
 * Add a new FAQ category
 * @param {string} lang - Language code
 * @param {Object} category - New category data
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const addFaqCategory = (lang, category) => {
  return apiClient.post(`/admin/faq/${lang}/category`, category);
};

/**
 * Delete a FAQ category
 * @param {string} lang - Language code
 * @param {string} categoryName - Category name to delete
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const deleteFaqCategory = (lang, categoryName) => {
  return apiClient.delete(`/admin/faq/${lang}/category/${categoryName}`);
};

/**
 * Add a new FAQ item to a category
 * @param {string} lang - Language code
 * @param {string} categoryName - Category name
 * @param {Object} faqItem - New FAQ item data
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const addFaqItem = (lang, categoryName, faqItem) => {
  return apiClient.post(`/admin/faq/${lang}/category/${categoryName}/item`, faqItem);
};

/**
 * Update a FAQ item
 * @param {string} lang - Language code
 * @param {string} categoryName - Category name
 * @param {number} itemIndex - Item index in the category
 * @param {Object} faqItem - Updated FAQ item data
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const updateFaqItem = (lang, categoryName, itemIndex, faqItem) => {
  return apiClient.put(`/admin/faq/${lang}/category/${categoryName}/item/${itemIndex}`, faqItem);
};

/**
 * Delete a FAQ item
 * @param {string} lang - Language code
 * @param {string} categoryName - Category name
 * @param {number} itemIndex - Item index in the category
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const deleteFaqItem = (lang, categoryName, itemIndex) => {
  return apiClient.delete(`/admin/faq/${lang}/category/${categoryName}/item/${itemIndex}`);
};

/**
 * Reorder FAQ categories
 * @param {string} lang - Language code
 * @param {Array} order - New category order (array of category names)
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const reorderFaqCategories = (lang, order) => {
  return apiClient.put(`/admin/faq/${lang}/reorder-categories`, { order });
};

/**
 * Reorder FAQ items within a category
 * @param {string} lang - Language code
 * @param {string} categoryName - Category name
 * @param {Array} order - New item order (array of item indices)
 * @returns {Promise} - Promise that resolves to updated FAQ content
 */
export const reorderFaqItems = (lang, categoryName, order) => {
  return apiClient.put(`/admin/faq/${lang}/category/${categoryName}/reorder-items`, { order });
};

/**
 * Get available languages for FAQ content
 * @returns {Promise} - Promise that resolves to available languages
 */
export const getFaqLanguages = () => {
  return apiClient.get('/admin/faq/languages');
};