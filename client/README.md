# openFDAViz Client Side Web Interface

The openFDAViz client side web interface provides the interactive environment for utilizing the openFDAViz API server. The client can be started independently if needed, but is recommended to be run as part of the parent Grunt script since it is dependent on the server side API.

Modern javascript client libraries used include [Bootstrap](http://getbootstrap.com/), [Angular](https://angularjs.org/), [jQuery](https://jquery.com/), [Leaflet](http://leafletjs.com/), [d3](http://d3js.org/), and [c3](http://c3js.org/).

# Starting
```
$ grunt start:dev
```

This will start the server on http://localhost:8000/

# Running Test

Test are written using [Protractor](http://angular.github.io/protractor/#/).

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
