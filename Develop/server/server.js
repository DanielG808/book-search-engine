const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Uncomment the following code once you have built the queries and mutations in the client folder
  app.use("/graphql", expressMiddleware(server));

  // Comment out this code once you have built out queries and mutations in the client folder
  app.use(routes);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Uncomment this code once you have built out queries and mutations in the client folder
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  } // closes if (process.env.NODE_ENV === 'production') condition

  // Uncomment this code once you have built out queries and mutations in the client folder
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
