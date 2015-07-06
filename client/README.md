# openFDAViz Client Side Web Interface

The openFDAViz client side web interface provides the interactive environment for utilizing the openFDAViz API server. The client can be started independently if needed, but is recommended to be run as part of the parent Grunt script since it is dependent on the server side API.

# Starting
```
$ grunt start:dev
```

This will start the server on http://localhost:8000/

# Running Test
```
$ grunt test
$ grunt selenium
```

Test are written using [Mocha](http://mochajs.org/) and [Protractor](http://angular.github.io/protractor/#/).
