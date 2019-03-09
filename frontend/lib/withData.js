import withApollo from "next-with-apollo"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
// import { ApolloLink } from "apollo-client-preset"
import { ApolloLink } from "apollo-link"
import { createUploadLink } from "apollo-upload-client"
import { endpoint, prodEndpoint } from "../config"
import { LOCAL_STATE_QUERY } from "../components/Cart"
const tron = "sad because cookies arent being attached for mobile =("

const cache = new InMemoryCache()

cache.writeData({
  data: {
    cartOpen: false,
  },
})

function createClient({ headers }) {
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      fetchOptions: {
        credentials: "include",
      },
      headers: headers,
    })
    return forward(operation)
  })

  const client = new ApolloClient({
    // ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    link: authLink.concat(
      createUploadLink({
        uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
      })
    ),
    // local dat
    cache: cache,
    resolvers: {
      Mutation: {
        toggleCart(_, variables, { cache }) {
          console.log("toggleCart => mutation")
          // read the cartOpen value from the cache
          const { cartOpen } = cache.readQuery({
            query: LOCAL_STATE_QUERY,
          })
          // Write the cart State to the opposite
          const data = {
            data: { cartOpen: !cartOpen },
          }
          cache.writeData(data)
          return data
        },
      },
    },
  })
  return client
}

export default withApollo(createClient)

// import withApollo from "next-with-apollo"
// import ApolloClient from "apollo-boost"
// import { endpoint, prodEndpoint } from "../config"
// import { LOCAL_STATE_QUERY } from "../components/Cart"

// function createClient({ headers }) {
//   return new ApolloClient({
//     uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
//     request: operation => {
//       operation.setContext({
//         fetchOptions: {
//           credentials: "include",
//         },
//         headers,
//       })
//     },
//     // local data
// clientState: {
//   resolvers: {
//     Mutation: {
//       toggleCart(_, variables, { cache }) {
//         // read the cartOpen value from the cache
//         const { cartOpen } = cache.readQuery({
//           query: LOCAL_STATE_QUERY,
//         })
//         // Write the cart State to the opposite
//         const data = {
//           data: { cartOpen: !cartOpen },
//         }
//         cache.writeData(data)
//         return data
//       },
//     },
//   },
//       defaults: {
//         cartOpen: false,
//       },
//     },
//   })
// }

// export default withApollo(createClient)
