import ItemsComponent from "../components/Items"

const ItemsPage = props => (
  <div>
    <h1>Sign In Page</h1>
    <ItemsComponent page={parseFloat(props.query.page) || 1} />
  </div>
)

export default ItemsPage
