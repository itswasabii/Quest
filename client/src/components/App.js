import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
import AdminPanel from './AdminPanel';
import '/home/victor/project/quest/client/src/index.css';
import UserDashboard from './UserDashboard';

function App() {
  const userId = 1; 

  return (
    <div className="App">
      <Navbar />

      {/* Use Switch to handle routing */}
      <Switch>
        {/* Route for registration form */}
        <Route path="/register" component={RegistrationForm} />
        
        {/* Route for profile page */}
        <Route path="/profile" component={ProfilePage} />
        
        {/* Define a default route for the home page */}
        <Route path="/" exact>
          <h2>Welcome to the Home Page</h2>
          {/* Add other components or content for the home page here */}
        </Route>
      </Switch>

      {/* Render AdminPanel outside of the Switch */}
      {/* <AdminPanel /> */}
      { <UserDashboard userId={userId} /> }

    </div>
  );
}

export default App;
