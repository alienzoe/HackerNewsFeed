import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { AUTH_TOKEN } from "../constants";
import { ql, Mutation } from "../client";

const SIGNUP_MUTATION = ql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id  
      }
    }
  }
`;

const LOGIN_MUTATION = ql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password,) {
      token
      user {
        id  
      }
    }
  }
`;

class Login extends Component {
  state = {
    login: true,
    email: "",
    password: "",
    name: ""
  };

  _confirm = async ({ login, signup }) => {
    const {
      token,
      user: { id: userId }
    } = login ? login : signup;

    this._saveUserData(token, userId);
    this.props.history.push("/");
  };

  _saveUserData = (token, userId) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  render() {
    const { login, email, password, name } = this.state;

    return (
      <Fragment>
        <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? "login" : "create account"}
              </div>
            )}
          </Mutation>

          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? "need to create an account?" : "already have an account?"}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Login);
