import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// Importing auth components
import CheckIfLoggedIn from "./CheckIfLoggedIn";
import CheckIfPhoneVerified from "./CheckIfPhoneVerified";

// Importing all pages
import Index from "./pages/Index";
import VerifyPhone from "./pages/VerifyPhone";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <CheckIfLoggedIn exact path="/" component={Index} />
          <CheckIfLoggedIn exact path="/register" component={Register} />
          <CheckIfLoggedIn exact path="/login" component={Index} />
          <CheckIfPhoneVerified
            exact
            path="/verify-phone"
            component={VerifyPhone}
          />
          <Route exact path="/404" component={Error404} />
          <Redirect to="/404" />
        </Switch>
      </Router>
    );
  }
}
