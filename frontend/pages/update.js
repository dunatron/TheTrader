import UpdateItem from "../components/UpdateItem"

const UpdateItemPage = props => (
  <div>
    <UpdateItem id={props.query.id} />
  </div>
)

export default UpdateItemPage
