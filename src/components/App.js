import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import InterviewManager from "./InterviewManager";
import UpdateInterview from "./UpdateInterview";
import UserDashboard from "./UserDashboard";
import InterviewPage from "./InterviewPage";

function App() {
  return (
    <Router>
      <div>
        <h1>Project Client</h1>
        <Switch>
          <Route exact path="/" component={InterviewManager} />
          <Route path="/interviews/:id" component={UpdateInterview} />
          <Route path="/dashboard/:id" component={UserDashboard} />
          <Route path="/interview" component={InterviewPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;