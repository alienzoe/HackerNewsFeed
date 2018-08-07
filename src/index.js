import React, { Component } from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";

import "./styles/App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ClientProvider, client } from "./client";
import { Header, LinkList, CreateLink, Login, Search } from "./routes";

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/top" component={LinkList} />
            <Route exact path="/new/:page" component={LinkList} />
          </Switch>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <ClientProvider client={client}>
      <App />
    </ClientProvider>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
