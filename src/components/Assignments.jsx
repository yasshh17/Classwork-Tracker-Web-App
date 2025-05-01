import { useState } from 'react';
import { MESSAGES } from '../constants';
import { fetchAddAssignment } from '../services';
import AssignmentList from './AssignmentList';
import AddAssignmentForm from './AssignmentForm';

import './Assignments.css';

function Assignments({ assignments, onAssignmentAdd, onAssignmentDelete, onAssignmentUpdate, setError }) {
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAddAssignment(assignmentData) {
    fetchAddAssignment(assignmentData)
      .then(assignment => {
        onAssignmentAdd(assignment);
        setShowAddForm(false);
      })
      .catch(err => {
        setError(MESSAGES[err.error] || MESSAGES.default);
      });
  }

  function toggleAddForm() {
    setShowAddForm(!showAddForm);
  }


  const pendingAssignments = assignments.filter(assignment => !assignment.completed);
  const completedAssignments = assignments.filter(assignment => assignment.completed);


  pendingAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="assignments">
      <div className="assignments-header">
        <h2>Your Assignments</h2>
        <button
          onClick={toggleAddForm}
          className="button toggle-add-form"
        >
          {showAddForm ? 'Cancel' : 'Add Assignment'}
        </button>
      </div>

      {showAddForm && (
        <AddAssignmentForm
          onAddAssignment={handleAddAssignment}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="assignments-lists">
        <div className="pending-assignments">
          <h3>Pending Assignments ({pendingAssignments.length})</h3>
          {pendingAssignments.length === 0 ? (
            <p className="no-assignments">No pending assignments. Good job!</p>
          ) : (
            <AssignmentList
              assignments={pendingAssignments}
              onAssignmentDelete={onAssignmentDelete}
              onAssignmentUpdate={onAssignmentUpdate}
              setError={setError}
            />
          )}
        </div>

        <div className="completed-assignments">
          <h3>Completed Assignments ({completedAssignments.length})</h3>
          {completedAssignments.length === 0 ? (
            <p className="no-assignments">No completed assignments yet.</p>
          ) : (
            <AssignmentList
              assignments={completedAssignments}
              onAssignmentDelete={onAssignmentDelete}
              onAssignmentUpdate={onAssignmentUpdate}
              setError={setError}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;