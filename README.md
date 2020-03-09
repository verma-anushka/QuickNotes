# QUICK NOTES

QuickNotes is a simple, plain-text note-taking app for the web. This application is developed using Node.js, Express and MongoDB. allows a user to create all categories of notes: meeting notes, to-do lists, project notes, planners etc.

## DEMO LINK

[http://quick-notes-app.herokuapp.com/](http://quick-notes-app.herokuapp.com/)

## SETUP

- Clone or download the repository **'Quick Notes'** by clicking on the Clone or Download button `$ git clone`
- Navigate to the folder `$ cd quicknotes-master`
- Install all the required dependencies `$ npm install`
- Inside the directory, create a .env file `$mkdir .env`
  This file should contain the following keys:
  - GMAILPW =
  - CLOUDINARY_API_KEY =
  - CLOUDINARY_API_SECRET =
  - FB_CLIENT_ID =
  - FB_CLIENT_SECRET =
  - GOOGLE_CLIENT_ID =
  - GOOGLE_CLIENT_SECRET =
  - SENDGRID_API_KEY =
  - DATABASEURL =
- Run the application: `$ node app.js`
- Inside your browser, navigate to the link localhost:3000

## FEATURES

- **Signup/Login** using email and password or OAuth provider (Google/Facebook)
- **Rich Note Input** (lists, headings, quotes and more)
- **Forget password**
- Notes **CRUD** pages
- User **CRUD** pages
- **Image Upload**
- Notes **Sharing**
- **Text editing**
- **Simple UX**

## TO-DO

- [x] Google & FB Auth
- [x] Share Notes
- [x] Notes categories
- [ ] Add attchements
- [ ] Search Notes
- [ ] Download Notes

## TECHNOLOGIES USED

- **HTML5**: current major version of HTML that subsumes XHTML
- **CSS3**: latest evolution of the Cascading Style Sheets language
- **JS/JQUERY**: JavaScript library designed to simplify HTML DOM
- **NODE JS** - JavaScript runtime environment that executes JavaScript code outside of a browser
- **MONGODB** - cross-platform document-oriented database program
- **GIT** - version-control system for tracking changes in source code

## CONTRIBUTE

Issues, PRs, and all your suggestions and discussions are very welcome!
