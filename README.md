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


### Running Mocha unit tests

Mocha tests are automatically run on a grunt build, which is run on the grunt deploy job as above

###


### Running Selenium automated browser tests

- First set up the protractor and webdriver components (wrappers for selenium + angular enhancements)
$ cd client
$ npm install -g protractor, to start, first run webdriver-manager start --standalone
$ ./node_modules/protractor/bin/webdriver-manager update --standalone --chrome

- Then start the mock application server and run selenium
$ node test/mockserver/mockserver.js &
$ grunt selenium

NOTE: to clean up server instance run the following:
$ ps aux | grep mockserver

kill the process listed below
<user>     27523   0.0  0.2  3054504  32996 s000  S     4:52PM   0:00.27 node test/mockserver/mockserver.js

Or run node mockserver.js in a separate terminal window without the &

###


### Local Development using OpenFDA Fake Server

```sh
$ cd fake-api
$ npm install
$ cd ..
$ PORT=3001 node fake-api/bin/www
```
Above will run a fake OpenFDA server for testing. You can view it at 
    http://localhost:3001/healthcheck/

### Deploying on AWS Resources

There is configuration available to deploy all resources to Amazon Web Services, when ready to deploy your 