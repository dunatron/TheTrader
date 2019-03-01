import UpdateItem from "../components/UpdateItem"

const UpdateItemPage = props => (
  <div>
    <h1>Sign In Page</h1>
    <UpdateItem id={props.query.id} />
  </div>
)

export default UpdateItemPage
