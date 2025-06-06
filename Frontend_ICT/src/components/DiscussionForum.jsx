import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DiscussionForum = ({ s_id }) => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [editingQueryId, setEditingQueryId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hoveredQuery, setHoveredQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussion();
  }, [s_id]);

  const fetchDiscussion = async () => {
    try {
      // Check authentication
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
        views: Math.floor(Math.random() * 1000), // Randomizing views for demonstration
        date: 'Just now', // Placeholder, replace with actual data if available
        isFavorite: false,
        user: { name: 'User', online: true }, // Placeholder, replace with actual data if available
      }));
      
      setQueries(discussion);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discussion:', error);
      const errorMessage = api.utils.handleError(error);
      alert(errorMessage);
      
      // Handle authentication errors
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
          ...queries,
          {
            id: response.questions[response.questions.length - 1]._id,
            text: newQuery,
            comments: [],
            views: Math.floor(Math.random() * 1000),
            date: 'Just now',
            isFavorite: false,
            user: { name: 'User', online: true },
          },
        ]);
        setNewQuery('');
      } catch (error) {
        console.error('Error posting query:', error);
        const errorMessage = api.utils.handleError(error);
        alert(`Failed to post query: ${errorMessage}`);
        
        // Handle authentication errors
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
        
        // Handle authentication errors
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
        
        // Handle authentication errors
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
        
        // Handle authentication errors
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

  const handleEditClick = (queryId, queryText) => {
    setEditingQueryId(queryId);
    setNewQuery(queryText);
  };

  const handleCancelEdit = () => {
    setEditingQueryId(null);
    setNewQuery('');
  };

  if (loading) {
    return <div style={styles.loading}>Loading discussion forum...</div>;
  }

  return (
    <div style={styles.forum}>
      <h2>Discussion Forum</h2>
      <div style={styles.querySection}>
        <textarea
          style={styles.textarea}
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
          placeholder={editingQueryId ? "Edit your question..." : "Post a new question..."}
        />
        <div style={styles.buttonGroup}>
          {editingQueryId ? (
            <>
              <button onClick={handleEditQuery} style={styles.button}>Update Query</button>
              <button onClick={handleCancelEdit} style={styles.cancelButton}>Cancel</button>
            </>
          ) : (
            <button onClick={handlePostQuery} style={styles.button}>Post Query</button>
          )}
        </div>
      </div>
      <div style={styles.queryList}>
        {queries.length === 0 ? (
          <div style={styles.noQuestions}>
            No questions yet. Be the first to ask a question!
          </div>
        ) : (
          queries.map((query) => (
            <div
              key={query.id}
              style={styles.query}
              onMouseEnter={() => setHoveredQuery(query.id)}
              onMouseLeave={() => setHoveredQuery(null)}
            >
              <div style={styles.queryHeader}>
                <div style={styles.userProfile}>
                  <div
                    style={{
                      ...styles.onlineStatus,
                      backgroundColor: query.user.online ? '#4caf50' : '#f44336',
                    }}
                  ></div>
                  <span>{query.user.name}</span>
                </div>
                <span>{query.date}</span>
              </div>
              <p style={styles.queryText}>{query.text}</p>
              <div style={styles.queryActions}>
                <span>{query.views} views</span>
                <button onClick={() => toggleFavorite(query.id)} style={styles.favoriteButton}>
                  {query.isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <button style={styles.shareButton}>Share</button>
              </div>
              {hoveredQuery === query.id && (
                <div style={styles.queryEditActions}>
                  <button 
                    onClick={() => handleEditClick(query.id, query.text)} 
                    style={styles.editButton}
                    disabled={editingQueryId !== null}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteQuery(query.id)} 
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              )}
              <div style={styles.comments}>
                {query.comments.map((comment, index) => (
                  <div key={index} style={styles.comment}>
                    <div style={styles.commentProfile}>
                      <div style={{ ...styles.onlineStatus, backgroundColor: '#4caf50' }}></div>
                      <span>Commenter</span>
                    </div>
                    <p>{comment}</p>
                  </div>
                ))}
                <input
                  type="text"
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newComment.trim()) {
                      handleAddComment(query.id, newComment.trim());
                    }
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  forum: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#666',
  },
  querySection: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#6c757d',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  queryList: {
    marginBottom: '20px',
  },
  noQuestions: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  query: {
    padding: '15px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '5px',
    transition: 'box-shadow 0.3s',
  },
  queryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
  },
  onlineStatus: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '5px',
  },
  queryText: {
    margin: '10px 0',
    lineHeight: '1.5',
    color: '#333',
  },
  queryActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  queryEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '5px',
    marginBottom: '10px',
  },
  favoriteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px',
  },
  shareButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
  },
  comments: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  comment: {
    display: 'flex',
    alignItems: 'flex-start',
    margin: '8px 0',
    padding: '8px',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
  },
  commentProfile: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    minWidth: 'fit-content',
  },
  commentInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '10px',
  },
};

export default DiscussionForum;