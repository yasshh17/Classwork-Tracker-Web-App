export const LOGIN_STATUS = {
    PENDING: 'pending',
    NOT_LOGGED_IN: 'notLoggedIn',
    IS_LOGGED_IN: 'loggedIn',
  };
  
  export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    DOG_NOT_ALLOWED: 'dog-not-allowed',
    REQUIRED_DUE_DATE: 'required-due-date',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    REQUIRED_TITLE: 'required-title',
    REQUIRED_COURSE: 'required-course',
    ASSIGNMENT_MISSING: 'noSuchId',
  };
  
  export const CLIENT = {
    NETWORK_ERROR: 'networkError',
    NO_SESSION: 'noSession',
  };
  
  export const MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network. Please try again',
    [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
    [SERVER.DOG_NOT_ALLOWED]: 'Dog is not allowed as username',
    [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username',
    [SERVER.REQUIRED_TITLE]: 'Please enter the assignment title',
    [SERVER.REQUIRED_COURSE]: 'Please enter the course name',
    [SERVER.REQUIRED_DUE_DATE]: 'Please enter a due date',
    default: 'Something went wrong. Please try again',
  };