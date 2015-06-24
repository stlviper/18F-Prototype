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

***** Summary of Team OGSystems Agile Development Methodology *****

Team OGSystems used an interactive agile software development approach to create the FDA prototype. Team OGSystems operates as an agile shop and pooled resources from a variety of teams and shifted priorities in response to this RFQ.
While some priorities were shifted for each team member, the process for responding and building the prototype remained business as usual for Team OGSystems.
We approached this as a short-term hackathon and swarmed many aspects of building out the prototype and process. We identified a sole Product Owner (PO), Chad Dalton to help set priorities and groom our backlog along the way.
The PO was responsible for managing and prioritizing our agile JIRA workflow and lists. We established a multidisciplinary and collaborative team made up of seven of the labor categories out of both the design Pool One and development Pool Two.
We conducted a team standup meeting, and as a team, we outlined our cadence to include a sprint demo, a release demo, and regularly scheduled standups. We used two daily standups to accommodate the accelerated pace and collaboration necessary to meet the delivery deadline.
We immediately followed the kick-off meeting with our initial design phase and conducted a MindMapping exercise to drive the team to a singular vision and strategy.
The MindMap helped the PO and team create the initial backlog and begin to set priorities, and provided a forum for us to brainstorm what we may want to do with the data and how we might drive the prototype forward. (Figure 1 MindMap)
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-Mindmap001.jpg "Mind Map")

After the initial standup, the team began to self identify in roles that matched their experience and expertise. We started design development, built wireframes, designed architecture, and scheduled user engagement sessions.
With the initial design phase started, we engaged end customers in a collaborative session to solicit feedback on initial design concepts. This session yielded additional design and development concepts and stories.
(Figure 2: Customer Engagement)
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UserEngagementSession001.jpg "Customer Engagement")
We also conducted a Persona Development brainstorming session and developed Personas to aid the design and prioritization process.
(Figure 3: Persona Brainstorming)
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-PersonaDevelopmentMindmap003.jpg "Persona MindMap")
(Figure 4: Persona Development)
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/27-EF-46UserPersonas-1506.jpg "Persona Development")
