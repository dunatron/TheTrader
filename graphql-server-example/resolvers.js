// https://github.com/jaydenseric/apollo-upload-examples/blob/master/api/resolvers.mjs

import apolloServerKoa from 'apollo-server-koa'

export default {
  Upload: apolloServerKoa.GraphQLUpload,
  Query: {
    uploads: () => db.get('uploads').value()
  },
  Mutation: {
    singleUpload: (obj, { file }) => processUpload(file),
    async multipleUpload(obj, { files }) {
      const { resolve, reject } = await promisesAll.all(
        files.map(processUpload)
      )

      if (reject.length)
        reject.forEach(({ name, message }) =>
          // eslint-disable-next-line no-console
          console.error(`${name}: ${message}`)
        )

      return resolve
    }
  }
}
