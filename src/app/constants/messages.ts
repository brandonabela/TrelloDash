import { AlertTitle } from '../@theme/models/alerts/alert-title';
import { AlertType } from '../@theme/models/alerts/alert-type';

export const messages = {
  storageDownloadSuccess: new AlertTitle('Saved data has been downloaded successfully.', AlertType.Success),
  storageDownloadError: new AlertTitle('No data was found to download.', AlertType.Error),
  storageUploadSuccess: new AlertTitle('Website configuration has been imported.', AlertType.Success),

  trelloInitDownload: new AlertTitle('The creation of the LaTeX project with attachments has been initiated.', AlertType.Primary),
  csvDocumentSuccess: new AlertTitle('The project has been downloaded successfully as a CSV document.', AlertType.Success),
  texDocumentSuccess: new AlertTitle('The project has been downloaded successfully as a LaTeX document.', AlertType.Success),
  zipDocumentSuccess: new AlertTitle('The project has been downloaded successfully, containing the LaTeX document and attachments.', AlertType.Success),
  zipDocumentError: new AlertTitle('The project has been downloaded successfully, containing the LaTeX document and attachments.', AlertType.Error),
  documentErrorMinOne: new AlertTitle('At least one field needs to be selected for export.', AlertType.Error),

  trelloInitAdd: new AlertTitle('Adding Trello project.', AlertType.Primary),
  trelloSuccessAdd: new AlertTitle('Trello project has been added successfully.', AlertType.Success),
  trelloNoAccess: new AlertTitle('The provided URL cannot be accessed.', AlertType.Error),
  trelloAlreadyAdded: new AlertTitle('This Trello project has already been added.', AlertType.Error),
  trelloInvalidLink: new AlertTitle('The provided URL is not a valid Trello project.', AlertType.Error),
  trelloNegativeExpiry: new AlertTitle('The expiry date should be a positive number.', AlertType.Error),

  trelloSuccessUpdated: new AlertTitle('The Trello project has been updated successfully.', AlertType.Success),
  trelloSuccessRemove: new AlertTitle('The Trello project has been removed successfully.', AlertType.Success)
};
