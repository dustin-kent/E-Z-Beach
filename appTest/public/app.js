import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Logout function or session invalidation
function logout() {
 
  // Use the history object to replace the current URL with the login page URL
  history.replace('/login-page.html'); 
}


