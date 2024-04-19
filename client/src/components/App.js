import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
import AdminPanel from './AdminPanel';
import UserDashboard from './UserDashboard';
import UpdateInterview from './UpdateInterview';
import '/home/victor/project/quest/client/src/index.css';

function App() {
  const userId = 1; 

  return (
    <Router>
      <div className="App">
        <Navbar />

        {/* Use Switch to handle routing */}
        <Switch>
          {/* Route for registration form */}
          <Route path="/register" component={RegistrationForm} />
          
          {/* Route for profile page */}
          <Route path="/profile" component={ProfilePage} />
          
          {/* Route for updating interviews */}
          <Route path="/interviews/:id" component={UpdateInterview} />

          {/* Route for AdminPanel */}
          <Route path="/admin" component={AdminPanel} />

          {/* Define a default route for the home page */}
          <Route path="/" exact>
            <h2>Welcome to the Home Page</h2>
            {/* Add other components or content for the home page here */}
          </Route>
        </Switch>

        {/* Render UserDashboard outside of the Switch */}
        <UserDashboard userId={userId} />
      </div>
    </Router>
  );
}

export default App;
