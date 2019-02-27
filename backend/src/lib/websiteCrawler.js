var Crawler = require("crawler")
const path = require("path")
var fs = require("fs")

let already_crawled = []
let pageId = 1
const crawled_data = []
const crawlableDomains = []
const excludePathExtensions = [".jpg", ".png", ".jpeg", ".pdf"]

const stitchTogetherDirectory = urlBits => {
  urlBits.splice(0, 3)
  var newPathname = ""
  for (i = 0; i < urlBits.length; i++) {
    newPathname += "/"
    newPathname += urlBits[i]
  }
  return newPathname
}

const storeScrapedContent = jsonArr => {
  fs.writeFile("cronjob-files/pages.json", JSON.stringify(jsonArr), function(
    err
  ) {
    if (err) throw err
    // console.log("file write complete")
  })
}

const crawlPage = (error, res, done) => {
  if (error) {
    console.log(error)
  }
  const {
    options: { uri, jQuery },
  } = res
  pageId++
  // console.log("LINK BEING PROCESSED => ", uri)
  // warn: CRAWLER response body is not HTML
  // ToDo: need to figure out from the res if it is not valid html then done() early to exit
  try {
    const $ = res.$
    const ulrBits = uri.split("/")
    const pageTitle = $("title").text()
    const metas = $("meta")
    const siteLinks = $("a")
    // new crawler to queue links found on scrapped page
    const c = new Crawler({
      rateLimit: 5000, // increase for error: ESOCKETTIMEDOUT
      // This will be called for each crawled page
      callback: crawlPage,
    })

    c.on("drain", function() {
      // console.log("PAGE DRAINED => ", uri)
      // store scraped page content in file
      storeScrapedContent(crawled_data)
      // console.log("P. QUEUE SIZE = > ", c.queueSize)
    })

    let description = ""
    let keywords = ""

    $(metas).each(function(i, meta) {
      let metaName = $(meta).attr("name")
      if (metaName) {
        metaName = metaName.toLowerCase()
      }
      if (metaName === "description") {
        // console.log("FOUND THE META NAME desription => ", metaName)
        description = $(meta).attr("content")
      }
      if (metaName === "keywords") {
        // console.log("FOUND THE META NAME desription => ", metaName)
        keywords = $(meta).attr("content")
      }
    })
    // get page content from tags
    const mainContent = getContentFromTags($, ["h1", "h2", "h3", "h4"])
    const secondaryContent = getContentFromTags($, ["p"])

    // add scrapped data to our crawled_data array
    crawled_data.push({
      id: pageId,
      title: pageTitle,
      url: uri,
      description: description,
      keywords: keywords,
      mainContent: mainContent,
      secondaryContent: secondaryContent,
    })

    // url info
    const protocol = ulrBits[0]
    const host = ulrBits[2]
    const directory = stitchTogetherDirectory(ulrBits)
    // loop over "a" tags and construct links to crawl
    // ToDo: gather links and put in array. then when drained add another to the queue
    $(siteLinks).each(function(i, link) {
      var linkName = $(link).text()
      var l = $(link).attr("href")
      var pathLink = ""
      if (l) {
        pathLink = buildLinkPath(l, uri, protocol, host, directory)
      }
      pathLink.trim()
      linkName.trim()
      if (
        pathLink !== "" &&
        !already_crawled.includes(pathLink) &&
        pathLink !== undefined
      ) {
        already_crawled.push(pathLink)
        const linkBits = pathLink.split("/")
        const linkHost = linkBits[2]
        if (crawlableDomains.includes(linkHost) && isLinkCrawlable(pathLink)) {
          try {
            c.queue({ uri: pathLink, jQuery: true })
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  } catch (e) {
    // console.log(e)
  } finally {
    done()
  }
}

const getContentFromTags = ($, tagTypes) => {
  let content = ""
  for (type of tagTypes) {
    const tags = $(`${type}`)
    $(tags).each((i, tag) => {
      var tagContent = $(tag).text()
      tagContent.replace(/[^a-zA-Z ]/g, "")
      tagContent.trim()
      content = content + ` ${tagContent}`
    })
  }
  return content
}

const isLinkCrawlable = linkName => {
  const extension = path.parse(linkName).ext
  if (excludePathExtensions.includes(extension)) {
    return false
  }
  return true
}

const buildLinkPath = (l, uri, protocol, host, directory) => {
  let fullPath = l
  if (l.substring(0, 1) === "/" && l.substring(0, 2) !== "//") {
    // was causing infinite loop
    // fullPath = uri + l
    fullPath = `${protocol}//${host}/${l}`
  }
  // urls with a "//" e.g "//test.com"
  else if (l.substring(0, 2) === "//") {
    fullPath = `http:${l}`
  }
  // ToDo: description
  else if (l.substring(0, 2) === "./") {
    fullPath = `${protocol}//${host}${directory}${l.substring(1)}`
  } // anchor tag link ToDo: description
  else if (l.substring(0, 1) === "#") {
    fullPath = `${protocol}//${host}${l}`
  } // starts with "../"
  else if (l.substring(0, 3) === "../") {
    fullPath = `${protocol}//${host}/${l}`
  } // ToDo:
  else if (l.substring(0, 11) === "javascript:") {
    // do nthing
    fullPath = ""
  } // No protocol
  else if (l.substring(0, 5) !== "https" && l.substring(0, 4) !== "http") {
    // fullPath = `${protocol}//${l}`
    fullPath = ""
  } // ignore link refs back onto itself
  else if (l.substring(0, 6) === "mailto" || l.substring(0, 3) === "tel") {
    fullPath = ""
  }

  if (fullPath.includes("#")) {
    fullPath = ""
  }

  return fullPath
}

const tronCrawler = (urls, domains) => {
  already_crawled = []

  for (domain of domains) {
    crawlableDomains.push(domain)
  }

  var c = new Crawler({
    // maxConnections: 100,
    // rateLimit: 10000, // `maxConnections` will be forced to 1
    rateLimit: 5000, // `maxConnections` will be forced to 1
    // This will be called for each crawled page
    callback: crawlPage,
  })

  c.on("schedule", function(options) {
    already_crawled.push(options.uri)
  })

  c.on("drain", function() {
    storeScrapedContent(crawled_data)
    // console.log("SITE QUEUE SIZE = > ", c.queueSize)
  })

  for (url of urls) {
    c.queue(url)
  }
  // console.log("SITE QUEUE SIZE = > ", c.queueSize)
}

// https://medium.freecodecamp.org/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3
// https://github.com/bda-research/node-crawler
module.exports = { tronCrawler }
