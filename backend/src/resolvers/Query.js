const { forwardTo } = require("prisma-binding")

const Query = {
  items: forwardTo("db"),
  // me(parent, args, ctx, info) {
  //   // check if there is a current user ID
  //   if (!ctx.request.userId) {
  //     return null
  //   }
  //   return ctx.db.query.user(
  //     {
  //       where: { id: ctx.request.userId },
  //     },
  //     info
  //   )
  // },
  // async users(parent, args, ctx, info) {
  //   // 1. Check if they are logged in
  //   if (!ctx.request.userId) {
  //     throw new Error("You must be logged in!")
  //   }
  //   console.log(ctx.request.userId)
  //   // 2. Check if the user has the permissions to query all the users
  //   hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"])

  //   // 2. if they do, query all the users!
  //   return ctx.db.query.users({}, info)
  // },
  async exchangeRates(parent, args, ctx, info) {
    const baseCurrency = args.baseCurrency // Will be logged in users currency
    const data = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`
    ).then(resp => resp.json())
    console.log("exchange data ", data)
    return data
  },
}

module.exports = Query
