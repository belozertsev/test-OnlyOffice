# Test task for the position of full-stack developer at OnlyOffice company.
### Requirements
1. Install [ONLYOFFICE Document Server](https://helpcenter.onlyoffice.com/installation/docs-index.aspx).
2. Deploy a [Test example](https://api.onlyoffice.com/editors/demopreview) of connecting ONLYOFFICE Document Server in any of the available languages and open the file for editing.
3. Change the logo on the main page in the test example to any image (take a screenshot).
4. Change the logo in the editor (take a screenshot).
5. Create your site with file upload, followed by conversion to PDF by ONLYOFFICE Document Server, and with the ability to download the result.

### Solution
1. Document server was installed on a virtual machine running Ubuntu 22.04.3.
![1.png]()
2. To deploy the Test example, Node.js version was selected.
3. To change logo in main page of the example app:
	- changed path to new image at `/example/views/index.ejs (line 36)`
	- added edited version of a logo `/example/public/images/logo_edited.svg`
![2.png]()
4. To change logo in the editor page:
	- (at documentserver) changed path to an image `/var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/css/app.css (line 4407)`
	- added edited version of a logo `/var/www/onlyoffice/documentserver/web-apps/apps/common/main/resources/img/header/header-logo_s_edited.svg`
(I have also been forced to change owner and mod of the changed logo)
![3.png]()
5. In my understanding, the main task was to work with the "Document server", so the site was created in the simplest possible way - `index.js` for server side and `index.html` for client side.

Some screenshots:
1. Site is opened via Yandex browser on host OS. In the URL bar - ip address of a VM with running application.
![4.png]()

2. File uploading.
![5.png]()

3. Downloading the converted (to PDF) file.
![6.png]()
