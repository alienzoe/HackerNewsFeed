import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { withApollo } from "react-apollo";
import { AUTH_TOKEN } from "../constants";

const Header = ({ history, client }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <Fragment>
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker News</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          <div className="ml1">|</div>
          <Link to="/search" className="ml1 no-underline black">
            search
          </Link>
          <Link to="/top" className="ml1 no-underline black">
            top
          </Link>
          <div className="ml1">|</div>
          {authToken && (
            <div className="flex">
              <div className="ml1">|</div>
              <Link to="/create" className="ml1 no-underline black">
                submit
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-fixed">
          {authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN);
                console.log(client);
                history.push("/");
              }}
            >
              Logout
            </div>
          ) : (
            <Link to="/login" className="ml1 no-underline black">
              Login
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default withApollo(withRouter(Header));
