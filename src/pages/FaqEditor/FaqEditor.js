// src/pages/FaqEditor/FaqEditor.js
// FAQ editor component for managing FAQ content (without drag-and-drop functionality)

import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import useApiData from '../../hooks/useApiData';
import * as faqService from '../../services/faq';
import './FaqEditor.css';

// FaqCategoryItem - Renders a single FAQ category with its items
const FaqCategoryItem = ({
  category,
  categoryIndex,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState(category.category);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditCategory = () => {
    setIsEditing(true);
  };

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onUpdateCategory(categoryIndex, { ...category, category: categoryName.trim() });
      setIsEditing(false);
    }
  };

  const handleDeleteCategory = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      onDeleteCategory(categoryIndex);
    }
  };

  return (
    <div className="faq-category">
      <div className="faq-category-header">
        {isEditing ? (
          <form onSubmit={handleCategorySubmit} className="category-edit-form">
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryChange}
              autoFocus
              className="category-edit-input"
            />
            <div className="category-edit-actions">
              <button type="submit" className="save-btn">Save</button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => {
                  setIsEditing(false);
                  setCategoryName(category.category);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="category-info" onClick={toggleExpand}>
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                {isExpanded ? '▼' : '▶'}
              </span>
              <h3 className="category-title">{category.category}</h3>
              <span className="item-count">
                {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="category-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory();
                }}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory();
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
      
      {isExpanded && (
        <div className="faq-items-container">
          <div className="faq-items-list">
            {category.items.map((item, itemIndex) => (
              <div className="faq-item" key={`item-${categoryIndex}-${itemIndex}`}>
                <div className="faq-item-header">
                  <div className="faq-item-content">
                    <h4 className="faq-item-question">{item.question}</h4>
                    <p className="faq-item-answer">{item.answer}</p>
                  </div>
                  <div className="faq-item-actions">
                    <button 
                      onClick={() => onUpdateItem(categoryIndex, itemIndex, item)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this FAQ item?')) {
                          onDeleteItem(categoryIndex, itemIndex);
                        }
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onAddItem(categoryIndex)}
            className="add-item-btn"
          >
            Add FAQ Item
          </button>
        </div>
      )}
    </div>
  );
};

// FaqItemForm - Form for adding/editing FAQ items
const FaqItemForm = ({ 
  item = { question: '', answer: '' }, 
  onSave, 
  onCancel, 
  title 
}) => {
  const [faqItem, setFaqItem] = useState(item);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaqItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (faqItem.question.trim() && faqItem.answer.trim()) {
      onSave(faqItem);
    }
  };

  return (
    <div className="faq-form-overlay">
      <div className="faq-form-container">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit} className="faq-form">
          <div className="form-group">
            <label htmlFor="question">Question</label>
            <input
              type="text"
              id="question"
              name="question"
              value={faqItem.question}
              onChange={handleChange}
              placeholder="Enter the question"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Answer</label>
            <textarea
              id="answer"
              name="answer"
              value={faqItem.answer}
              onChange={handleChange}
              placeholder="Enter the answer"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CategoryForm - Form for adding new categories
const CategoryForm = ({ onSave, onCancel }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSave({ category: categoryName.trim(), items: [] });
      setCategoryName('');
    }
  };

  return (
    <div className="faq-form-overlay">
      <div className="category-form-container">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Add Category</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Language selector component
const LanguageSelector = ({ languages, currentLanguage, onLanguageChange }) => {
  return (
    <div className="language-selector">
      <label htmlFor="language-select">Language:</label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// Main FaqEditor component
const FaqEditor = () => {
  // State for FAQ data
  const [faqData, setFaqData] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ]);
  
  // UI state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [itemForm, setItemForm] = useState({
    visible: false,
    categoryIndex: null,
    itemIndex: null,
    item: null,
    isEdit: false
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Load FAQ data for the current language
  const { 
    data, 
    loading, 
    error,
    refetch 
  } = useApiData(
    () => faqService.getFaqContent(currentLanguage),
    [currentLanguage]
  );
  
  // Load available languages
  const {
    data: languagesData
  } = useApiData(
    () => faqService.getFaqLanguages(),
    []
  );
  
  // Update available languages when data is loaded
  useEffect(() => {
    if (languagesData) {
      setLanguages(languagesData);
    }
  }, [languagesData]);
  
  // Set FAQ data when loaded
  useEffect(() => {
    if (data) {
      setFaqData(data.content);
    }
  }, [data]);
  
  // Handle language change
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };
  
  // Add new category
  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };
  
  // Save new category
  const handleSaveCategory = (category) => {
    const updatedFaqData = [...faqData, category];
    setFaqData(updatedFaqData);
    setShowCategoryForm(false);
    saveFaqContent(updatedFaqData);
  };
  
  // Update category
  const handleUpdateCategory = (categoryIndex, updatedCategory) => {
    const updatedFaqData = [...faqData];
    updatedFaqData[categoryIndex] = updatedCategory;
    setFaqData(updatedFaqData);
    saveFaqContent(updatedFaqData);
  };
  
  // Delete category
  const handleDeleteCategory = (categoryIndex) => {
    const updatedFaqData = faqData.filter((_, index) => index !== categoryIndex);
    setFaqData(updatedFaqData);
    saveFaqContent(updatedFaqData);
  };
  
  // Add FAQ item
  const handleAddItem = (categoryIndex) => {
    setItemForm({
      visible: true,
      categoryIndex,
      itemIndex: null,
      item: { question: '', answer: '' },
      isEdit: false
    });
  };
  
  // Edit FAQ item
  const handleEditItem = (categoryIndex, itemIndex, item) => {
    setItemForm({
      visible: true,
      categoryIndex,
      itemIndex,
      item: { ...item },
      isEdit: true
    });
  };
  
  // Save FAQ item
  const handleSaveItem = (item) => {
    const { categoryIndex, itemIndex, isEdit } = itemForm;
    const updatedFaqData = [...faqData];
    
    if (isEdit) {
      // Update existing item
      updatedFaqData[categoryIndex].items[itemIndex] = item;
    } else {
      // Add new item
      updatedFaqData[categoryIndex].items.push(item);
    }
    
    setFaqData(updatedFaqData);
    setItemForm({ visible: false, categoryIndex: null, itemIndex: null, item: null, isEdit: false });
    saveFaqContent(updatedFaqData);
  };
  
  // Delete FAQ item
  const handleDeleteItem = (categoryIndex, itemIndex) => {
    const updatedFaqData = [...faqData];
    updatedFaqData[categoryIndex].items = updatedFaqData[categoryIndex].items.filter(
      (_, index) => index !== itemIndex
    );
    setFaqData(updatedFaqData);
    saveFaqContent(updatedFaqData);
  };
  
  // Save FAQ content to backend
  const saveFaqContent = async (content) => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      await faqService.updateFaqContent(currentLanguage, { content });
      setSaveMessage({ type: 'success', text: 'FAQ content saved successfully' });
      
      // Refresh data after save
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      setSaveMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to save FAQ content' 
      });
    } finally {
      setSaving(false);
      
      // Clear save message after a few seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="faq-editor-container">
      <Sidebar />
      <div className="main-content">
        <Header title="FAQ Editor" />
        
        <div className="faq-editor-controls">
          <LanguageSelector
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
          
          <button 
            onClick={handleAddCategory}
            className="add-category-btn"
          >
            Add New Category
          </button>
        </div>
        
        {saveMessage && (
          <div className={`save-message ${saveMessage.type}`}>
            {saveMessage.text}
          </div>
        )}
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading FAQ content...
          </div>
        ) : error ? (
          <div className="error-message">
            Error loading FAQ content: {error}
          </div>
        ) : faqData && faqData.length > 0 ? (
          <div className="faq-categories-list">
            {faqData.map((category, categoryIndex) => (
              <FaqCategoryItem
                key={`category-${categoryIndex}`}
                category={category}
                categoryIndex={categoryIndex}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddItem={handleAddItem}
                onUpdateItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No FAQ content found for this language.</p>
            <button 
              onClick={handleAddCategory}
              className="add-category-btn"
            >
              Add Your First Category
            </button>
          </div>
        )}
        
        {showCategoryForm && (
          <CategoryForm
            onSave={handleSaveCategory}
            onCancel={() => setShowCategoryForm(false)}
          />
        )}
        
        {itemForm.visible && (
          <FaqItemForm
            item={itemForm.item}
            onSave={handleSaveItem}
            onCancel={() => setItemForm({ visible: false, categoryIndex: null, itemIndex: null, item: null, isEdit: false })}
            title={itemForm.isEdit ? 'Edit FAQ Item' : 'Add FAQ Item'}
          />
        )}
      </div>
    </div>
  );
};

export default FaqEditor;