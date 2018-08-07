import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Link from "./Link";
import { QUERY } from "../client";
import { FEED_QUERY } from "../queries";
import {
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from "../subscription";
import { LINKS_PER_PAGE } from "../constants";

class LinkList extends Component {
  state = {};

  _getQueryVariables = () => {
    const { location, match } = this.props;
    const isNewPage = location.pathname.includes("new");
    const page = parseInt(match.params.page, 10);

    return {
      skip: isNewPage ? (page - 1) * LINKS_PER_PAGE : 0,
      first: isNewPage ? LINKS_PER_PAGE : 100,
      orderBy: isNewPage ? "createAT_DESC" : null
    };
  };

  _updateStore = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  _subscribeToNewLinks = async subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data.newLink) return prev;

        const newLink = [
          subscriptionData.data.newLink.node,
          ...prev.feed.links
        ];

        return {
          ...prev,
          feed: {
            ...prev.feed,
            count: prev.feed.count + 1,
            links: newLink
          }
        };
      }
    });
  };

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    });
  };

  render() {
    return (
      <QUERY query={FEED_QUERY}>
        {({ feed }, subscribeToMore) => {
          const { count, links } = feed;

          this._subscribeToNewLinks(subscribeToMore);
          this._subscribeToNewVotes(subscribeToMore);

          return (
            <Fragment>
              Total Count: {count} <br />
              {links.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index}
                  updateStore={this._updateStore}
                />
              ))}
            </Fragment>
          );
        }}
      </QUERY>
    );
  }
}

export default withRouter(LinkList);
