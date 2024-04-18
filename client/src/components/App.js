import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import ProfilePage from './ProfilePage'; // Import the ProfilePage component
import Navbar from './Navbar.js';

function App() {
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
    </div>
  );
}

export default App;
