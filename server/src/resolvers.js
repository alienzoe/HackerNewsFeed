import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "./util";

const Query = {
  feed: async (_, args, { db: { query }, request }, info) => {
    const { filter, ...rest } = args;
    let where = filter
      ? {
          OR: [{ url_contains: filter }, { description_contains: filter }]
        }
      : {};

    const testId = getUserId(request);
    if (testId) {
      where = { ...where, postedBy: { id: testId } };
    }

    const queriedLinks = await query.links({ ...rest, where }, `{ id }`);
    const linksConnection = await query.linksConnection(
      { where },
      `{
            aggregate {
                count
            }
        }`
    );

    return {
      count: linksConnection.aggregate.count,
      linkIds: queriedLinks.map(link => link.id)
    };
  },
  users: (_, args, { db: { query } }, info) => query.users({}, info)
};

const Mutation = {
  post: async (_, args, { db: { mutation }, request }, info) => {
    const { url, description } = args;
    const userId = getUserId(request);

    return mutation.createLink(
      {
        data: {
          url,
          description,
          postedBy: {
            connect: { id: userId }
          }
        }
      },
      info
    );
  },
  signup: async (_, args, { db: { mutation } }, info) => {
    const { password: Password } = args;

    const password = await bcrypt.hash(Password, 10);
    const user = await mutation.createUser(
      {
        data: { ...args, password }
      },
      `{ id }`
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
  login: async (_, args, { db: { query } }, info) => {
    const { password, email } = args;

    const user = await query.user(
      {
        where: { email }
      },
      `{ id password }`
    );

    if (!user) {
      throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
  vote: async (_, args, { db: { mutation, exists }, request }, info) => {
    const { linkId } = args;
    const userId = getUserId(request);

    const linkExist = await exists.Vote({
      user: { id: userId },
      link: { id: linkId }
    });
    if (linkExist) {
      throw new Error(`Already voted for link: ${linkId}`);
    }

    return mutation.createVote(
      {
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: linkId } }
        }
      },
      info
    );
  }
};

const Subscription = {
  newLink: {
    subscribe: (_, args, { db: { subscription } }, info) =>
      subscription.link(
        {
          where: { mutation_in: ["CREATED"] }
        },
        info
      )
  },
  newVote: {
    subscribe: (_, args, { db: { subscription } }, info) =>
      subscription.vote(
        {
          where: { mutation_in: ["CREATED"] }
        },
        info
      )
  }
};

const AuthPayload = {
  user: (root, args, { db: { query } }, info) =>
    query.user(
      {
        where: { id: root.user.id }
      },
      info
    )
};

const Feed = {
  links: (_, args, { db: { query } }, info) =>
    query.links(
      {
        where: { id_in: _.linkIds }
      },
      info
    )
};

export default {
  Query,
  Mutation,
  Subscription,
  AuthPayload,
  Feed
};
