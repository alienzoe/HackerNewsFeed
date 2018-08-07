import React from "react";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { Mutation } from "../client";
import { VOTE_MUTATION } from "../mutations";

const Link = ({ link, index, updateStore }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) => {
              updateStore(store, vote, link.id);
            }}
          >
            {voteMutation => (
              <div className="ml1 gray fl1" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>

      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
