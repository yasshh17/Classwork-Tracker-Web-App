const userRegistry = {}; 

export function registerUser(username) {
  userRegistry[username] = true;
}

export function isValidUser(username) {
  return !!userRegistry[username]; 
}
