import { useState, useEffect } from 'react';
import { MESSAGES } from '../constants';
import { fetchDeleteAssignment, fetchUpdateAssignment } from '../services';

import './AssignmentItem.css';

function AssignmentItem({ assignment, onAssignmentDelete, onAssignmentUpdate, setError }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);


  const [title, setTitle] = useState(assignment?.title || '');
  const [course, setCourse] = useState(assignment?.course || '');
  const [dueDate, setDueDate] = useState(assignment?.dueDate || '');


  useEffect(() => {
    if (assignment) {

      if (assignment.title !== undefined) {
        setTitle(assignment.title || '');
      }

      if (assignment.course !== undefined) {
        setCourse(assignment.course || '');
      }

      if (assignment.dueDate !== undefined) {
        setDueDate(assignment.dueDate || '');
      }
    }
  }, [assignment?.title, assignment?.course, assignment?.dueDate]);


  let formattedDueDate = 'No due date';
  try {

    if (assignment?.dueDate && assignment.dueDate.trim()) {
      const dueDateObj = new Date(assignment.dueDate);

      if (!isNaN(dueDateObj.getTime())) {
        formattedDueDate = dueDateObj.toLocaleDateString();
      } else {
        formattedDueDate = 'Invalid date';
      }
    }
  } catch (e) {
    formattedDueDate = 'Invalid date';
    console.error('Error formatting date:', e);
  }


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysRemaining = null;
  let statusClass = 'on-time';
  let statusText = '';

  try {

    if (assignment?.dueDate && assignment.dueDate.trim()) {
      const dueDateObj = new Date(assignment.dueDate);
      if (!isNaN(dueDateObj.getTime())) {
        const dueDateTime = new Date(dueDateObj);
        dueDateTime.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((dueDateTime - today) / (1000 * 60 * 60 * 24));
      }
    }
  } catch (e) {
    console.error('Error calculating days remaining:', e);
  }


  if (assignment?.completed) {
    statusClass = 'completed';
    statusText = 'Completed';
  } else if (daysRemaining !== null) {
    if (daysRemaining < 0) {
      statusClass = 'overdue';
      statusText = 'Overdue';
    } else if (daysRemaining === 0) {
      statusClass = 'due-today';
      statusText = 'Due Today!';
    } else if (daysRemaining <= 2) {
      statusClass = 'due-soon';
      statusText = 'Due Soon';
    }
  }

  function handleToggleComplete() {
    const updates = {
      title: assignment.title,
      course: assignment.course,
      dueDate: assignment.dueDate,
      completed: !assignment.completed
    };

    fetchUpdateAssignment(assignment.id, updates)
      .then(updatedAssignment => {
        onAssignmentUpdate(updatedAssignment);
      })
      .catch(err => {
        setError(MESSAGES[err.error] || MESSAGES.default);
      });
  }

  function handleEdit() {

    if (assignment) {
      setTitle(assignment.title || '');
      setCourse(assignment.course || '');
      setDueDate(assignment.dueDate || '');
    }

    setIsEditing(true);
  }

  function handleDelete() {
    if (!assignment) return;

    setIsDeleting(true);

    fetchDeleteAssignment(assignment.id)
      .then(() => {
        if (onAssignmentDelete) {
          onAssignmentDelete(assignment.id);
        }
      })
      .catch(err => {
        setError(MESSAGES[err.error] || MESSAGES.default);
        setIsDeleting(false);
      });
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    if (!assignment) return;


    if (!title.trim() || !course.trim() || !dueDate) {
      setError('All fields are required');
      return;
    }

    const updates = {
      title: title.trim(),
      course: course.trim(),
      dueDate
    };

    fetchUpdateAssignment(assignment.id, updates)
      .then(updatedAssignment => {

        setIsEditing(false);


        if (onAssignmentUpdate) {


          const mergedAssignment = {
            ...assignment,
            ...updatedAssignment,
            title: updatedAssignment.title || assignment.title,
            course: updatedAssignment.course || assignment.course,
            dueDate: updatedAssignment.dueDate || assignment.dueDate
          };

          onAssignmentUpdate(mergedAssignment);
        }
      })
      .catch(err => {
        setError(MESSAGES[err.error] || MESSAGES.default);
      });
  }

  function handleCancelEdit() {

    setIsEditing(false);
  }


  if (!assignment) {
    return null;
  }


  if (isEditing) {
    return (
      <>
        <div className="assignment-modal-backdrop" onClick={handleCancelEdit}></div>
        <div className="assignment-edit-modal">
          <form onSubmit={handleEditSubmit}>
            <h3>Edit Assignment</h3>
            <div className="form-group">
              <label htmlFor={`title-${assignment.id}`}>Title:</label>
              <input
                id={`title-${assignment.id}`}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`course-${assignment.id}`}>Course:</label>
              <input
                id={`course-${assignment.id}`}
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`due-${assignment.id}`}>Due Date:</label>
              <input
                id={`due-${assignment.id}`}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="button save-button">Save</button>
              <button
                type="button"
                className="button cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }


  const toggleButtonClass = assignment.completed ? 'completed-button' : 'incomplete-button';
  const toggleButtonText = isTogglingComplete
    ? 'Saving...'
    : assignment.completed ? 'Mark Incomplete' : 'Mark Complete';

  return (
    <li className={`assignment-item ${statusClass}`}>
      <div className="assignment-content">
        <div className="assignment-details">
          <h4 className="assignment-title">{assignment.title || 'Untitled Assignment'}</h4>
          <div className="assignment-meta">
            <span className="assignment-course">Course: {assignment.course || 'No Course'}</span>
            <span className="assignment-due">Due: {formattedDueDate}</span>
            {statusText && <span className={`assignment-status ${statusClass}`}>{statusText}</span>}
          </div>
        </div>
      </div>

      <div className="assignment-actions">
        <button
          onClick={handleToggleComplete}
          className={`button toggle-button ${toggleButtonClass}`}
          disabled={isTogglingComplete}
        >
          {toggleButtonText}
        </button>
        <button
          onClick={handleEdit}
          className="button edit-button"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="button delete-button"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default AssignmentItem;