import ItemsComponent from "../components/Items"

const ItemsPage = props => (
  <ItemsComponent page={parseFloat(props.query.page) || 1} />
)

export default ItemsPage
