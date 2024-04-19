import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import ProfilePage from './ProfilePage';
import LoginForm from './Login'; // Import the LoginForm component
import Homepage from './Homepage'; // Import the Homepage component
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoutes'; // Import the ProtectedRoute component

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* Use Switch to handle routing */}
      <Switch>
        {/* Route for registration form */}
        <Route path="/register" component={RegistrationForm} />

        {/* Route for login form */}
        <Route path="/login" component={LoginForm} />

        {/* Protected route for profile page */}
        <ProtectedRoute path="/profile" component={ProfilePage} />

        {/* Protected route for homepage */}
        <ProtectedRoute path="/home" component={Homepage} />

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
