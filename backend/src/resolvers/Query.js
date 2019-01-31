const { forwardTo } = require("prisma-binding")

const Query = {
  items: forwardTo("db"),

  item: forwardTo("db"),
  // itemsConnection: forwardTo("db"),
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
}

module.exports = Query
