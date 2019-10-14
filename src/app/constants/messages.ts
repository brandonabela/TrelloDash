import { AlertTitle } from '../@theme/models/alerts/alert-title';
import { AlertType } from '../@theme/models/alerts/alert-type';

export const messages = {
  storageDownloadSuccess: new AlertTitle('The saved data has been successfully downloaded', AlertType.Success),
  storageDownloadError: new AlertTitle('No data was saved thus, no data can be downloaded', AlertType.Error),

  texDocumentSuccess: new AlertTitle('The selected project has been successfully downloaded as a latex document', AlertType.Success),
  zipDocumentSuccess: new AlertTitle('The selected project has been successfully downloaded containing latex document and the attachments', AlertType.Success),
  storageUploadSuccess: new AlertTitle('The valid properties were imported', AlertType.Success),

  trelloInitiateAdd: new AlertTitle('The add trello URL has been initiated', AlertType.Info),
  trelloSuccess: new AlertTitle('The data from the provided link was successfully extracted', AlertType.Success),
  trelloNoAccess: new AlertTitle('The provided URL cannot be accessed', AlertType.Error),
  trelloAlreadyAdded: new AlertTitle('The provided URL was already added', AlertType.Error),
  trelloInvalidLink: new AlertTitle('The provided URL is invalid since it is not a trello link', AlertType.Error)
};
