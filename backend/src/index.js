require("dotenv").config({ path: "./variables.env" })
const createServer = require("./createServer")
const db = require("./db")
const { runAllJobs } = require("./cronjobs")
// const { tronCrawler } = require("./lib/websiteCrawler")

runAllJobs()
// const sitesToCrawl = ["https://www.op.ac.nz"]
// const crawlableDomains = ["www.op.ac.nz", "central.op.ac.nz"]
// tronCrawler(sitesToCrawl, crawlableDomains)

const server = createServer()

const expressLogger = function(req, res, next) {
  console.log("express endpoint called")
  next()
}

server.use(expressLogger)

server.get("/tron-search", function(req, res) {
  var foo = require("../cronjob-files/pages.json")
  // res.send("Hello World!")
  res.send(foo)
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
