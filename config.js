console.log("===>>>>>FROM CONFIG FILE...");

let currentUser;
let annotManager;
let importMode = false;

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
  annotManager = docViewer.getAnnotationManager();
  annotManager.setCurrentUser(currentUser);

  annotManager.on("annotationChanged", (annotations, action) => {
    if (!annotations || annotations.length == 0) return;
    debugger;
    const author = annotations[0].Author;
    if (annotations[0].Author === currentUser && !importMode) {
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
});

function receiveMessage(event) {
  if (event.isTrusted && typeof event.data === 'object') {
    switch (event.data.type) {
      case 'OPEN_DOCUMENT':
        const { fileName, data, author } = JSON.parse(event.target.readerControl.getCustomData());
        currentUser = author;
        event.target.readerControl.loadDocument( base64ToBlob(data), { filename: fileName } );
        break;
      case 'LOAD_ANNOTATIONS':
        const { annotations } = event.data;
        debugger;
        console.log(">>>docViewer=" + docViewer);
        setTimeout(() => {
          importMode = true; 
          annotManager.importAnnotations(annotations)
          .then(imported => {
            debugger;
            importMode = false;          
          }).catch (err => {
            console.log(err);
            debugger;
          });
        }, 500);
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
