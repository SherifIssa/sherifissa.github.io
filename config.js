console.log("===>>>>>FROM CONFIG FILE...");


function base64ToBlob(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: 'application/pdf' });
}


window.addEventListener('viewerLoaded', function () {
  console.log('Viewer Loaded');
});

window.addEventListener('documentLoaded', () => {
  const annotManager = docViewer.getAnnotationManager();
  annotManager.exportAnnotCommand()
  .then(xfdfStringCmd => {
    annotManager.on("annotationChanged", (annotations, action) => {
          if (!annotations || annotations.length == 0) return;
          const author = annotations[0].Author;

          window.parent.postMessage({
              type: "ANNOTATION_CHANGED",
              author,
              data: xfdfStringCmd
            }
            , '*'
          );
        });
  });

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
  if (event.isTrusted && typeof event.data === 'object') {
    switch (event.data.type) {
      case 'OPEN_DOCUMENT_URL':
        const { fileName, data } = JSON.parse(event.target.readerControl.getCustomData());
        debugger;
        event.target.readerControl.loadDocument( base64ToBlob(data), { filename: fileName } );
        break;
      case 'CLOSE_DOCUMENT':
        event.target.readerControl.closeDocument();
        break;
      case 'ANNOTATION_PUBLISHED':
        debugger;
        console.log(event.data);
        break;        
      default:
        break;
    }
  }
}

window.addEventListener('message', receiveMessage, false);
