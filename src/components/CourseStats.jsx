import { useState, useEffect } from 'react';
import { fetchCourseStats } from '../services';
import './CourseStats.css';

function CourseStats({ onBack, setError }) {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCourseStats()
      .then(courseStats => {

        const processedStats = courseStats.map(course => {

          const completionRate = course.totalAssignments > 0
            ? (course.completedAssignments / course.totalAssignments) * 100
            : 0;

          return {
            ...course,
            completionRate
          };
        });

        setStats(processedStats);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.error || 'Failed to load course statistics');
        setIsLoading(false);
      });
  }, [setError]);

  return (
    <div className="course-stats">
      <div className="course-stats-header">
        <h2>Course Statistics</h2>
        <button onClick={onBack} className="back-button">
          Back to Assignments
        </button>
      </div>

      {isLoading ? (
        <p>Loading course statistics...</p>
      ) : stats.length === 0 ? (
        <p>No course data available.</p>
      ) : (
        <>
          <div className="stats-summary">
            <p>You have assignments in {stats.length} course(s)</p>
          </div>

          <div className="course-grid">
            {stats.map(course => (
              <div key={course.course} className="course-card">
                <h3>{course.course}</h3>
                <div className="course-data">
                  <div className="stat-row">
                    <span>Total Assignments:</span>
                    <span>{course.totalAssignments}</span>
                  </div>
                  <div className="stat-row">
                    <span>Completed:</span>
                    <span>{course.completedAssignments}</span>
                  </div>
                  <div className="stat-row">
                    <span>Completion Rate:</span>
                    <span>
                      {course.completedAssignments > 0
                        ? Math.round(course.completionRate)
                        : 0}%
                    </span>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${course.completionRate > 0 ? Math.max(5, course.completionRate) : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CourseStats;