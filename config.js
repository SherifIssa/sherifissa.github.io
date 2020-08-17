console.log("===>>>>>FROM CONFIG FILE...");

let currentUser;

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
  annotManager.setCurrentUser(currentUser);

  annotManager.on("annotationChanged", (annotations, action) => {
    if (!annotations || annotations.length == 0) return;

    const author = annotations[0].Author;
    if (annotations[0].Author === currentUser) {
      annotManager.exportAnnotCommand()
      .then(xfdfStringCmd => {  
          window.parent.postMessage({
              type: "ANNOTATION_CHANGED",
              author,
              data: xfdfStringCmd
            }
            , '*'
          );
      });
    }
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
        const { fileName, data, author } = JSON.parse(event.target.readerControl.getCustomData());
        currentUser = author;
        debugger;
        console.log(">>>" + event.target.readerControl.annotManager);

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
