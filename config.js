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
  console.log("===>>>>>FROM receiveMessage...");
  /*
  fetch("https://ltgcrazyhorse.com/prweb?pyActivity=GetBase64Attachment&DocumentId=PEGASOCIAL-DOCUMENT%20DOC-4001&filename=GMTchoicePlan.pdf", {
    credentials: "include",
    mode: 'no-cors',
  }).then(response => {
    debugger;
    console.log(response);
  }).catch(err => {
    debugger;
    console.log(err);
  })
  */

  if (event.isTrusted && typeof event.data === 'object') {


    switch (event.data.type) {
      case 'OPEN_DOCUMENT_URL':
        const { url } = event.data;
        const { fileName, data } = JSON.parse(event.target.readerControl.getCustomData());
        debugger;

        /* event.target.readerControl.loadDocument(url); */

        event.target.readerControl.loadDocument( base64ToBlob(data), { filename: 'myfile.pdf' } );
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
