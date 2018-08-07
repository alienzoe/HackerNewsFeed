import React, { Component } from "react";
import Loadable from "react-loadable";

const RouteImport = load =>
  class Router extends Component {
    state = {
      WrappedComponent: null
    };

    componentDidMount() {
      this.setState({
        WrappedComponent: Loadable({
          loader: load,
          loading({ isLoading, error }) {
            // Handle the loading state
            if (isLoading) {
              return <div>Loading...</div>;
            } else if (error) {
              return <div>Sorry, there was a problem loading the page.</div>;
            } else {
              return null;
            }
          }
        })
      });
    }

    render() {
      const { WrappedComponent } = this.state;
      return WrappedComponent ? <WrappedComponent /> : null;
    }
  };

export default RouteImport;
