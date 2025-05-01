import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeAssignmentList } from './assignments.js';
import sessions from './sessions.js';
import users from './users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());


app.get('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json({ username });
});

app.post('/api/session', (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if (username.toLowerCase() === 'dog') {
    res.status(403).json({ error: 'dog-not-allowed' });
    return;
  }

  const sid = sessions.addSession(username);
  const existingUserData = users.getUserData(username);

  if (!existingUserData) {
    users.addUserData(username, makeAssignmentList());
  }

  res.cookie('sid', sid);
  res.json(users.getUserData(username).getAssignments());
});

app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (sid) {
    res.clearCookie('sid');
  }

  if (username) {
    sessions.deleteSession(sid);
  }

  res.json({ username });
});


app.get('/api/assignments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { course, dueDate, dueDateDirection, completed, page, limit } = req.query;

  const filters = {};
  if (course) filters.course = course;
  if (dueDate) {
    filters.dueDate = dueDate;
    filters.dueDateDirection = dueDateDirection || 'before';
  }
  if (completed !== undefined) {
    filters.completed = completed === 'true';
  }

  const assignmentList = users.getUserData(username);

  if (page && limit) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const totalCount = assignmentList.getTotalCount(filters);
    const totalPages = Math.ceil(totalCount / limitNum);

    filters.page = pageNum;
    filters.limit = limitNum;

    const assignments = assignmentList.getAssignments(filters);

    return res.json({
      assignments,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  }

  res.json(assignmentList.getAssignments(filters));
});

app.post('/api/assignments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { title, course, dueDate } = req.body;
  if (!title) {
    res.status(400).json({ error: 'required-title' });
    return;
  }
  if (!course) {
    res.status(400).json({ error: 'required-course' });
    return;
  }
  if (!dueDate) {
    res.status(400).json({ error: 'required-due-date' });
    return;
  }
  const assignmentList = users.getUserData(username);
  const id = assignmentList.addAssignment(title, course, dueDate);
  res.json(assignmentList.getAssignment(id));
});

app.get('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const assignmentList = users.getUserData(username);
  const { id } = req.params;
  if (!assignmentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No assignment with id ${id}` });
    return;
  }
  res.json(assignmentList.getAssignment(id));
});

app.put('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const assignmentList = users.getUserData(username);
  const { id } = req.params;
  const { title, course, dueDate, completed = false } = req.body;

  if (!title) {
    res.status(400).json({ error: 'required-title' });
    return;
  }
  if (!course) {
    res.status(400).json({ error: 'required-course' });
    return;
  }
  if (!dueDate) {
    res.status(400).json({ error: 'required-due-date' });
    return;
  }

  if (!assignmentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No assignment with id ${id}` });
    return;
  }

  assignmentList.updateAssignment(id, { title, course, dueDate, completed });
  res.json(assignmentList.getAssignment(id));
});

app.patch('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { id } = req.params;
  const { title, course, dueDate, completed } = req.body;
  const assignmentList = users.getUserData(username);

  if (!assignmentList.contains(id)) {
    res.status(404).json({ error: `noSuchId`, message: `No assignment with id ${id}` });
    return;
  }

  assignmentList.updateAssignment(id, { title, course, dueDate, completed });
  res.json(assignmentList.getAssignment(id));
});

app.delete('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { id } = req.params;
  const assignmentList = users.getUserData(username);
  const exists = assignmentList.contains(id);

  if (exists) {
    assignmentList.deleteAssignment(id);
  }

  res.json({ message: exists ? `assignment ${id} deleted` : `assignment ${id} did not exist` });
});

app.get('/api/courses', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const assignmentList = users.getUserData(username);
  const assignments = assignmentList.getAssignments();

  const uniqueCourses = [...new Set(assignments.map(a => a.course))];

  const courseStats = uniqueCourses.map(course => {
    const courseAssignments = assignments.filter(a => a.course === course);
    const completedCount = courseAssignments.filter(a => a.completed).length;
    const upcomingCount = courseAssignments.filter(a =>
      !a.completed && new Date(a.dueDate) > new Date()
    ).length;
    const overdueCount = courseAssignments.filter(a =>
      !a.completed && new Date(a.dueDate) < new Date()
    ).length;

    return {
      course,
      totalAssignments: courseAssignments.length,
      completedAssignments: completedCount,
      upcomingAssignments: upcomingCount,
      overdueAssignments: overdueCount,
      completionRate: courseAssignments.length ? completedCount / courseAssignments.length : 0
    };
  });

  res.json(courseStats);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || username === 'dog') {
    return res.status(400).json({ error: 'invalid-username' });
  }
  if (users[username]) {
    return res.status(409).json({ error: 'user-exists' });
  }
  users[username] = { username };
  res.status(201).json({ message: 'user-created' });
});
