// our database
const db = require("./db")
// library
const { createDirectory } = require("./lib/createDirectory")
const { TronsCrawler } = require("./lib/websiteCrawler")

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
const generateSearchFromWebsiteCall = async () => {
  rule.dayOfWeek = [0, new scheduler.Range(0, 6)]
  rule.hour = null
  rule.minute = null
  scheduler.scheduleJob(rule, function() {
    console.log("Today is recognized by Tron!")
    // TronsCrawler()
  })
}

// function to easily run all cron jobs
const runAllJobs = () => {
  generateSearchFromWebsiteCall()
}

module.exports = { runAllJobs }
