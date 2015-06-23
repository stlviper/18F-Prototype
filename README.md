# OpenFDAViz

OpenFDAViz is a cloud based viewer for the OpenFDA Api Data

### Installation for local Testing

This project consist of two parts. One is the Server Side API that makes calls to OpenFDA API and pre-processes the results while also caching certain values. The second is the User Interface. The server side API code is in the /server/ folder and the UI is in the /client/ folder. Both are managed by npm package manager. To get started you must run npm install in the root, client and server folders. The final production code is also designed to run on Amazon Elastic Beanstalk for the server API and S3/Cloudfront CDN for the User Interface. Neither are required to run locally but you will need to create an empty aws.json credentials file for the build to succeed. Once those commands are entered you can start the API node server and visit the interface. The commands are listed below.

```sh
$ git clone https://github.com/stlviper/18F-Prototype.git 18F-Prototype
$ cd 18F-Prototype
$ npm install
$ echo {} > aws.json
$ npm run-script startDev
```

Client will be available at - http://localhost:8000
Server API will be available at - http://localhost:3002

- To deploy and run the production build (minified sources and concatenated css and templates and uploaded to AWS)
$ grunt deploy:prod


### Running Mocha unit tests

Mocha tests are automatically run on a grunt build, which is run on the grunt deploy job as above

###


### Running Selenium automated browser tests

- First set up the protractor and webdriver components (wrappers for selenium + angular enhancements)
```
$ cd client
$ npm install -g protractor, to start, first run webdriver-manager start --standalone
$ ./node_modules/protractor/bin/webdriver-manager update --standalone --chrome
```
- Then start the mock application server and run selenium
```
$ node test/mockserver/mockserver_prod.js &
$ grunt selenium
```

NOTE: to clean up server instance run the following:
```
$ ps aux | grep mockserver
```
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

### Deploying OpenFDAVizAPI Server on AWS Resources

There is configuration available to deploy all resources to Amazon Web Services, when ready to deploy OpenFDAViz to your Amazon instance follow the steps below.
*** WARNING ***
Executing the commands below will cost you money as it will start 1 EC2 instance with autoscaling turned on and push objects to S3.

Open aws.json and modify the contents to look like this,
```
{
  "AWSAccessKeyId": "YOUR KeyID",
  "AWSSecretKey": "YOUR SECRET"
}
```
Then you need to have AWS EB Cli Installed (http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) you will be prompted to enter your KeyID and Secret when running the command below.

```
$ cd server
$ eb init
$ eb create 
$ eb open
```

You will now have a running version of the OpenFDAViz app. The eb open command will open the API in your browser. 