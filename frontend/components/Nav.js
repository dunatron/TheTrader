import NavStyles from "./styles/NavStyles"
import NavButton from "./styles/NavButton"
import Router from "next/router"
import User from "./User"
import Signout from "./Signout"

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
    {({ data: { me } }) => (
      <NavStyles>
        <NavButton color="secondary" onClick={() => handleLink("/polysearch")}>
          Poly Search
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
            <NavButton color="primary" onClick={() => handleLink("/bulkfiles")}>
              Bulk Upload
            </NavButton>
            <Signout />
          </>
        )}
        {!me && (
          <>
            <NavButton color="primary" onClick={() => handleLink("/signup")}>
              signup
            </NavButton>
          </>
        )}
      </NavStyles>
    )}
  </User>
)

export default Nav
