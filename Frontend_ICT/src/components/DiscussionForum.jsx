import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionForum = ({ s_id }) => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [editingQueryId, setEditingQueryId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hoveredQuery, setHoveredQuery] = useState(null);

  useEffect(() => {
    fetchDiscussion();
  }, [s_id]);

  const fetchDiscussion = async () => {
    try {
      console.log(`Fetching discussion for student ID: ${s_id}`);
      const response = await axios.get(`https://ict-student-view-server.vercel.app/api/discussion/discussion/${s_id}`);
      const discussion = response.data.questions.map(question => ({
        id: question._id,
        text: question.question,
        comments: question.answers,
        views: Math.floor(Math.random() * 1000), // Randomizing views for demonstration
        date: 'Just now', // Placeholder, replace with actual data if available
        isFavorite: false,
        user: { name: 'User', online: true } // Placeholder, replace with actual data if available
      }));
      setQueries(discussion);
    } catch (error) {
      console.error('Error fetching discussion:', error);
    }
  };

  const handlePostQuery = async () => {
    if (newQuery.trim()) {
      try {
        const response = await axios.post(`https://ict-student-view-server.vercel.app/api/discussion/discussion/${s_id}/question`, { question: newQuery });
        setQueries([...queries, {
          id: response.data.questions[response.data.questions.length - 1]._id,
          text: newQuery,
          comments: [],
          views: Math.floor(Math.random() * 1000),
          date: 'Just now',
          isFavorite: false,
          user: { name: 'User', online: true }
        }]);
        setNewQuery('');
      } catch (error) {
        console.error('Error posting query:', error);
      }
    }
  };

  const handleAddComment = async (queryId, comment) => {
    if (comment.trim()) {
      try {
        await axios.post(`https://ict-student-view-server.vercel.app/api/discussion/discussion/${s_id}/question/${queryId}/answer`, { answer: comment });
        setQueries(queries.map(q => 
          q.id === queryId ? { ...q, comments: [...q.comments, comment] } : q
        ));
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleEditQuery = async () => {
    if (newQuery.trim() && editingQueryId) {
      try {
        const response = await axios.put(`https://ict-student-view-server.vercel.app/api/discussion/discussion/${s_id}/question/${editingQueryId}`, { questionText: newQuery });
        setQueries(queries.map(q => q.id === editingQueryId ? { ...q, text: newQuery } : q));
        setNewQuery('');
        setEditingQueryId(null);
      } catch (error) {
        console.error('Error editing query:', error);
      }
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      await axios.delete(`https://ict-student-view-server.vercel.app/api/discussion/discussion/${s_id}/question/${queryId}`);
      setQueries(queries.filter(q => q.id !== queryId));
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  const toggleFavorite = (id) => {
    setQueries(queries.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  return (
    <div style={styles.forum}>
      <h2>Discussion Forum</h2>
      <div style={styles.querySection}>
        <textarea 
          style={styles.textarea}
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
          placeholder="Post a new query or edit an existing one..."
        />
        {editingQueryId ? (
          <button onClick={handleEditQuery} style={styles.button}>Update Query</button>
        ) : (
          <button onClick={handlePostQuery} style={styles.button}>Post Query</button>
        )}
      </div>
      <div style={styles.queryList}>
        {queries.map(query => (
          <div 
            key={query.id} 
            style={styles.query}
            onMouseEnter={() => setHoveredQuery(query.id)}
            onMouseLeave={() => setHoveredQuery(null)}
          >
            <div style={styles.queryHeader}>
              <div style={styles.userProfile}>
                <div style={{ ...styles.onlineStatus, backgroundColor: query.user.online ? '#4caf50' : '#f44336' }}></div>
                <span>{query.user.name}</span>
              </div>
              <span>{query.date}</span>
            </div>
            <p>{query.text}</p>
            <div style={styles.queryActions}>
              <span>{query.views} views</span>
              <button onClick={() => toggleFavorite(query.id)} style={styles.favoriteButton}>
                {query.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button style={styles.shareButton}>Share</button>
            </div>
            {hoveredQuery === query.id && (
              <div style={styles.queryEditActions}>
                <button onClick={() => setEditingQueryId(query.id)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDeleteQuery(query.id)} style={styles.deleteButton}>Delete</button>
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
        ))}
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
  querySection: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  queryList: {
    marginBottom: '20px',
  },
  query: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '5px',
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
  queryActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  queryEditActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  favoriteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '5px',
  },
  shareButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  editButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
  },
  comments: {
    marginTop: '10px',
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
    padding: '5px',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
  },
  commentProfile: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
  },
  commentInput: {
    width: '100%',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

export default DiscussionForum;
