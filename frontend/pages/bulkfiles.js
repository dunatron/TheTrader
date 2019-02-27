import CreateBulkFiles from "../components/CreateBulkFiles"
import PleaseSignIn from "../components/PleaseSignIn"

const BulkFilesPage = props => (
  <div>
    <PleaseSignIn>
      <CreateBulkFiles />
    </PleaseSignIn>
  </div>
)

export default BulkFilesPage
