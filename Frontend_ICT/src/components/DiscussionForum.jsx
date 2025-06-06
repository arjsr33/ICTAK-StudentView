import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DiscussionForum = ({ s_id }) => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [editingQueryId, setEditingQueryId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussion();
  }, [s_id]);

  const fetchDiscussion = async () => {
    try {
      if (!api.utils.isAuthenticated()) {
        alert('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      console.log(`Fetching discussion for student ID: ${s_id}`);
      const response = await api.discussion.getDiscussion(s_id);
      
      const discussion = response.questions.map((question) => ({
        id: question._id,
        text: question.question,
        comments: question.answers,
        views: Math.floor(Math.random() * 1000),
        date: new Date().toLocaleDateString(),
        isFavorite: false,
        isResolved: Math.random() > 0.7,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        user: { 
          name: 'Student', 
          online: true,
          avatar: '👨‍🎓'
        },
      }));
      
      setQueries(discussion);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discussion:', error);
      const errorMessage = api.utils.handleError(error);
      alert(errorMessage);
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        api.utils.removeToken();
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handlePostQuery = async () => {
    if (newQuery.trim()) {
      try {
        const response = await api.discussion.addQuestion(s_id, newQuery);
        
        setQueries([
          {
            id: response.questions[response.questions.length - 1]._id,
            text: newQuery,
            comments: [],
            views: 0,
            date: new Date().toLocaleDateString(),
            isFavorite: false,
            isResolved: false,
            priority: 'medium',
            user: { name: 'Student', online: true, avatar: '👨‍🎓' },
          },
          ...queries
        ]);
        setNewQuery('');
      } catch (error) {
        console.error('Error posting query:', error);
        const errorMessage = api.utils.handleError(error);
        alert(`Failed to post query: ${errorMessage}`);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    }
  };

  const handleAddComment = async (queryId, comment) => {
    if (comment.trim()) {
      try {
        await api.discussion.addAnswer(s_id, queryId, comment);
        
        setQueries(
          queries.map((q) =>
            q.id === queryId ? { ...q, comments: [...q.comments, comment] } : q
          )
        );
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
        const errorMessage = api.utils.handleError(error);
        alert(`Failed to add comment: ${errorMessage}`);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    }
  };

  const handleEditQuery = async () => {
    if (newQuery.trim() && editingQueryId) {
      try {
        await api.discussion.editQuestion(s_id, editingQueryId, newQuery);
        
        setQueries(
          queries.map((q) =>
            q.id === editingQueryId ? { ...q, text: newQuery } : q
          )
        );
        setNewQuery('');
        setEditingQueryId(null);
      } catch (error) {
        console.error('Error editing query:', error);
        const errorMessage = api.utils.handleError(error);
        alert(`Failed to edit query: ${errorMessage}`);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    }
  };

  const handleDeleteQuery = async (queryId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.discussion.deleteQuestion(s_id, queryId);
        setQueries(queries.filter((q) => q.id !== queryId));
      } catch (error) {
        console.error('Error deleting query:', error);
        const errorMessage = api.utils.handleError(error);
        alert(`Failed to delete query: ${errorMessage}`);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          api.utils.removeToken();
          navigate('/login');
        }
      }
    }
  };

  const toggleFavorite = (id) => {
    setQueries(queries.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q)));
  };

  const toggleResolved = (id) => {
    setQueries(queries.map((q) => (q.id === id ? { ...q, isResolved: !q.isResolved } : q)));
  };

  const handleEditClick = (queryId, queryText) => {
    setEditingQueryId(queryId);
    setNewQuery(queryText);
  };

  const handleCancelEdit = () => {
    setEditingQueryId(null);
    setNewQuery('');
  };

  const filteredQueries = queries.filter(query => {
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'favorites' && query.isFavorite) ||
                         (filterBy === 'resolved' && query.isResolved) ||
                         (filterBy === 'unresolved' && !query.isResolved);
    
    const matchesSearch = query.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFE66D';
      case 'low': return '#4ECDC4';
      default: return '#94A3B8';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <h3 style={styles.loadingText}>Loading discussion forum...</h3>
      </div>
    );
  }

  return (
    <>
      <div style={styles.forumContainer}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h2 style={styles.title}>💬 Discussion Forum</h2>
              <p style={styles.subtitle}>Connect, collaborate, and get help from your peers</p>
            </div>
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{queries.length}</span>
                <span style={styles.statLabel}>Questions</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{queries.filter(q => q.isResolved).length}</span>
                <span style={styles.statLabel}>Resolved</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{queries.reduce((acc, q) => acc + q.comments.length, 0)}</span>
                <span style={styles.statLabel}>Answers</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Question Section */}
        <div style={styles.newQuestionSection}>
          <div style={styles.newQuestionHeader}>
            <span style={styles.questionIcon}>🤔</span>
            <h3 style={styles.newQuestionTitle}>
              {editingQueryId ? 'Edit Your Question' : 'Ask a New Question'}
            </h3>
          </div>
          
          <div style={styles.newQuestionForm}>
            <textarea
              style={styles.questionInput}
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder={editingQueryId ? "Edit your question..." : "What would you like to ask your peers?"}
              rows={4}
            />
            <div style={styles.formActions}>
              {editingQueryId ? (
                <div style={styles.editActions}>
                  <button onClick={handleEditQuery} style={styles.primaryButton}>
                    ✏️ Update Question
                  </button>
                  <button onClick={handleCancelEdit} style={styles.secondaryButton}>
                    ❌ Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handlePostQuery} 
                  style={{
                    ...styles.primaryButton,
                    ...(newQuery.trim() ? {} : styles.disabledButton)
                  }}
                  disabled={!newQuery.trim()}
                >
                  🚀 Post Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div style={styles.controlsSection}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterContainer}>
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Questions</option>
              <option value="favorites">⭐ Favorites</option>
              <option value="resolved">✅ Resolved</option>
              <option value="unresolved">❓ Unresolved</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div style={styles.questionsList}>
          {filteredQueries.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🤷‍♂️</div>
              <h3 style={styles.emptyTitle}>
                {searchTerm || filterBy !== 'all' ? 'No matching questions found' : 'No questions yet'}
              </h3>
              <p style={styles.emptySubtitle}>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to ask a question and start the discussion!'
                }
              </p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <div key={query.id} style={styles.questionCard} className="question-card">
                {/* Question Header */}
                <div style={styles.questionHeader}>
                  <div style={styles.userInfo}>
                    <div style={styles.userAvatar}>{query.user.avatar}</div>
                    <div style={styles.userDetails}>
                      <span style={styles.userName}>{query.user.name}</span>
                      <div style={styles.questionMeta}>
                        <span style={styles.dateText}>{query.date}</span>
                        <div 
                          style={{
                            ...styles.priorityBadge,
                            backgroundColor: getPriorityColor(query.priority)
                          }}
                        >
                          {query.priority}
                        </div>
                        {query.isResolved && (
                          <div style={styles.resolvedBadge}>✅ Resolved</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.questionActions}>
                    <button 
                      onClick={() => toggleFavorite(query.id)}
                      style={{
                        ...styles.actionButton,
                        color: query.isFavorite ? '#FFD700' : '#94A3B8'
                      }}
                      className="action-button"
                      title={query.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {query.isFavorite ? '⭐' : '☆'}
                    </button>
                    <button 
                      onClick={() => toggleResolved(query.id)}
                      style={{
                        ...styles.actionButton,
                        color: query.isResolved ? '#10B981' : '#94A3B8'
                      }}
                      className="action-button"
                      title={query.isResolved ? 'Mark as unresolved' : 'Mark as resolved'}
                    >
                      ✅
                    </button>
                    <div style={styles.dropdown} className="dropdown">
                      <button style={styles.moreButton} className="more-button">⋯</button>
                      <div style={styles.dropdownContent} className="dropdown-content">
                        <button 
                          onClick={() => handleEditClick(query.id, query.text)}
                          style={styles.dropdownItem}
                          className="dropdown-item"
                          disabled={editingQueryId !== null}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteQuery(query.id)}
                          style={styles.dropdownItem}
                          className="dropdown-item"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div style={styles.questionContent}>
                  <p style={styles.questionText}>{query.text}</p>
                  
                  <div style={styles.questionStats}>
                    <span style={styles.statChip}>
                      👁️ {query.views} views
                    </span>
                    <span style={styles.statChip}>
                      💬 {query.comments.length} answers
                    </span>
                    <button 
                      onClick={() => setExpandedQuery(expandedQuery === query.id ? null : query.id)}
                      style={styles.expandButton}
                      className="expand-button"
                    >
                      {expandedQuery === query.id ? '🔽 Hide Answers' : '🔼 Show Answers'}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedQuery === query.id && (
                  <div style={styles.commentsSection}>
                    <div style={styles.commentsHeader}>
                      <h4 style={styles.commentsTitle}>💬 Answers ({query.comments.length})</h4>
                    </div>
                    
                    <div style={styles.commentsList}>
                      {query.comments.map((comment, index) => (
                        <div key={index} style={styles.commentItem}>
                          <div style={styles.commentAvatar}>👤</div>
                          <div style={styles.commentContent}>
                            <div style={styles.commentHeader}>
                              <span style={styles.commentAuthor}>Student {index + 1}</span>
                              <span style={styles.commentDate}>Just now</span>
                            </div>
                            <p style={styles.commentText}>{comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={styles.addCommentSection}>
                      <div style={styles.commentInputContainer}>
                        <input
                          type="text"
                          style={styles.commentInput}
                          placeholder="Write an answer..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newComment.trim()) {
                              handleAddComment(query.id, newComment.trim());
                            }
                          }}
                        />
                        <button 
                          onClick={() => handleAddComment(query.id, newComment.trim())}
                          style={{
                            ...styles.sendButton,
                            ...(newComment.trim() ? {} : styles.disabledButton)
                          }}
                          className="send-button"
                          disabled={!newComment.trim()}
                        >
                          📤
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Hover effects */
        .dropdown:hover .dropdown-content {
          display: block !important;
        }
        
        .dropdown-item:hover {
          background-color: #F3F4F6 !important;
        }
        
        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
        }
        
        .action-button:hover {
          background-color: rgba(156, 163, 175, 0.1) !important;
          transform: scale(1.1);
        }
        
        .expand-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }
        
        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .forum-container {
            padding: 1rem !important;
          }
          
          .header-content {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .stats {
            justify-content: center !important;
          }
          
          .controls-section {
            flex-direction: column !important;
          }
          
          .search-container {
            min-width: auto !important;
          }
          
          .question-header {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: flex-start !important;
          }
          
          .question-actions {
            align-self: stretch !important;
            justify-content: flex-end !important;
          }
          
          .question-meta {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: flex-start !important;
          }
          
          .question-stats {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          
          .form-actions {
            flex-direction: column !important;
          }
          
          .edit-actions {
            flex-direction: column !important;
          }
          
          .comment-input-container {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .send-button {
            align-self: flex-end !important;
          }
        }
        
        @media (max-width: 480px) {
          .title {
            font-size: 2rem !important;
          }
          
          .new-question-title {
            font-size: 1.2rem !important;
          }
          
          .user-avatar {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.2rem !important;
          }
          
          .question-card {
            padding: 1rem !important;
          }
          
          .new-question-section {
            padding: 1.5rem !important;
          }
          
          .header {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  forumContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    background: 'transparent',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#667eea',
  },
  
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  
  loadingText: {
    color: '#4B5563',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
    color: 'white',
  },
  
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  
  titleSection: {
    flex: 1,
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
  },
  
  stats: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  
  statItem: {
    textAlign: 'center',
  },
  
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: 1,
  },
  
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  newQuestionSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  
  newQuestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  
  questionIcon: {
    fontSize: '2rem',
  },
  
  newQuestionTitle: {
    color: '#1F2937',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
  },
  
  newQuestionForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  questionInput: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    outline: 'none',
  },
  
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  
  editActions: {
    display: 'flex',
    gap: '1rem',
  },
  
  primaryButton: {
    background: 'linear-gradient(135deg, #10B981, #059669)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  
  secondaryButton: {
    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  controlsSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '300px',
  },
  
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
    color: '#6B7280',
  },
  
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  
  filterContainer: {
    minWidth: '200px',
  },
  
  filterSelect: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    outline: 'none',
  },
  
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '2px dashed #D1D5DB',
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  emptyTitle: {
    color: '#374151',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  
  emptySubtitle: {
    color: '#6B7280',
    fontSize: '1rem',
  },
  
  questionCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  userName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1F2937',
  },
  
  questionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  
  dateText: {
    fontSize: '0.9rem',
    color: '#6B7280',
  },
  
  priorityBadge: {
    fontSize: '0.75rem',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  resolvedBadge: {
    background: '#10B981',
    color: 'white',
    fontSize: '0.75rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontWeight: '600',
  },
  
  questionActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  actionButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  
  moreButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    color: '#6B7280',
  },
  
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    right: 0,
    background: 'white',
    minWidth: '120px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    zIndex: 1,
    overflow: 'hidden',
  },
  
  dropdownItem: {
    color: '#374151',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    display: 'block',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease',
  },
  
  questionContent: {
    marginBottom: '1rem',
  },
  
  questionText: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: '1rem',
  },
  
  questionStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  
  statChip: {
    background: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  
  expandButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  commentsSection: {
    borderTop: '2px solid #F3F4F6',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
  },
  
  commentsHeader: {
    marginBottom: '1rem',
  },
  
  commentsTitle: {
    color: '#374151',
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: 0,
  },
  
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  
  commentItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(249, 250, 251, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(229, 231, 235, 0.5)',
  },
  
  commentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: 'white',
    flexShrink: 0,
  },
  
  commentContent: {
    flex: 1,
  },
  
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  
  commentAuthor: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
  },
  
  commentDate: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
  },
  
  commentText: {
    color: '#4B5563',
    lineHeight: 1.5,
    margin: 0,
  },
  
  addCommentSection: {
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px dashed #D1D5DB',
  },
  
  commentInputContainer: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  
  commentInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '25px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  
  sendButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
};

export default DiscussionForum;