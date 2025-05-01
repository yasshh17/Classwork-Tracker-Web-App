import { randomUUID } from 'crypto';

const sessions = {};

function addSession(username) {
  const sid = randomUUID();
  sessions[sid] = username;
  return sid;
}

function getSessionUser(sid) {
  return sessions[sid] || null;
}

function isValidSession(sid) {
  return !!sessions[sid];
}

function deleteSession(sid) {
  delete sessions[sid];
}

export default {
  addSession,
  getSessionUser,
  isValidSession,
  deleteSession
};