require("dotenv").config({ path: "./variables.env" })
const createServer = require("./createServer")
const db = require("./db")
const { runAllJobs } = require("./cronjobs")
const { TronsCrawler } = require("./lib/websiteCrawler")

runAllJobs()
TronsCrawler()

const server = createServer()

var myLogger = function(req, res, next) {
  console.log("LOGGED")
  next()
}

server.use(myLogger)

server.get("/hello", function(req, res) {
  res.send("Hello World!")
})

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
