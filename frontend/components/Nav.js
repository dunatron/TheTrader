import NavStyles from "./styles/NavStyles"
import NavButton from "./styles/NavButton"
import Router from "next/router"

const handleLink = (route = "/", query = {}) => {
  Router.push({
    // pathname: "/about",
    // query: { name: "Zeit" },
    pathname: route,
    query: query,
  })
}

const Nav = () => (
  <NavStyles>
    <NavButton color="secondary" onClick={() => handleLink("/items")}>
      Items
    </NavButton>
    <NavButton color="secondary" onClick={() => handleLink("/sell")}>
      Sell
    </NavButton>
    <NavButton color="secondary" onClick={() => handleLink("/signup")}>
      signup
    </NavButton>
    <NavButton color="secondary" onClick={() => handleLink("/orders")}>
      Orders
    </NavButton>
    <NavButton color="secondary" onClick={() => handleLink("/account")}>
      Account
    </NavButton>
  </NavStyles>
)

export default Nav
