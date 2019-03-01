import SingleItem from "../components/SingleItem"

const Item = props => (
  <div>
    <h1>Sign In Page</h1>
    <SingleItem id={props.query.id} />
  </div>
)

export default Item
