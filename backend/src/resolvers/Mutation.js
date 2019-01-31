const { forwardTo } = require("prisma-binding")

const Mutation = {
  async createItem(parent, args, context, info) {
    const item = await context.db.mutation.createItem(
      { data: { ...args } },
      info
    )
    return item
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the ID from the updates
    delete updates.id
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    )
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`)
    // 2. Check if they own that item, or have the permissions
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    )

    if (!ownsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that!")
    }

    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info)
  },
}

module.exports = Mutation
