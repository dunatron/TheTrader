import BulkFiles from "../components/BulkFiles"
import PleaseSignIn from "../components/PleaseSignIn"

const BulkFilesPage = props => (
  <div>
    <PleaseSignIn>
      <BulkFiles />
    </PleaseSignIn>
  </div>
)

export default BulkFilesPage
