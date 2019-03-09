import NavStyles from "./styles/NavStyles"
import NavButton from "./styles/NavButton"
import Router from "next/router"
import User from "./User"
import Signout from "./Signout"
import { Mutation } from "react-apollo"
import { TOGGLE_CART_MUTATION } from "./Cart"

const handleLink = (route = "/", query = {}) => {
  Router.push({
    // pathname: "/about",
    // query: { name: "Zeit" },
    pathname: route,
    query: query,
  })
}

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
        <NavStyles>
          <NavButton
            color="secondary"
            onClick={() => handleLink("/polysearch")}>
            Poly Search
          </NavButton>
          <NavButton
            color="secondary"
            onClick={() => handleLink("/enginesearch")}>
            E. Full
          </NavButton>
          <NavButton color="primary" onClick={() => handleLink("/memegen")}>
            Meme Gen
          </NavButton>
          <NavButton color="secondary" onClick={() => handleLink("/items")}>
            Shop
          </NavButton>
          {me && (
            <>
              <NavButton color="primary" onClick={() => handleLink("/sell")}>
                Sell
              </NavButton>
              <NavButton color="primary" onClick={() => handleLink("/account")}>
                Account
              </NavButton>
              <NavButton color="primary" onClick={() => handleLink("/orders")}>
                Orders
              </NavButton>
              <NavButton color="primary" onClick={() => handleLink("/files")}>
                Files
              </NavButton>
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => (
                  <button onClick={toggleCart}>
                    My Cart
                    {/* <CartCount
                      count={me.cart.reduce(
                        (tally, cartItem) => tally + cartItem.quantity,
                        0
                      )}
                    /> */}
                  </button>
                )}
              </Mutation>
              <NavButton
                color="primary"
                onClick={() => handleLink("/bulkfiles")}>
                Bulk Upload
              </NavButton>
              <Signout />
            </>
          )}
          {!me && (
            <>
              <NavButton color="primary" onClick={() => handleLink("/login")}>
                Login
              </NavButton>
            </>
          )}
        </NavStyles>
      )
    }}
  </User>
)

export default Nav
