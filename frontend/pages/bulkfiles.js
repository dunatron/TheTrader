import CreateBulkFiles from "../components/CreateBulkFiles"
import PleaseSignIn from "../components/PleaseSignIn"

const BulkFilesPage = props => (
  <div>
    <h1>Sign In Page</h1>
    <PleaseSignIn>
      <CreateBulkFiles />
    </PleaseSignIn>
  </div>
)

export default BulkFilesPage
