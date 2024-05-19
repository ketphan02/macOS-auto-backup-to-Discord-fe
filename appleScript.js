const app = Application.currentApplication();
app.includeStandardAdditions = true;
const sysApp = Application('System Events');

function run(input, parameters) {
	const testPath = Path('/Users/ketphan02/PhanKiet/test-automator/Test');
	_run(testPath, parameters)
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
