window.addEventListener('viewerLoaded', function () {
  console.log('Viewer Loaded');
});

window.addEventListener('documentLoaded', () => {
  const annotManager = docViewer.getAnnotationManager();
  const rectangle = new Annotations.RectangleAnnotation();
  rectangle.PageNumber = 2;
  rectangle.X = 100;
  rectangle.Y = 100;
  rectangle.Width = 250;
  rectangle.Height = 250;
  rectangle.Author = annotManager.getCurrentUser();
  annotManager.addAnnotation(rectangle);
});

function receiveMessage(event) {
  console.log("===>>>>>FROM CONFIG FILE...")
  debugger;
  if (event.isTrusted && typeof event.data === 'object') {
    switch (event.data.type) {
      case 'OPEN_DOCUMENT_URL':
        const { url } = event.data;
        event.target.readerControl.loadDocument(url);
        break;
      case 'CLOSE_DOCUMENT':
        event.target.readerControl.closeDocument();
        break;
      default:
        break;
    }
  }
}

window.addEventListener('message', receiveMessage, false);