ObjC.import('Foundation');
ObjC.import('AppKit');
ObjC.import('stdlib');

const app = Application.currentApplication();
app.includeStandardAdditions = true;
const sysApp = Application('System Events');

function run(input, parameters) {
	_run(input, parameters)
}

function _run(input, parameters, relativeParentPath = '') {
	const newItemPath = input.toString();
	const isNewItemAFolder = isFolder(newItemPath);
	if (isNewItemAFolder) {
		const allItems = sysApp.folders.byName(newItemPath).diskItems.name();
		// Recurrsion this
		allItems.forEach((childItem) => {
			const fullChildItemPath = Path(newItemPath + '/' + childItem);
			_run(fullChildItemPath, parameters, relativeParentPath + '/' + getFileNameFromPath(newItemPath));
		})
	} else {
		app.displayNotification(newItemPath + ': ' + relativeParentPath);
        sendFileToBackend(newItemPath);
	}
	return input;
}

function isFolder(dirPath) {
	try {
		sysApp.folders.byName(dirPath).diskItems.name();
		return true;
	} catch (e) {
		return false;
	}
}

function getFileNameFromPath(path) {
	const splittedPath = path.split('/');
	return splittedPath[splittedPath.length - 1];
}

function sendFileToBackend(filePath) {
    if (!filePath) {
        app.displayNotification('No file path provided');
        return;
    }
    const command = `curl -X POST -F "File=@${filePath}" http://localhost:8080/message`;
    const result = app.doShellScript(command);
    app.displayNotification(result);
}
