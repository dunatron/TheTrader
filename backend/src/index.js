require("dotenv").config({ path: "./variables.env" })
const createServer = require("./createServer")
const db = require("./db")
// FIle stuff

const server = createServer()

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  details => {
    console.log(`Server is now running on port http:/localhost:${details.port}`)
  }
)

// const server = createServer()
// server.listen(
//   {
//     cors: {
//       credentials: true,
//       origin: process.env.FRONTEND_URL,
//     },
//   },
//   details => {
//     console.log(`Server is now running on port http:/localhost:${details.port}`)
//   }
// )
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`)
// })
