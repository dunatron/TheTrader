import Link from "next/link"

const HomePage = props => (
  <div>
    <h1>Home Page index.js</h1>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
  </div>
)

export default HomePage
