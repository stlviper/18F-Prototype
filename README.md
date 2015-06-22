# OpenFDAViz

OpenFDAViz is a cloud based viewer for the OpenFDA Api Data

### Installation for local Testing

```sh
$ git clone https://github.com/stlviper/18F-Prototype.git 18F-Prototype
$ cd 18F-Prototype
$ npm install
$ cd client
$ npm install
$ cd ../server
$ npm install
$ cd ..
$ echo {} > aws.json
$ grunt deploy
$ PORT=3002 node server/app.js
```

Open the HTML file 'client/index.html' in a browser of your choice

### Local Development using OpenFDA Fake Server

```sh
$ PORT=3001 node fake-api/bin/www
```
Above will run a fake OpenFDA server for testing.
