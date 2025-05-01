import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Loading from './components/Loading';
import Header from './components/Header';
import Status from './components/Status';
import AssignmentList from './components/AssignmentList';
import AssignmentForm from './components/AssignmentForm';
import CourseStats from './components/CourseStats';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchAssignments,
  registerUser
} from './services';
import { LOGIN_STATUS, CLIENT, SERVER, MESSAGES } from './constants';
import './App.css';

function App() {
  const [error, setError] = useState('');
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('signup');
  const [paginationData, setPaginationData] = useState(null);
  const [filters, setFilters] = useState({
    course: '',
    completed: undefined,
    page: 1,
    limit: 5
  });

  const handleRegister = (username, password) => {
    const result = registerUser(username, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError('');
    setView('login');
  };

  useEffect(() => {
    checkForSession();
  }, []);

  useEffect(() => {
    if (view === 'assignments' && loginStatus === LOGIN_STATUS.IS_LOGGED_IN && !isLoading) {
      loadAssignments();
    }
  }, [view, loginStatus]);

  useEffect(() => {
    if (loginStatus === LOGIN_STATUS.IS_LOGGED_IN) {
      loadAssignments();
    }
  }, [filters, loginStatus]);

  useEffect(() => {
    console.log('App state updated:', {
      view,
      filtersChanged: true,
      assignmentsCount: assignments.length
    });
  }, [view, filters, assignments.length]);

  function onLogin({ username }) {
    setIsLoading(true);
    return fetchLogin(username)
      .then(response => {
        setError('');
        setUser({ username });
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);

        if (Array.isArray(response)) {
          setAssignments(response);
        } else if (response.assignments) {
          setAssignments(response.assignments);
          if (response.pagination) {
            setPaginationData(response.pagination);
          }
        }
        setView('assignments');
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(MESSAGES[err.error] || MESSAGES.default);
        throw err;
      });
  }

  function onLogout() {
    setError('');
    setIsLoading(true);
    fetchLogout()
      .then(() => {
        setUser(null);
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        setView('assignments');
        setAssignments([]);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(MESSAGES[err.error] || MESSAGES.default);
      });
  }

  function loadAssignments() {
    setIsLoading(true);
    const apiFilters = { ...filters };
    delete apiFilters._timestamp;
    if (apiFilters.completed === undefined) delete apiFilters.completed;
    if (apiFilters.course === '') delete apiFilters.course;

    fetchAssignments(apiFilters)
      .then(data => {
        if (data && typeof data === 'object' && 'assignments' in data) {
          setAssignments(data.assignments || []);
          setPaginationData(data.pagination || null);
        } else if (Array.isArray(data)) {
          setAssignments(data);
          setPaginationData(null);
        } else {
          setAssignments([]);
          setPaginationData(null);
          console.error('Unexpected data format:', data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(MESSAGES[err.error] || MESSAGES.default);
      });
  }

  function checkForSession() {
    setIsLoading(true);
    fetchSession()
      .then(session => {
        setUser(session);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        loadAssignments();
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        } else {
          setError(MESSAGES[err.error] || MESSAGES.default);
        }
        setIsLoading(false);
      });
  }

  function handleFilterChange(newFilters) {
    const updatedFilters = {
      page: 1,
      limit: filters.limit || 5
    };
    if (newFilters.course !== undefined) {
      updatedFilters.course = newFilters.course;
    }
    if (newFilters.completed !== undefined) {
      updatedFilters.completed = newFilters.completed;
    }
    if (newFilters.page) {
      updatedFilters.page = newFilters.page;
    }
    if (newFilters._timestamp) {
      updatedFilters._timestamp = newFilters._timestamp;
    }
    setFilters(updatedFilters);
  }

  function handlePageChange(page) {
    setFilters({ ...filters, page });
  }

  function handleAddAssignment() {
    setView('add');
  }

  function handleViewCourses() {
    setView('courses');
  }

  function handleBackToList() {
    setView('assignments');
  }

  function handleAssignmentAdded() {
    setView('assignments');
  }

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={onLogout}
        onAdd={handleAddAssignment}
        onViewCourses={handleViewCourses}
        onViewAssignments={() => setView('assignments')}
        isSignup={view === 'signup'}
        toggleForm={() => setView(view === 'signup' ? 'login' : 'signup')}
      />

      <main className="app-main">
        {error && <Status error={error} onClose={() => setError('')} />}
        {isLoading && <Loading />}

        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && !isLoading && (
          view === 'signup' ? (
            <SignupForm onRegister={handleRegister} />
          ) : (
            <LoginForm onLogin={onLogin} />
          )
        )}

        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && !isLoading && (
          <>
            {view === 'assignments' && (
              <AssignmentList
                assignments={assignments}
                onFilterChange={handleFilterChange}
                onPageChange={handlePageChange}
                filters={filters}
                pagination={paginationData}
                setError={setError}
              />
            )}
            {view === 'add' && (
              <AssignmentForm
                onBack={handleBackToList}
                onAdded={handleAssignmentAdded}
                setError={setError}
              />
            )}
            {view === 'courses' && (
              <CourseStats
                onBack={handleBackToList}
                setError={setError}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Classwork Tracker</p>
      </footer>
    </div>
  );
}

export default App;
