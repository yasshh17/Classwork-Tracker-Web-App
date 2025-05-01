import { useState, useEffect } from 'react';
import AssignmentItem from './AssignmentItem';
import './AssignmentList.css';

function AssignmentList({
  assignments,
  onFilterChange,
  onPageChange,
  filters = {},
  pagination,
  setError
}) {

  const [courseFilter, setCourseFilter] = useState(filters.course || '');
  const [completionFilter, setCompletionFilter] = useState(
    filters.completed === undefined ? 'all' : (filters.completed ? 'completed' : 'incomplete')
  );


  useEffect(() => {
    setCourseFilter(filters.course || '');
    setCompletionFilter(
      filters.completed === undefined ? 'all' : (filters.completed ? 'completed' : 'incomplete')
    );
  }, [filters]);


  useEffect(() => {
  }, [assignments]);


  const handleAssignmentDelete = (id) => {
    console.log(id);
    if (onFilterChange) {
      onFilterChange({ ...filters });
    }
  };


  const handleAssignmentUpdate = (updatedAssignment) => {
    console.log(updatedAssignment);
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        _timestamp: Date.now()
      });
    }
  };


  const handleFilterSubmit = (e) => {
    e.preventDefault();

    if (onFilterChange) {

      const newFilters = {

        page: 1,
        limit: filters.limit || 5
      };


      if (courseFilter && courseFilter.trim()) {
        newFilters.course = courseFilter.trim();
      }


      if (completionFilter === 'completed') {
        newFilters.completed = true;
      } else if (completionFilter === 'incomplete') {
        newFilters.completed = false;
      }


      console.log('Applying filters:', newFilters);


      onFilterChange(newFilters);
    }
  };


  const handleClearFilters = () => {

    setCourseFilter('');
    setCompletionFilter('all');

    if (onFilterChange) {
      console.log('Clearing filters');



      onFilterChange({
        course: '',
        completed: undefined,
        page: 1,
        _timestamp: Date.now()
      });
    }
  };

  return (
    <div className="assignments-container">

      <div className="filter-section">
        <h3>Filter Assignments</h3>
        <form onSubmit={handleFilterSubmit} className="filter-form">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="course-filter">Course:</label>
              <input
                type="text"
                id="course-filter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                placeholder="Filter by course name"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="completion-filter">Status:</label>
              <select
                id="completion-filter"
                value={completionFilter}
                onChange={(e) => setCompletionFilter(e.target.value)}
              >
                <option value="all">All Assignments</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          <div className="filter-buttons">
            <button type="submit" className="apply-filter-button">Apply Filters</button>
            <button type="button" onClick={handleClearFilters} className="clear-filter-button">Clear Filters</button>
          </div>
        </form>
      </div>


      <div className="assignments-summary">
        <p>
          {assignments?.length > 0
            ? `Showing ${assignments.length} assignment${assignments.length > 1 ? 's' : ''}`
            : 'No assignments found with the current filters'}
        </p>
      </div>


      {pagination && assignments?.length > 0 && (
        <div className="pagination-controls">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}


      {assignments?.length > 0 ? (
        <ul className="assignment-list">
          {assignments.map(assignment => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              onAssignmentDelete={handleAssignmentDelete}
              onAssignmentUpdate={handleAssignmentUpdate}
              setError={setError}
            />
          ))}
        </ul>
      ) : (
        <div className="no-assignments">
          <p>No assignments found. Try adjusting your filters or add a new assignment.</p>
        </div>
      )}
    </div>
  );
}

export default AssignmentList;