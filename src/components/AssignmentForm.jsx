import { useState } from 'react';
import { fetchAddAssignment } from '../services';
import './AssignmentForm.css';

function AssignmentForm({ onBack, onAdded, setError }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!course.trim()) {
      errors.course = 'Course is required';
    }

    if (!dueDate) {
      errors.dueDate = 'Due date is required';
    } else {

      const selectedDate = new Date(dueDate);
      if (selectedDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const newAssignment = {
        title: title.trim(),
        course: course.trim(),
        dueDate,
      };


      fetchAddAssignment(newAssignment)
        .then(() => {

          onAdded();
        })
        .catch(err => {
          setError(err.error || 'Failed to add assignment');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  return (
    <div className="assignment-form-container">
      <div className="assignment-form-header">
        <h2>Add New Assignment</h2>
        <button onClick={onBack} className="back-button">
          Back to Assignments
        </button>
      </div>

      <form className="assignment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Assignment Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={formErrors.title ? 'error' : ''}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          {formErrors.dueDate && <div className="error-message">{formErrors.dueDate}</div>}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="button submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Assignment'}
          </button>
          <button
            type="button"
            className="button cancel-button"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssignmentForm;