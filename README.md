openFDAViz URL: http://openfdaviz.cloudogsystems.com/

# openFDAViz

* [Brief Description](#description)
* [Digital Service Playbook evidence](https://github.com/stlviper/18F-Prototype/tree/master/assets/DigitalServicesPlaybook.pdf)
* [Attachment E Approach Criteria](https://github.com/stlviper/18F-Prototype/tree/master/assets/AttachmentEApproachCriteriaEvidenceMod5.xlsx)

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

```
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

### Local Development using openFDA Fake Server

```
$ cd fake-api
$ npm install
$ cd ..
$ PORT=3001 node fake-api/bin/www
```
Above will run a fake openFDA server for testing. You can view it at 
    http://localhost:3001/healthcheck/
    
### Deploying in Docker

You will need to have [Docker](https://www.docker.com/) already installed and setup. Installing and configuring Docker for your OS instructions can be found here [Docker Docs](http://docs.docker.com/).

Once you have a working docker environment you can run a docker image using the following command,

```
$ docker run -t -i -p 3002:3002 -p 8000:8000 stlviper/18f-prototype
```

If you are on a OSX you will need to tunnel ports 3002 and 8000 so the client can access the server using localhost, this can be done by issuing the following commands,
```
$ VBoxManage controlvm boot2docker-vm natpf1 "swagger,tcp,127.0.0.1,3002,,3002"
$ VBoxManage controlvm boot2docker-vm natpf1 "client,tcp,127.0.0.1,8000,,8000"
```

To Remove the tunnels when you are done you can issue these commands,
```
$ VBoxManage modifyvm boot2docker-vm --natpf1 delete swagger
$ VBoxManage modifyvm boot2docker-vm --natpf1 delete client
```

Once the Docker image is running you can access it at:

http://localhost:8000/

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

(#description)
## *** Team OGSystems Agile Approach Description *** 
 
OGSystems’ agile engineering method employs user-centric design elements, such as rapid prototyping and deployment of capabilities, to iterate on and refine solutions. Our unique blend of agile, scaled agile and visually-based facilitation methods allows us to quickly respond to challenges scaling from Team to Enterprise. 
Team OGSystems created the FDA Prototype following our normal agile software development approach. Our staff of experienced and certified agile practitioners responded to and built the prototype by adding the RFQ response as a high priority project to our normal backlog. 
The Product Manager (PM), Chad Dalton was responsible for setting priorities and grooming our backlog in JIRA and for accepting user-stories and prototype quality (Criteria A). 
Drawing from OGSystems’ Viper Lab and Visioneering practices, we established a [multidisciplinary and collaborative team](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/teamRoles.png) utilizing seven identified labor categories from design Pool One and development Pool Two (Criteria B). 

The team used Kanban and established a cadence for an iteration demo, a release demo, and two daily standups, along with continual in-person and online collaboration to meet the delivery deadline and followed the process described in Figure 1 (Criteria G). 
 
(Figure 1: Agile Approach Roadmap) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/openFDAViz-AI-09.png "Agile Approach Roadmap") 
 
Following the kick-off meeting, we conducted a [Frame the Challenge mindmapping](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/68-EF-Framing the Challengev02.docx) exercise to establish a vision and strategy for the project. The PM and team used the MindMap to create the initial backlog and priorities, and provided a baseline to brainstorm data options and prototype design, Figure 2. 
 
(Figure 2: MindMap) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-Mindmap001.jpg "Mind Map") 
 
Our team self-identified in roles that matched their experience and expertise, scheduled customer engagement sessions and started design development, [building wireframes](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UI-MockUp003.jpg), designing architecture and creating a [design style guide](26-EF-52DesignStyleGuide-1506.pdf)(Criteria E). 
We engaged end customers in a collaborative session to brainstorm needs and solicit feedback on initial design concepts, Figure 3, yielding additional design and development concepts and stories, Figure 3.1 and Figure 3.2 (Criteria C). 
 
(Figure 3: Customer Engagement) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UserEngagementSession001.jpg "Customer Engagement") 
 
(Figure 3.1: Customer Engagement Session) 
 
<a href="http://www.youtube.com/watch?feature=player_embedded&v=myWMVXG98so" target="_blank"><img src="http://img.youtube.com/vi/myWMVXG98so/0.jpg" 
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a> 
 
(Figure 3.2: Customer Suggestions) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UIMockUp004.jpg "Customer Suggestions") 
 
[Human-centered design](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/61-EF-HCDElements-AI-001.pdf) is always at the forefront of our process. We leveraged the following human-centered-design methods (Criteria D): 
 
1. [Frame the Challenge](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/68-EF-Framing the Challengev02.docx) and Mindmapping    
   * We 'framed the challenge' to create a common understanding of objectives by conducting a brainstorming session and discussion, and mindmapping the discussion to capture and highlight salient and related ideas.   
2. [User Interviews](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UserEngagementSession001.jpg)
   * We created an Interview Guide and conducted a user interview session with our Mock Users. The Interview Guide employed open-ended questions to provide a safe forum for users to provide insights, opinions, and perspectives on a range of topics affecting this project, such as the need for food/device/drug information, their occupation, and their interaction with online search tools. 
3. [Identify User Communities and Create User Personas](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-PersonaDevelopmentMindmap003.jpg)
   * Based on the Frame the Challenge results, we identified user communities by brainstorming potential audiences for this tool and documented the conversation in a mindmap. 
   * Using the user community brainstorming mindmap, we developed User Personas to drive our human-centered design focus, developing four User Personas.   
4. [Create Persona Workflows](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/28-EF-48PersonaWorkflows-1506.jpg)
   * Using our User Personas we developed four user-based workflows. We created a scenario for each user and identified the users' activities to achieve their needs. We documented these workflows in an easy-to-follow diagram, which then drove and validated the prioritization of our team’s design and UI work. The workflow activity furthered our empathy for the user. 
5. Rapid Prototyping 
   * [Paper Prototypes](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/20150619001-InitialUIDesignNotes.jpg)
     * We further leveraged human-centered design techniques by sketching out paper prototype user interfaces prior to writing any code. Creating paper prototypes saves time, money, and fosters an environment where all participants (team members and users alike) feel welcome to participate in, revise, and comment on prototype design. 
   * [Mock-ups](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-UI-MockUp003.jpg) (Criteria F)
     * We transferred our Paper Prototypes into digital code to resemble the look and feel of a working product. While Paper Prototypes foster an atmosphere for creating ideas, mock-ups are effective at representing design decisions and the potential for functional limitations. When a customer experiences these decisions and limitations, it creates a more meaningful feedback session. 
    * [Feedback Cycles](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/openFDAViz-AI-10-PNG.png) (Criteria F)
      * The secret to Rapid Prototyping is increasing the number and frequency of feedback cycles. By rapidly creating paper prototypes and digital mock-ups, we were able to increase the number of user reviews, inter-team reviews, and leadership reviews. We also employed the Deep Dive method for facilitating these feedback sessions – the presentation of functionality is very short; the feedback providers may then comment on anything they wish; the feedback receivers take notes and do not defend the prototype. All feedback is sacred and evaluated from multiple angles.  
 
As described, we conducted a Persona Development brainstorming session, Figure 4, and developed User Personas, Figure 5, to aid in the design and prioritization process. 
 
(Figure 4: Persona Brainstorming) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/18F-PersonaDevelopmentMindmap003.jpg "Persona MindMap") 
 
(Figure 5: Persona Development) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/27-EF-46UserPersonas-1506.jpg "Persona Development") 
 
We swarmed on the architectural runway and build out the initial architecture as our first configuration design priority. Nolan Hager led the devops decisions to get us running in [AWS using Elastic Beanstalk](https://github.com/stlviper/18F-Prototype/blob/master/assets/deployment/AWSElasticBeanstalkMultiAvabilityZones.png) (Criteria J) with a scalable web application that interfaces with the FDA api, Figure 6. We used [CloudWatch](https://github.com/stlviper/18F-Prototype/blob/master/assets/deployment/Cloudwatch.png) to provide continous monitoring (Criteria N).
This architecture supports scaling and load balancing based on server capacity and configuration.  We used the following five modern and open-source technologies (Criteria I/Q): 
 
   * Leaflet.js to add a geospatial map based component to our UI. It also plugged into angular very well.  
   * Bootstrap to maintain and provide the responsiveness of our web application on multiple [devices](https://github.com/stlviper/18F-Prototype/blob/master/assets/design/iphone.png) (Criteria H).  
   * Angular.js as the front-end application which allowed us to bind data from Swagger to the application. 
   * Swagger API (http://openfdavizapi.cloudogsystems.com/docs/) to remix the FDA data by adding geo location and allows other interfaces to use and display the data in new ways.  
   * Node.js to interact with the data on the server side increasing the efficiency of remixing the data provided by the FDA API and to implement the Swagger API.  
   * [Wapiti](https://github.com/stlviper/18F-Prototype/blob/master/assets/deployment/wapiti.png) to run real time security scans looking for vulnerabilities in the application and generating reports on each build. 
   * [Docker](https://registry.hub.docker.com/u/stlviper/18f-prototype/) to provide System level virtualization (Criteria O).
 
(Figure 6: openFDAViz Architecture) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/18fAWSArchitecture.png "openFDAViz Architecture") 
 
We used several applications to facilitate collaboration among remotely-based teams (Saint Louis, MO; Chantilly, VA), including HipChat for day-to-day interactions, Figure 7.  HipChat was integrated with JIRA and Confluence to receive notifications in our 18F chat room and with Appear video chat capability. JIRA (Requirements), Confluence (Documentation), [GitHub](https://github.com/stlviper/18F-Prototype/blob/master/README.md)(Criteria P) (Source Control) were our primary configuration managment tools (Criteria M).
Collaboration via chat and video was continuous. Our Agile workflow was tracked in JIRA with two or more parties reviewing each task, leveraging Crucible for version-controlled, user-story based reviews and GitHub for version control and [Bamboo](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/BambooRunningTest.png) for continous integration and deployment to Beanstalk (Criteria L). 
[Mocha](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/GruntMochaTest.png) and [Selenium](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/GruntSeleniumTest.png), used for automatic unit tests and automatic UI testing, were integral to our Test Driven Development Approach, ensuring code quality and reducing cross-browser inconstancies (Criteria K). We used a Kanban board to iterate through stories and track the state of the prototype. Setting work in progress (WIP) limits in each swim lane on the Kanban board kept our team lean and allowed us to complete more work with less delay, Figure 8. 
 
(Figure 7: HipChat Snapshot) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/HipChat_snap.png "HipChat Snapshot") 
 
(Figure 8: Kanban Snapshot) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/jira_snap.png "JIRA Snapshot") 
 
The Kanban Snapshot shows a WIP limit alert in Review (Lane 3 of Figure 7). Following our lean process, we focused on clearing out the Review lane before proceeding to new work. 
 
All work was tagged in JIRA, using components to help manage our iterations over the design and development process to flush out the prototype, Figure 9. 
 
(Figure 9: Components Snapshot) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/component_snap.png "Components Snapshot") 
 
We conducted a user demo mid-day Wednesday to test the application and gather feedback prior to the initial prototype delivery. We addressed project timeline challenges using an agile software development approach and staying lean across the team, Figure 10. 
 
(Figure 10: Mid Release Demo 1) 
 
![alt text](https://github.com/stlviper/18F-Prototype/blob/master/assets/process/MidRelease1_Snap.jpg "Mid Release Demo 1") 
 
(Figure 11: A Day of Design, Development and collaboration!) 
 
<a href="http://www.youtube.com/watch?feature=player_embedded&v=-aAyHSWz8lQ 
" target="_blank"><img src="http://img.youtube.com/vi/-aAyHSWz8lQ/0.jpg" 
alt="A Day of Design, Development and collaboration!" width="240" height="180" border="10" /></a> 
 
Team OGSystems using already established agile engineering methods was ready to deliver at the first release boundary presented by the ADS I RFQ. When the boundary was extended, we tagged release version 1.0.0 of the application in our GITHub repo and prepped our backlog with the next PO set of prioritized items.  
 
(Figure 12: Version 1.0.0 Release) 
 
https://github.com/stlviper/18F-Prototype/releases/tag/v1.0.0 [https://github.com/stlviper/18F-Prototype/releases/tag/v1.0.0] 
 
This allowed the team to enhance the overall user experience by conducting more user engagement sessions to gather feedback and add more features. One user suggested feature, ‘suggest ahead’ typing was added to the backlog. The team backlogged this request and added the desired functionality to the application. 
 
(Figure 13: Image of Feature Suggest Ahead) 
 
![alt text]( https://github.com/stlviper/18F-Prototype/blob/master/assets/process/suggestAheadFeature.png "Suggest Ahead") 
 
Team OGSystems’ agile approach positioned our multidisciplinary team to adjust to the changing timeline and incorporate additional user testing and feedback sessions, resulting in more user-requested features.  
 
We continued to use the extended timeframe to provide a ‘release on demand’ cadence and support the final delivery date with a full-featured mature web application. We conducted two retrospectives, increasing the team’s Kaizen finishing with an overall retrospective to improve our internal agile engineering practices. 
 
### Included Libraries / Projects
Client Side

 - [angular](http://angularjs.org/) - [MIT](http://opensource.org/licenses/MIT)
 - [angular-bootstrap](https://angular-ui.github.io/bootstrap/) - [MIT](http://opensource.org/licenses/MIT)
 - [angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive) - [MIT](http://opensource.org/licenses/MIT)
 - [angular-route](https://github.com/angular/angular.js) - [MIT](http://opensource.org/licenses/MIT)
 - [angular-ui-router](https://github.com/angular-ui/ui-router) - [MIT](http://opensource.org/licenses/MIT)
 - [bootstrap](https://github.com/twbs/bootstrap) - [MIT](http://opensource.org/licenses/MIT)
 - [c3](https://github.com/masayuki0812/c3) - [MIT](http://opensource.org/licenses/MIT)
 - [d3](https://github.com/mbostock/d3) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
 - [jquery](https://github.com/jquery/jquery) - [MIT](http://opensource.org/licenses/MIT)
 - [leaflet](https://github.com/Leaflet/Leaflet) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
 - [leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
 - [moment](https://github.com/moment/moment) - [MIT](http://opensource.org/licenses/MIT)
 - [serve-favicon](https://github.com/expressjs/serve-favicon) - [MIT](http://opensource.org/licenses/MIT)

Server Side API

 - [async](https://github.com/nodejitsu/forever) - [BSD](http://opensource.org/licenses/BSD-2-Clause)
 - [express](http://expressjs.com/) - [MIT](http://opensource.org/licenses/MIT)
 - [node-geocoder](https://github.com/nchaulet/node-geocoder) - [MIT](http://opensource.org/licenses/MIT)
 - [request](https://github.com/request/request) - [Apache-2.0](http://opensource.org/licenses/Apache-2.0)
 - [swagger-express-mw](https://github.com/apigee-127/swagger-express) - [MIT](http://opensource.org/licenses/MIT)