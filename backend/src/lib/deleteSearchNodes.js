const db = require("../db")

const allSearchItems = async () =>
  await db.query.searchEngineItems(null, `{id}`)

const mapToIds = array => array.map(o => o.id)

const deleteSearchItem = async id =>
  await db.mutation
    .deleteSearchEngineItem(
      {
        where: {
          id: id,
        },
      },
      `{id}`
    )
    .catch(e => console.log("ERROR => e ", e))

exports.deleteSearches = async () => {
  const items = await allSearchItems()
  const nodeIds = mapToIds(items)
  nodeIds.map(async id => {
    await deleteSearchItem(id)
  })
}
