import { AlertTitle } from '../@theme/models/alerts/alert-title';
import { AlertType } from '../@theme/models/alerts/alert-type';

export const messages = {
  storageDownloadSuccess: new AlertTitle('The saved data has been downloaded successfully', AlertType.Success),
  storageDownloadError: new AlertTitle('No data was saved thus, no data can be downloaded', AlertType.Error),
  storageUploadSuccess: new AlertTitle('Website configuration were imported', AlertType.Success),

  trelloInitDownload: new AlertTitle('The creation of the latex project with attachments has been initiated', AlertType.Info),
  csvDocumentSuccess: new AlertTitle('The project has been downloaded successfully as a CSV document', AlertType.Success),
  texDocumentSuccess: new AlertTitle('The project has been downloaded successfully as a latex document', AlertType.Success),
  zipDocumentSuccess: new AlertTitle('The project has been downloaded successfully containing the latex document and attachments', AlertType.Success),
  documentErrorMinOne: new AlertTitle('A minimum of at least one field needs to be exported', AlertType.Error),
  documentErrorString: new AlertTitle('The exported fields need to be filled out with a value', AlertType.Error),

  trelloInitAdd: new AlertTitle('The add trello project has been initiated', AlertType.Info),
  trelloSuccessAdd: new AlertTitle('The trello project has been extracted successfully', AlertType.Success),
  trelloNoAccess: new AlertTitle('The provided URL cannot be accessed', AlertType.Error),
  trelloAlreadyAdded: new AlertTitle('The trello project is already added', AlertType.Error),
  trelloInvalidLink: new AlertTitle('The provided URL is not a trello project', AlertType.Error),
  trelloNegativeExpiry: new AlertTitle('The expiry date should be a positive number', AlertType.Error),

  trelloSuccessUpdated: new AlertTitle('The trello project has been updated successfully', AlertType.Success),
  trelloSuccessRemove: new AlertTitle('The trello project has been removed successfully', AlertType.Success)
};
