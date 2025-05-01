export function fetchAssignments(filters = {}) {
  const params = new URLSearchParams();
  if (filters.course) params.append('course', filters.course);
  if (filters.dueDate) {
    params.append('dueDate', filters.dueDate);
    params.append('dueDateDirection', filters.dueDateDirection || 'before');
  }
  if (filters.completed !== undefined) params.append('completed', filters.completed);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  return fetch(`/api/assignments${queryString}`)
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchAddAssignment(assignment) {
  return fetch('/api/assignments', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify(assignment),
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchAssignment(id) {
  return fetch(`/api/assignments/${id}`)
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchUpdateAssignment(id, updates) {
  return fetch(`/api/assignments/${id}`, {
    method: 'PATCH',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify(updates),
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchReplaceAssignment(id, assignment) {
  return fetch(`/api/assignments/${id}`, {
    method: 'PUT',
    headers: new Headers({
      'content-type': 'application/json',
    }),
    body: JSON.stringify(assignment),
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchDeleteAssignment(id) {
  return fetch(`/api/assignments/${id}`, {
    method: 'DELETE',
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchCourseStats() {
  return fetch('/api/courses')
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchSession() {
  return fetch('/api/session')
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchLogin(username) {
  return fetch('/api/session', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ username }),
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function fetchLogout() {
  return fetch('/api/session', {
    method: 'DELETE',
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
    .catch(error => Promise.reject({ error }))
    .then(err => Promise.reject(err));
  });
}

export function registerUser(username, password) {
  if (username === 'dog') {
    return { error: 'Username is not allowed' };
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true };
}
