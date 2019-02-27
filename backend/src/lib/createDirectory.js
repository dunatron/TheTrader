const path = require("path")
const fs = require("fs")

const createDirectory = pathname => {
  // fs.mkdir(pathname, { recursive: true }, err => {
  //   if (err) throw err
  // })
  // below is experimental fs.promises
  fs.promises.mkdir(pathname, { recursive: true }).catch(console.error)
}

module.exports = { createDirectory }
