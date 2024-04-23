// RouterConfig.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginForm from './LoginForm';
import ProfilePage from './ProfilePage';
import JobListings from './JobListings';

const RouterConfig = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginForm} />
                <ProtectedRoute path="/profile" component={ProfilePage} />
                <ProtectedRoute path="/joblistings" component={JobListings} />
                {/* Add other routes as needed */}
            </Switch>
        </Router>
    );
};

export default RouterConfig;
