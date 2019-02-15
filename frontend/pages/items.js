import ItemsComponent from "../components/Items"

const ItemsPage = props => (
  <div>
    <a href="https://google.com">Go to google</a>
    <a href="test.php">A test Page</a>
    <a href="//www.youtube.com/upload">You tube test</a>
    <a href="../../anotherPage.php">Another page</a>
    <a href="/test/another/../../anotherpage.php">Aother page</a>
    <a href="#anchor">A link with an anchor</a>
    <a href="//www.sdaasd.com/somepage.php">Some Page</a>
    <a href="./moooore.php">Another Page</a>
    <a href="/even-more.php">Even more</a>
    <a href="javascript:d">Javascript link</a>
    <ItemsComponent />
  </div>
)

export default ItemsPage
