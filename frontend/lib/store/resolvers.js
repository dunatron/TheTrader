
import { LOCAL_STATE_QUERY } from "../../components/Cart"

const resolvers = () => {
  return {
    Mutation: {
      toggleCart(_, variables, { cache }) {
        console.log("toggleCart => mutation")
        // read the cartOpen value from the cache
        const { cartOpen } = cache.readQuery({
          query: LOCAL_STATE_QUERY,
        })
        // Write the cart State to the opposite
        const data = {
          data: { cartOpen: !cartOpen },
        }
        cache.writeData(data)
        return data
      },
    },
  }
}

export default resolvers
