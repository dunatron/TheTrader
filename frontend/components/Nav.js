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
    <NavButton color="primary" onClick={() => handleLink("/sell")}>
      Sell
    </NavButton>
    <NavButton color="primary" onClick={() => handleLink("/signup")}>
      signup
    </NavButton>
    <NavButton color="primary" onClick={() => handleLink("/orders")}>
      Orders
    </NavButton>
    <NavButton color="primary" onClick={() => handleLink("/account")}>
      Account
    </NavButton>
  </NavStyles>
)

export default Nav
