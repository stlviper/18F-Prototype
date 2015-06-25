openFDAViz URL: http://s3.amazonaws.com/openfdaviz/client/index.html

# openFDAViz

openFDAViz is a cloud based viewer for the openFDA Api Data

### Prerequisites

* Node
* Grunt-cli

openFDAViz is a node.js application that has several Prerequisites. These include, node.js, grunt and npm, you will also need git installed to checkout the application from github. On a new installation of linux the following commands will setup your environment.

```
$ sudo su - 
$ curl -sL https://rpm.nodesource.com/setup | bash -
$ yum install -y gcc-c++ make nodejs git
$ exit
$ sudo npm install -g grunt-cli
```

or if you are running ubunu,

```
$ sudo apt-get update
$ sudo apt-get -y install nodejs npm git
$ sudo npm install -g grunt-cli 
```

If you get an error about not being able to find node you may need to symlink /usr/bin/nodejs to /usr/bin/node

### Installation for local Testing / Development

This project consist of two parts. One is the Server Side API that makes calls to openFDA API and pre-processes the results while also caching certain values. The second is the User Interface. The server side API code is in the /server/ folder and the UI is in the /client/ folder. Both are managed by npm package manager. The final production code is also designed to run on Amazon Elastic Beanstalk for the server API and S3/Cloudfront CDN for the User Interface. Neither are required to run locally but you will need to create an empty aws.json credentials file for the build to succeed. Once those commands are entered you can start the API node server and a lightweight client server locally and visit the interface. The commands are listed below.

```sh
$ git clone https://github.com/stlviper/18F-Prototype.git
$ cd 18F-Prototype
$ echo {} > aws.json
$ npm install
$ npm run-script startDev
```

Client will be available at - http://localhost:8000
Server API will be available at - http://localhost:3002

- To deploy and run the production build (minified sources and concatenated css and templates and uploaded to AWS)
$ grunt deploy:prod


### Running Mocha unit tests

Mocha tests are automatically run on a grunt build, which is run on the grunt deploy job as above.

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


### Local Development using openFDA Fake Server

```sh
$ cd fake-api
$ npm install
$ cd ..
$ PORT=3001 node fake-api/bin/www
```
Above will run a fake openFDA server for testing. You can view it at 
    http://localhost:3001/healthcheck/

### Deploying openFDAVizAPI Server on AWS Resources

There is configuration available to deploy all resources to Amazon Web Services, when ready to deploy openFDAViz to your Amazon instance follow the steps below.
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

You will now have a running version of the openFDAViz app. The eb open command will open the API in your browser.

## *** Summary of Team OGSystems Agile Development Methodology ***git

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

(Figure 2.1: Customer Engagement Session)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=myWMVXG98so" target="_blank"><img src="http://img.youtube.com/vi/myWMVXG98so/0.jpg"
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a>

(Figure 2.2: Customer Suggestions)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UIMockUp004.jpg "Customer Suggestions")

We also conducted a Persona Development brainstorming session and developed Personas to aid the design and prioritization process.

(Figure 3: Persona Brainstorming)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-PersonaDevelopmentMindmap003.jpg "Persona MindMap")

(Figure 4: Persona Development)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/27-EF-46UserPersonas-1506.jpg "Persona Development")

Our first design priority was to swarm on the architectural runway and build out enough of the architecture. Nolan Hager led the devops decisions to get us up and running in AWS using Elastic Beanstalk to set us up to build a scalable web application that interfaces with the FDA api.
This architecture allows the app to scale up and load balance based on its server capacity and configuration.

(Figure 5: openFDAViz Architecture)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/18fAWSArchitecture.png "openFDAViz Architecture")

During the project we used several applications to facilitate the collaboration of remotely based teams (Saint Louis; Chantilly, VA). We used HipChat for day-to-day interactions and integrated it with our Atlassian Suite to receive notifications in our 18F chat room. We used Appear video chat capability.
Very little email was generated during this period and collaboration via chat and video was continual. Using our Agile workflow in JIRA, each task was reviewed by two or more parties - we used Crucible to perform version controlled, user-story based reviews. We used GitHub for version control.
Test Driven Development is a staple of our agile development approach. We used Mocha and Selenium to conduct unit tests and UI testing automatically at build. This helps ensure code quality and reduce cross browser inconstancies. We used a Kanban board to iterate through our stories and track the state of the prototype.
We also set work in progress (WIP) limits in each of our swim lanes on the Kanban board to keep our team lean and allow us to complete more work with less delay.

(Figure 6: Kanban Snapshot)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/jira_snap.png "JIRA Snapshot")

(Figure 7: HipChat Snapshot)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/HipChat_snap.png "HipChat Snapshot")

In our Kanban Snapshot, you can see we have a WIP limit alert in review. Using our lean process, we all focused on clearing out the review lane before proceeding to new work.
All work was tagged in our JIRA instance with components to help tell the story of how we iterated over the design and development process to flush out the prototype.

(Figure 8: Components Snapshot)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/component_snap.png "Components Snapshot")

We conducted a user demo mid-day Wednesday to test the application and gather one more round of feedback prior to the prototype delivery. The accelerated project timeline posed some challenges that we addressed using an Agile software development approach and staying lean across the team.

(Figure 9: Mid Release Demo 1)

![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/MidRelease1_Snap.jpg "Mid Release Demo 1")

<div style="float:left">
(Figure 10: A Day of Design, Development and collaboration!)

<<<<<<< HEAD
<a href="http://www.youtube.com/watch?feature=player_embedded&v=DCriHbQ_XuI
" target="_blank"><img src="http://img.youtube.com/vi/DCriHbQ_XuI/0.jpg"
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a>
</div>

<div style="float:right">
(Figure 11: Pair Programing)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=fxIfn7O_GT0
" target="_blank"><img src="http://img.youtube.com/vi/fxIfn7O_GT0/0.jpg"
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a>
</div>
=======
<a href="http://www.youtube.com/watch?feature=player_embedded&v=-aAyHSWz8lQ
" target="_blank"><img src="http://img.youtube.com/vi/-aAyHSWz8lQ/0.jpg"
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a>

### Included Libraries / Projects
Client Side
[angular](http://angularjs.org/) - [MIT](http://opensource.org/licenses/MIT)
[angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive) - [MIT](http://opensource.org/licenses/MIT)
[angular-route](https://github.com/angular/angular.js) - [MIT](http://opensource.org/licenses/MIT)
[angular-ui-router](https://github.com/angular-ui/ui-router) - [MIT](http://opensource.org/licenses/MIT)
[body-parser](https://github.com/expressjs/body-parser) - [MIT](http://opensource.org/licenses/MIT)
[bootstrap](https://github.com/twbs/bootstrap) - [MIT](http://opensource.org/licenses/MIT)
[c3](https://github.com/masayuki0812/c3) - [MIT](http://opensource.org/licenses/MIT)
[cookie-parser](https://github.com/expressjs/cookie-parser) - [MIT](http://opensource.org/licenses/MIT)
[d3](https://github.com/mbostock/d3) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
[debug](https://github.com/visionmedia/debug) - [MIT](http://opensource.org/licenses/MIT)
[express](https://github.com/strongloop/express) - [MIT](http://opensource.org/licenses/MIT)
[hbs](https://github.com/donpark/hbs) - [MIT](http://opensource.org/licenses/MIT)
[jade](https://github.com/jadejs/jade) - [MIT](http://opensource.org/licenses/MIT)
[jquery](https://github.com/jquery/jquery) - [MIT](http://opensource.org/licenses/MIT)
[jquery-ui](https://github.com/jquery/jquery-ui) - [MIT](http://opensource.org/licenses/MIT)
[leaflet](https://github.com/Leaflet/Leaflet) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
[leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
[moment](https://github.com/moment/moment) - [MIT](http://opensource.org/licenses/MIT)
[morgan](https://github.com/expressjs/morgan) - [MIT](http://opensource.org/licenses/MIT)
[requirejs](https://github.com/jrburke/r.js) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
[serve-favicon](https://github.com/expressjs/serve-favicon) - [MIT](http://opensource.org/licenses/MIT)

Server Side API
[async](https://github.com/nodejitsu/forever) - ?
[express](https://github.com/strongloop/express) - [MIT](http://opensource.org/licenses/MIT)
[request](https://github.com/request/request) - [Apache-2.0](http://opensource.org/licenses/Apache-2.0)
[swagger-express-mw](https://github.com/apigee-127/swagger-express) - [MIT](http://opensource.org/licenses/MIT)
>>>>>>> 79df9e82a81252f5eb50e79e27b26ae959630638
