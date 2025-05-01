export function makeAssignmentList() {
  const assignments = {};
  let nextId = 1;

  function getAssignments(filters = {}) {
    let result = Object.values(assignments);
    
    if (filters.course) {
      result = result.filter(a => a.course.toLowerCase().includes(filters.course.toLowerCase()));
    }
    
    if (filters.dueDate) {
      const filterDate = new Date(filters.dueDate);
      if (filters.dueDateDirection === 'before') {
        result = result.filter(a => new Date(a.dueDate) <= filterDate);
      } else if (filters.dueDateDirection === 'after') {
        result = result.filter(a => new Date(a.dueDate) >= filterDate);
      }
    }
    
    if (filters.completed !== undefined) {
      result = result.filter(a => a.completed === filters.completed);
    }
  
    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      result = result.slice(startIndex, startIndex + filters.limit);
    }
    
    return result;
  }

  function getTotalCount(filters = {}) {
    let result = Object.values(assignments);
    
    if (filters.course) {
      result = result.filter(a => a.course.toLowerCase().includes(filters.course.toLowerCase()));
    }
    
    if (filters.dueDate) {
      const filterDate = new Date(filters.dueDate);
      if (filters.dueDateDirection === 'before') {
        result = result.filter(a => new Date(a.dueDate) <= filterDate);
      } else if (filters.dueDateDirection === 'after') {
        result = result.filter(a => new Date(a.dueDate) >= filterDate);
      }
    }
    
    if (filters.completed !== undefined) {
      result = result.filter(a => a.completed === filters.completed);
    }
    
    return result.length;
  }

  function addAssignment(title, course, dueDate) {
    const id = String(nextId++);
    assignments[id] = {
      id,
      title,
      course,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    return id;
  }

  function getAssignment(id) {
    return assignments[id];
  }

  function contains(id) {
    return !!assignments[id];
  }

  function updateAssignment(id, updates) {
    const assignment = assignments[id];
    assignments[id] = { ...assignment, ...updates, updatedAt: new Date().toISOString() };
  }

  function deleteAssignment(id) {
    delete assignments[id];
  }

  return {
    getAssignments,
    addAssignment,
    getAssignment,
    contains,
    updateAssignment,
    deleteAssignment,
    getTotalCount
  };
}