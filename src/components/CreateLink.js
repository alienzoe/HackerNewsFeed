import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { Mutation } from "../client";
import { POST_MUTATION } from "../mutations";
import { FEED_QUERY } from "../queries";

class CreateLink extends Component {
  state = {
    description: "",
    url: ""
  };

  _updateStore = (store, { data }) => {
    // const data = store.readQuery({ query: FEED_QUERY });
    // data.feed.links.unshift(post);

    // store.writeQuery({
    //   query: FEED_QUERY,
    //   data
    // });
    console.log(store);
    console.log(data);
  };

  render() {
    const { description, url } = this.state;
    const { history } = this.props;

    return (
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        update={this._updateStore}
        onComplete={() => history.push("/")}
      >
        {postMutation => (
          <form
            className="flex flex-column mt3"
            onSubmit={async e => {
              e.preventDefault();
              await postMutation();
            }}
          >
            <input
              className="mb2"
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
              type="text"
              placeholder="A description for Link"
            />

            <input
              className="mb2"
              value={url}
              onChange={e => this.setState({ url: e.target.value })}
              type="text"
              placeholder="The URL for the link"
            />

            <button type="submit">Submit</button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default withRouter(CreateLink);
