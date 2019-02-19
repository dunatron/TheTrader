// our database
const db = require("./db")
// library
const { createDirectory } = require("./lib/createDirectory")
const { tronCrawler } = require("./lib/websiteCrawler")

// cronjob manager
const scheduler = require("node-schedule")
var rule = new scheduler.RecurrenceRule()
rule.dayOfWeek = [0, new scheduler.Range(0, 6)]
// rule.hour = 20;
rule.hour = null
rule.minute = null

// 1. make directory for files generated by cron jobs
createDirectory("cronjob-files")

// create cronjob functions
const scrapeSites = async () => {
  rule.dayOfWeek = [0, new scheduler.Range(0, 6)]
  rule.hour = 4
  rule.minute = 20
  // rule.hour = 7
  // rule.minute = 10
  scheduler.scheduleJob(rule, function() {
    const sitesToCrawl = ["https://www.op.ac.nz"]
    const crawlableDomains = ["www.op.ac.nz", "central.op.ac.nz"]
    tronCrawler(sitesToCrawl, crawlableDomains)
  })
}

// function to easily run all cron jobs
const runAllJobs = () => {
  scrapeSites()
}

module.exports = { runAllJobs }
