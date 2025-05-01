const users = {};

function isValid(username) {
  let isValidUsername = false;
  if (username && username.trim()) {
    isValidUsername = username.trim().match(/^[A-Za-z0-9_]+$/);
  }
  return isValidUsername;
}

function getUserData(username) {
  return users[username];
}

function addUserData(username, userData) {
  users[username] = userData;
}

export default {
  isValid,
  getUserData,
  addUserData,
};