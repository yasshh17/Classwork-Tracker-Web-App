import { useState, useEffect } from 'react';
import { fetchAssignment, fetchUpdateAssignment, fetchDeleteAssignment } from '../services';
import './AssignmentDetail.css';

function AssignmentDetail({ id, onBack, onUpdated, setError }) {
  const [assignment, setAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetchAssignment(id)
      .then(data => {
        setAssignment(data);

        setTitle(data.title || '');
        setCourse(data.course || '');
        setDueDate(data.dueDate || '');
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.error || 'Failed to load assignment');
        setIsLoading(false);
      });
  }, [id, setError]);

  function validateForm() {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!course.trim()) {
      errors.course = 'Course is required';
    }

    if (!dueDate) {
      errors.dueDate = 'Due date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      const updates = {
        title: title.trim(),
        course: course.trim(),
        dueDate
      };

      fetchUpdateAssignment(id, updates)
        .then(updatedAssignment => {
          setAssignment(updatedAssignment);
          setIsEditing(false);
          setError('');
        })
        .catch(err => {
          setError(err.error || 'Failed to update assignment');
        });
    }
  }

  function handleDelete() {
    setIsDeleting(true);

    fetchDeleteAssignment(id)
      .then(() => {
        onUpdated();
      })
      .catch(err => {
        setError(err.error || 'Failed to delete assignment');
        setIsDeleting(false);
      });
  }

  function handleToggleComplete() {
    fetchUpdateAssignment(id, { completed: !assignment.completed })
      .then(updatedAssignment => {
        setAssignment(updatedAssignment);
      })
      .catch(err => {
        setError(err.error || 'Failed to update assignment');
      });
  }

  function formatDate(dateString) {
    try {
      if (!dateString) return 'No due date';

      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return dateObj.toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  }

  function getDueStatus() {
    if (!assignment) return { class: '', text: '' };

    if (assignment.completed) {
      return { class: 'completed', text: 'Completed' };
    }

    try {
      if (!assignment.dueDate) {
        return { class: 'no-date', text: 'No Due Date' };
      }

      const now = new Date();
      const dueDate = new Date(assignment.dueDate);

      if (isNaN(dueDate.getTime())) {
        return { class: 'invalid-date', text: 'Invalid Date' };
      }

      if (dueDate < now) {
        return { class: 'overdue', text: 'Overdue' };
      }

      const diffTime = Math.abs(dueDate - now);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        return { class: 'due-today', text: 'Due Today' };
      }

      if (diffDays <= 3) {
        return { class: 'due-soon', text: 'Due Soon' };
      }

      return { class: 'upcoming', text: 'Upcoming' };
    } catch (e) {
      console.error('Error calculating due status:', e);
      return { class: 'error', text: 'Error' };
    }
  }

  if (isLoading) {
    return <div className="loading-message">Loading assignment...</div>;
  }

  if (!assignment) {
    return <div className="error-message">Assignment not found</div>;
  }

  const dueStatus = getDueStatus();

  return (
    <div className="assignment-detail">
      <div className="assignment-detail-header">
        <h2>Assignment Details</h2>
        <button onClick={onBack} className="back-button">
          Back to Assignments
        </button>
      </div>

      {isEditing ? (
        <form className="assignment-edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Assignment Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={formErrors.title ? 'error' : ''}
            />
            {formErrors.title && <div className="error-message">{formErrors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <input
              id="course"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={formErrors.course ? 'error' : ''}
            />
            {formErrors.course && <div className="error-message">{formErrors.course}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={formErrors.dueDate ? 'error' : ''}
            />
            {formErrors.dueDate && <div className="error-message">{formErrors.dueDate}</div>}
          </div>

          <div className="form-buttons">
            <button type="submit" className="button save-button">Save Changes</button>
            <button
              type="button"
              className="button cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="assignment-content">
          <div className="assignment-header">
            <h3 className="assignment-title">{assignment.title}</h3>
            <div className={`assignment-status ${dueStatus.class}`}>
              {dueStatus.text}
            </div>
          </div>

          <div className="assignment-info">
            <div className="info-row">
              <span className="info-label">Course:</span>
              <span className="info-value">{assignment.course}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Due Date:</span>
              <span className="info-value">{formatDate(assignment.dueDate)}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value">
                {assignment.completed ? 'Completed' : 'Not Completed'}
              </span>
            </div>

            {assignment.createdAt && (
              <div className="info-row">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {formatDate(assignment.createdAt)}
                </span>
              </div>
            )}

            {assignment.updatedAt && (
              <div className="info-row">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {formatDate(assignment.updatedAt)}
                </span>
              </div>
            )}
          </div>

          <div className="assignment-actions">
            <div className="completion-toggle">
              <label className="checkbox-container detail-checkbox">
                <input
                  type="checkbox"
                  checked={assignment.completed}
                  onChange={handleToggleComplete}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">
                  Mark as {assignment.completed ? 'incomplete' : 'complete'}
                </span>
              </label>
            </div>

            <div className="action-buttons">
              <button
                className="button edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>

              <button
                className="button delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentDetail;