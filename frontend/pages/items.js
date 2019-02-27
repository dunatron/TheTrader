import ItemsComponent from "../components/Items"

const ItemsPage = props => (
  <div>
    <ItemsComponent page={parseFloat(props.query.page) || 1} />
  </div>
)

export default ItemsPage
