function Controls({ username, onLogout }) {
  return (
    <div className="controls">
      <span className="welcome-message">Welcome, {username}!</span>
      <button
        onClick={onLogout}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}

export default Controls;