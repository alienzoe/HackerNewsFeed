import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "prisma-binding";
import resolvers from "./resolvers";

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true
});

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db
  })
});

const serverOptions = {
  port: process.env.DEV_PORT,
  playground: process.env.PLAYGROUND_ENDPOINT
};

server.start(serverOptions, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
