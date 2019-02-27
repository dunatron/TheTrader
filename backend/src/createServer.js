const { GraphQLServer } = require("graphql-yoga")
const Mutation = require("./resolvers/Mutation")
const Query = require("./resolvers/Query")
const db = require("./db")

// collect our graphql resolvers
const resolvers = {
  Query,
  Mutation,
}

// create the graphql yoga server
function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, db }),
  })
}

module.exports = createServer
// const { ApolloServer, gql } = require("apollo-server")
// const { GraphQLServer } = require("graphql-yoga")
// const Mutation = require("./resolvers/Mutation")
// const Query = require("./resolvers/Query")
// const db = require("./db")
// //Some projects use schemas imported from external files
// const fs = require("fs")
// const typeDefs = gql`
//   ${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
// `

// // collect our graphql resolvers
// const resolvers = {
//   Query,
//   Mutation,
// }

// // Type definitions define the "shape" of your data and specify
// // which ways the data can be fetched from the GraphQL server.

// // This is a (sample) collection of books we'll be able to query
// // the GraphQL server for.  A more complete example might fetch
// // from an existing data source like a REST API or database.
// function createServer() {
//   server = new ApolloServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers,
//     resolverValidationOptions: {
//       requireResolversForResolveType: false,
//     },
//     context: req => ({ ...req, db }),
//   })
//   return server
// }

// module.exports = createServer
