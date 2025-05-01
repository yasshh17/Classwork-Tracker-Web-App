import './Header.css';

function Header({ user, isSignup, toggleForm, onLogout, onAdd, onViewCourses, onViewAssignments }) {
  return (
    <header className="app-header">
      <h1 className="app-title">Classwork Tracker</h1>

      {user && (
        <nav className="app-nav">
          <button onClick={onViewAssignments} className="nav-button">Assignments</button>
          <button onClick={onAdd} className="nav-button">Add Assignment</button>
          <button onClick={onViewCourses} className="nav-button">Course Stats</button>
        </nav>
      )}

      <div className="user-section">
      {user ? (
  <div className="user-info">
    <span className="username">{user.username}</span>
    <button onClick={onLogout} className="logout-button enhanced">Logout</button>
  </div>
) : (
  <div className="guest-info">
    <button onClick={toggleForm} className="nav-button">
      {isSignup ? 'Sign In' : 'Sign Up'}
    </button>
  </div>
)}

      </div>
    </header>
  );
}

export default Header;