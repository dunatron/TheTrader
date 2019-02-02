const { forwardTo } = require("prisma-binding")
const { createWriteStream } = require("fs")
const { processUpload, deleteFile } = require("../modules/fileApi")

const storeUpload = ({ stream, filename }) =>
  new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(filename))
      .on("finish", () => resolve())
      .on("error", reject)
  )

async function uploadImage() {}

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // if (!ctx.request.userId) {
    //   throw new Error('You must be logged in to do that!');
    // }

    const {
      data: { id, title, description, currency, price },
      file,
    } = args

    const uploadedFile = await processUpload(await file, ctx)

    console.log("args => ", args)
    console.log("uploadedFile = >", uploadedFile)

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          title: title,
          description: description,
          currency: currency,
          price: price,
          // This is how to create a relationship between the Item and image File
          image: {
            connect: {
              id: uploadedFile.id,
            },
          },
        },
      },
      info
    )

    console.log(item)

    return item
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the ID from the updates
    delete updates.id
    // if we have an imageItem delete the oldImage
    if (this.updates.file)
      // add the newImage
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
    const item = await ctx.db.query.item(
      { where },
      `{ id title, image {id url} }`
    )
    // const item = await ctx.db.query.item({ where }, `{ id title user { id }}`)
    // 2. Check if they own that item, or have the permissions
    // const ownsItem = item.user.id === ctx.request.userId
    // const hasPermissions = ctx.request.user.permissions.some(permission =>
    //   ["ADMIN", "ITEMDELETE"].includes(permission)
    // )

    // if (!ownsItem && !hasPermissions) {
    //   throw new Error("You don't have permission to do that!")
    // }

    // We need to remove image from cloudinary
    if (item.image) {
      deleteFile({ id: item.image.id, url: item.image.url, ctx })
    }

    // 3. Delete item!
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async singleUpload(parent, { file }, ctx, info) {
    return await processUpload(await file, ctx)
  },
  async uploadFile(parent, { file }, ctx, info) {
    return await processUpload(await file, ctx)
  },
  async uploadFiles(parent, { files }, ctx, info) {
    return Promise.all(files.map(file => processUpload(file, ctx)))
  },
  async renameFile(parent, { id, filename }, ctx, info) {
    return ctx.db.mutation.updateFile({ data: { filename }, where: { id } }, info)
  },
  async deleteFile(parent, { id }, ctx, info) {
    const file = await ctx.db.query.file({ where: { id } }, `{id url}`)
    console.log("FOUND FILE ++++> ", file)
    if (file) {
      deleteFile({ id: file.id, url: file.url, ctx })
    }
    return { id }
    // return await ctx.db.mutation.deleteFile({ where: { id } }, info)
  },
}

module.exports = Mutation
