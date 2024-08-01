import React, { useState, useEffect } from 'react';

const VivaVoce = () => {
  const [projectReportSubmitted, setProjectReportSubmitted] = useState(false);
  const [submissionLinkVisible, setSubmissionLinkVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [countdown, setCountdown] = useState('');
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    if (projectReportSubmitted) {
      setSubmissionLinkVisible(true);
    }

    const deadline = new Date('2024-08-01T23:59:59');
    const interval = setInterval(() => {
      const now = new Date();
      const timeLeft = deadline - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [projectReportSubmitted]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment || !file) {
      alert('Please provide comments and upload a file.');
      return;
    }
    alert('Viva Voce submitted successfully!');
    setProgress(100);
  };

  const handleProjectReportSubmit = () => {
    setProjectReportSubmitted(true);
    // alert('Project report submitted successfully!');
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleStepHover = (step) => {
    setHoveredStep(step);
  };

  const handleStepLeave = () => {
    setHoveredStep(null);
  };

  const stepDetails = {
    1: 'Introduction: Briefly introduce your project and your role in it.',
    2: 'Methodology: Explain the methodology used in the project.',
    3: 'Findings: Present the key findings and results of your project.',
    4: 'Challenges: Discuss any challenges faced and how you overcame them.',
    5: 'Q&A: Be ready for a Q&A session with the evaluators.',
    6: 'Conclusion: Conclude with the future scope of your project.',
  };

  return (
    <div style={styles.vivaVoce}>
      <h2 style={styles.header}>Viva Voce Format</h2>
      <div style={styles.countdown}>
        <h3>Countdown to Submission Deadline</h3>
        <p>{countdown}</p>
      </div>

      <div style={styles.progressTracker}>
        {Object.entries(stepDetails).map(([step, detail]) => (
          <div
            key={step}
            style={styles.progressStep}
            onMouseEnter={() => handleStepHover(step)}
            onMouseLeave={handleStepLeave}
          >
            {`${step}. ${detail.split(':')[0]}`}
            {hoveredStep === step && (
              <div style={styles.stepDetail}>
                <p>{detail}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={toggleModal} style={styles.guidelinesButton}>View Detailed Guidelines</button>

      {modalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Detailed Guidelines</h3>
            <p>Here are the detailed guidelines for preparing your Viva Voce:</p>
            <ul>
              {Object.values(stepDetails).map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
            <button onClick={toggleModal} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      {!projectReportSubmitted ? (
        <div style={styles.submissionLink}>
          { <h3 style={styles.submissionHeader}>Submit Your Viva</h3> }
          { <button onClick={handleProjectReportSubmit} style={styles.button}>Submit</button> }
        </div>
      ) : (
        submissionLinkVisible && (
          <div style={styles.submissionLink}>
            <h3 style={styles.submissionHeader}>Submit Your Viva Voce</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="comments" style={styles.label}>Comments:</label>
                <textarea
                  id="comments"
                  name="comments"
                  rows="4"
                  cols="50"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="fileUpload" style={styles.label}>Upload File:</label>
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={handleFileChange}
                  style={styles.input}
                />
                {file && (
                  <div style={styles.filePreview}>
                    <p>File: {file.name}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      style={styles.removeFileButton}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <button type="submit" style={styles.button}>Submit</button>
            </form>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  vivaVoce: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  progressTracker: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  progressStep: {
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    margin: '0 5px',
    color: '#007bff',
    position: 'relative',
    cursor: 'pointer',
  },
  stepDetail: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    width: '200px',
    textAlign: 'left',
  },
  submissionLink: {
    marginTop: '20px',
    textAlign: 'center',
  },
  submissionHeader: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
    maxWidth: '500px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  filePreview: {
    marginTop: '10px',
    backgroundColor: '#e9ecef',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'left',
  },
  removeFileButton: {
    marginTop: '5px',
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  infoText: {
    textAlign: 'center',
    color: '#555',
  },
  countdown: {
    marginTop: '30px',
    textAlign: 'center',
    color: '#007bff',
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    marginTop: '20px',
  },
  progressBar: {
    height: '20px',
    backgroundColor: '#28a745',
    borderRadius: '5px',
  },
  guidelinesButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  modalContent: {
    textAlign: 'left',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default VivaVoce;