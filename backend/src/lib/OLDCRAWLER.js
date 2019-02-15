var Crawler = require("crawler")
const path = require("path")
var fs = require("fs")

let already_crawled = []
const crawled_data = []
const crawlableDomains = ["www.op.ac.nz"]
const excludePathExtensions = [".jpg", ".png", ".jpeg"]

const stitchTogetherDirectory = urlBits => {
  // console.log("+++++++++++++STictching+++++++++++++++")
  urlBits.splice(0, 3)
  var newPathname = ""
  for (i = 0; i < urlBits.length; i++) {
    newPathname += "/"
    newPathname += urlBits[i]
  }
  return newPathname
}

const crawlPage = (error, res, done) => {
  if (error) {
    console.log("TRON SAYS CHECK THIS ERROR")
    console.log(error)
  }
  const {
    options: { uri },
  } = res
  // console.log("LINK BEING PROCESSED => ", uri)
  console.log("LINK BEING PROCESSED => ", uri)
  try {
    var $ = res.$
    const siteLinks = $("a")
    const ulrBits = uri.split("/")
    // if (uri === "https://www.op.ac.nz//accessibility") {
    //   // console.log(" I needa Know => ", res)
    //   const siteHtml = $.html()
    //   // console.log("siteHtml => ", siteHtml)
    //   // console.log("siteLinks => ", siteLinks)
    //   $(siteLinks).each(function(i, link) {
    //     var l = $(link).attr("href")
    //     console.log(l)
    //   })
    // }

    // $ is Cheerio by default
    // a lean implementation of core jQuery designed specifically for the server

    var c = new Crawler({
      // rateLimit: 2000,
      // rateLimit: 10000, // `maxConnections` will be forced to 1
      rateLimit: 5000, // increate for error: ESOCKETTIMEDOUT
      // rateLimit: 100, // increate for error: ESOCKETTIMEDOUT
      // maxConnections: 10,
      // This will be called for each crawled page
      callback: crawlPage,
    })

    // url info
    const protocol = ulrBits[0]
    const host = ulrBits[2]
    const directory = stitchTogetherDirectory(ulrBits)
    // store content for siteLinks
    $(siteLinks).each(function(i, link) {
      // console.log($(link).text() + ":\n  " + $(link).attr("href"))

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
            c.queue(pathLink)
          } catch (e) {
            console.log(e)
          }
        }
      }

      // CHECK IF LINK HAS ALREADY BEEN CALLED

      // if (already_crawled.includes(pathLink)) {
      //   console.log("Link already crawled => ", pathLink)
      //   // console.log("%c Oh my heavens! ", "background: #222; color: #bada55")
      // } else {
      //   try {
      //     if (pathLink !== "") {
      //       console.log("pathLink => ", pathLink)
      //       // c.queue(pathLink)
      //     }
      //     already_crawled.push(pathLink)
      //   } catch (e) {}
      // }

      // console.log("pathLink = > ", pathLink)
    })

    const pageTitle = $("title").text()
    const metas = $("meta")
    let description = ""
    let keywords = ""

    $(metas).each(function(i, meta) {
      // console.log($(meta).attr("href"))
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

    crawled_data.push({
      title: pageTitle,
      url: pathLink,
      description: description,
      keywords: keywords,
    })
    console.log("crawled_data => ", crawled_data)
    // fs.writeFile("test-input.json", JSON.stringify(crawled_data), function(
    //   err
    // ) {
    //   if (err) throw err
    //   console.log("complete")
    // })

    done()

    // gather page details
  } catch (e) {}
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

const crawlWebsites = () => {
  // var c = new Crawler({
  //   maxConnections: 100,
  //   // This will be called for each crawled page
  //   callback: crawlPage,
  // })
  var c = new Crawler({
    // maxConnections: 100,
    rateLimit: 10000, // `maxConnections` will be forced to 1
    // This will be called for each crawled page
    callback: crawlPage,
  })
  // c.queue("http://localhost:7777/items")
  // c.queue("https://www.op.ac.nz//site-map")
  // c.queue("http://localhost:3000")
  // c.queue("https://www.op.ac.nz")

  // c.queue("https://central.op.ac.nz/study/cookery/")

  // c.queue("https://www.op.ac.nz/about-us")
  // c.queue("https://www.op.ac.nz/accessibility/")
  c.queue("https://www.amazon.com/")
}

const TronsCrawler = () => {
  already_crawled = []
  crawlWebsites()
}

module.exports = { TronsCrawler }
