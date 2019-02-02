import withApollo from "next-with-apollo"
// import ApolloClient from "apollo-boost"
// import { createUploadLink } from "apollo-upload-client"
import { ApolloProvider } from "react-apollo"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloLink } from "apollo-client-preset"
import { createUploadLink } from "apollo-upload-client"

import { endpoint } from "../config"

// function createClient({ headers }) {
//   return new ApolloClient({
//     // uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
//     // link: authLink.concat(createUploadLink({ uri: "http://localhost:4000" })),
// request: operation => {
//   operation.setContext({
//     fetchOptions: {
//       credentials: "include",
//     },
//     headers,
//   })
// },
//   })
// }

// export default withApollo(createClient)

// const authLink = new ApolloLink((operation, forward) => {
//   // const token = JSON.parse(localStorage.getItem("AUTH_TOKEN"))
//   // const authorizationHeader = token ? `Bearer ${token}` : null
//   operation.setContext({
//     headers: {
//       authorization: authorizationHeader,
//     },
//   })
//   return forward(operation)
// })

// const client = new ApolloClient({
//   link: authLink.concat(createUploadLink({ uri: "http://localhost:4000" })),
//   cache: new InMemoryCache(),
// })

function createClient({ headers }) {
  const authLink = new ApolloLink((operation, forward) => {
    // const token = JSON.parse(localStorage.getItem("AUTH_TOKEN"))
    // const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
      headers: headers,
    })
    return forward(operation)
  })

  const client = new ApolloClient({
    uri: endpoint,
    link: authLink.concat(createUploadLink({ uri: endpoint })),
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include",
        },
        headers,
      })
    },
    cache: new InMemoryCache(),
  })
  return client
}

export default withApollo(createClient)
