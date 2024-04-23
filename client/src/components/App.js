import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
<<<<<<< HEAD
import LoginForm from './Login';
import HomePage from './HomePage.js'; // Import the HomePage component
import Footer from './footer.js'; 
import AdminPanel from './AdminPanel.js'; 
import Dashboard from './Dashboard.js'; 


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
                
                {/* Route for login form */}
                <Route path="/login" component={LoginForm} />
                
                {/* Default route for the home page */}
                <Route path="/home-page" exact component={HomePage} /> 
                
                {/* Render HomePage on the root path */}
                <Route path="/Admin" component={AdminPanel} />

                <Route path="/Dashboard" component={Dashboard} />
                
            </Switch>

            {/* Render AdminPanel outside of the Switch */}
            <Footer />
        </div>
    );
=======
import AdminPanel from './AdminPanel';
import UserDashboard from './UserDashboard';
import LoginForm from './Login';

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

        {/* Route for profile page */}
        <Route path="/LoginForm" component={LoginForm} />
        
        {/* Define a default route for the home page */}
        <Route path="/" exact>
          <h2>Welcome to the Home Page</h2>
          {/* Add other components or content for the home page here */}
        </Route>
      </Switch>

      {/* Render AdminPanel outside of the Switch */}
      { <AdminPanel /> }
      { <UserDashboard userId={userId} /> }

    </div>
  );
>>>>>>> main
}

export default App;
