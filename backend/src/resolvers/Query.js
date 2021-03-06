const { forwardTo } = require("prisma-binding")
const { hasPermission } = require("../utils")

const Query = {
  items: forwardTo("db"),

  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  // This would be better off on the client. When the user baseCurrency changes the we just fetch new data directly from the front end.
  // Or rather the client makes 1 call instead of 2(1 to backend 1 to API)
  async exchangeRates(parent, args, ctx, info) {
    const baseCurrency = args.baseCurrency // Will be logged in users currency
    const data = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`
    ).then(resp => resp.json())
    console.log("exchange data ", data)
    return data
  },
  file(parent, { id }, context, info) {
    return context.db.query.file({ where: { id } }, info)
  },

  files(parent, args, context, info) {
    return context.db.query.files(args, info)
  },
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    )
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!")
    }
    console.log(ctx.request.userId)
    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"])

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info)
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You arent logged in!")
    }
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    )
    // 3. Check if the have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    )
    if (!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error("You cant see this buddd")
    }
    // 4. Return the order
    return order
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) {
      throw new Error("you must be signed in!")
    }
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId },
        },
      },
      info
    )
  },
  async polySearch(parent, args, ctx, info) {
    const search = args.search

    const where = {
      OR: [
        { url_contains: search },
        { title_contains: search },
        { description_contains: search },
        { keywords_contains: search },
        { keywords_contains: search },
        { mainContent_contains: search },
        { secondaryContent_contains: search },
      ],
    }
    const queriedItems = await ctx.db.query.searchEngineItems({ where }, info)

    return queriedItems
  },
  async engineFullTextSearch(parent, args, context, info) {
    // user supplied search string
    const searchString = args.search.toLowerCase()
    // func to filter our list by full text search on the name field
    function find(items, text) {
      text = text.split(" ")
      return items.filter(function(item) {
        return text.every(function(el) {
          return item.title.toLowerCase().indexOf(el) > -1
        })
      })
    }
    // not ideal but get all of the questions returned to the server
    const allItems = await context.db.query.searchEngineItems({}, info)
    // filter by our search function
    const searchedItems = find(allItems, searchString)
    // send filtered list to the client
    return searchedItems
  },
}

module.exports = Query
