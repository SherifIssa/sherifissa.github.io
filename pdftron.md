# Real-time Document Collaboration with Pega and PDFTron

Pega Real-time Document Collaboration with PDFTron enables Pega users to view and collaborate on wide variety of documents inside Pega platform. The component provides the following functionalities:
- View a variety of [documents](https://www.pdftron.com/pdf-sdk/supported-file-formats/) inline inside Pega platform.
- Collaborate on a variety of [documents](https://www.pdftron.com/pdf-sdk/supported-file-formats/) inside Pega platform: 
-- Pega users can simultaneously add, edit and delete annotations to/from documents stored in Pega. The annotations are broadcasted to all online users in near real-time and persisted in [XFDF](https://www.iso.org/obp/ui/#iso:std:iso:19444:-1:ed-1:v1:en) format outside the original documents.
- The component uses PDFTron [Client-side JavaScript](https://www.pdftron.com/documentation/web/guides/client-only-deployment/) configuration and supports both on-premise and PegaCloud deployments.

The components consists of `PegaRTC` and  `PDFTron` rulesets:
- `PegaRTC` contains the implementation for:
	- Broadcasting annotation changes to all collaborators.
	- Persisting annotations.
	- Providing configuration for the WebViewer using the [Annotate](#annotate-flow-action) flow action.
- `PDFTron`:
	- Contains the implementation for the WebViewer, `WebViewer_pdftron`  for same-domain deployment and `WebViewer_pdftron_cross_origin` for cross-domain.
	

### Package Content

`pega_pdftron_rtc.zip` contains the following assets:

 - pega_pdftron_rap.zip: the RAP file that contains the implementation.
 - config.js: required only for cross-domain deployment, see [PDFTron documentation](https://www.pdftron.com/documentation/web/guides/config-files/)
 - README.md

### Installation

 - Unzip `pega_pdftron_rtc.zip` 
- Import `pega_pdftron_rap.zip` RAP file.
- Add `PegaRTC and PdfTron` rulesets to your application.
- Deploy PDFTron `WebViewer` to your web server:
	-	Follow PDFTron [instructions](https://www.pdftron.com/documentation/web/get-started/manually/) to download and deploy PDFTron WebViewer to your application server.
	-	For cross-domain deployment copy config.js to

> PDFTron `WebViewer` can be deployed to the same domain as Pega server or to a different domain. Use `WebViewer_pdftron` section for same domain deployment and `WebViewer_pdftron_cross_origin` section for cross domain deployment.

### Main Components

#### Annotate flow action
The `Annotate` flow action uses `@baseclass.WebViewerSection` to enable users to view and collaborate on documents inside Pega cases. It can be configured with `WebViewer_pdftron` section for same-domain deployment or  `WebViewer_pdftron_cross_origin` for cross-domain deployment.

**Usage:**
 -  To collaborate on a document or an attachment find and record the document pzInsKey and the file name. 
 -   Create a data transform that populate the following two @baseclass properties in all cases that will collaborate on the document:
	- `DocumentId_` : the document/attachment ID from the step above.
	- `AnnotationFileName_`: the document/attachment file name from the step above.
 - Add `@baseclass.Annotate` flow action to your case.
 - Open `@baseclass.WebViewerSection` section and configure the following parameters: 
	 - Height: the `WebViewer` div height in pixels 
	 - WebViewer URL: the WebViewer URL for example: `/your_server/viewer/lib/webviewer.min.js`
	 - WebViewer license key: PDFTron license key
	 - For cross-domain deployment replace `WebViewer_pdftron` with `WebViewer_pdftron_cross_origin`
  
> Annotations are automatically saved, they are not affected by the submit or cancel buttons.

> Supported documents/attachments types:
	-	`PEGASOCIAL-DOCUMENT`
	-	`DATA-WORKATTACH-FILE`

**Browser Support**

Chrome, Safari and FireFox.
