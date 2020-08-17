console.log("===>>>>>FROM CONFIG FILE...");

let currentUser;
let annotManager;
let importMode = false;
let annotations;

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
    if (importMode || !annotations || annotations.length === 0) return;
    debugger;
    const author = annotations[0].Author;
    if (annotations[0].Author === currentUser) {
      console.log(">>>>" + readerControl);
      readerControl && readerControl.openElements([ 'leftPanel' ]);
      
      annotManager.exportAnnotCommand()
      .then(xfdfStringCmd => {  
        window.parent.postMessage({
            type: "PUBLISH_ANNOTATION",
            author,
            data: xfdfStringCmd
          }
          , '*'
        );
      }).catch (err => {
        console.log(err);
        debugger;
      });;

      annotManager.exportAnnotations({ links: false, widgets: false })
      .then(xfdfString => {  
        window.parent.postMessage({
            type: "SAVE_ANNOTATION",
            author,
            data: xfdfString
          }
          , '*'
        );
      }).catch (err => {
        console.log(err);
        debugger;
      });;      
    }
  });
  
  setTimeout(() => {
      debugger;
      importMode = true;
      annotManager.importAnnotations(annotations)
      .then(imported => {
        debugger;
        readerControl && readerControl.openElements([ 'rightPanel' ]);

        importMode = false;
        docViewer.refreshAll();
        annotManager.drawAnnotations(docViewer.getCurrentPage());        
      }).catch (err => {
        importMode = false;        
        console.log(err);
        debugger;
      });
    }, 100);
});

function receiveMessage(event) {
  if (event.isTrusted && typeof event.data === 'object') {
    switch (event.data.type) {
      case 'OPEN_DOCUMENT':
        const { fileName, data, author } = JSON.parse(event.target.readerControl.getCustomData());
        currentUser = author;
        debugger;
        annotations = event.data.annotations;
        event.target.readerControl.loadDocument( base64ToBlob(data), { filename: fileName } );
        break;
      case 'LOAD_ANNOTATIONS':
       
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
