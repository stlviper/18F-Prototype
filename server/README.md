# openFDAViz Server Side API

The openFDAViz Server Side API is responsible for querying the openFDA API data set, merging the dataset and geocoding the results for display. The server can be ran independently if needed or as part of the parent Grunt script. The Server Side API is implemented using [Swagger](http://swagger.io/). Swagger creates user docs automatically and can be accessed once the server api is running at (http://localhost:8000/docs).

# Starting
```sh
$ grunt start
```

This will start the server on http://localhost:8000/

# Running Test
```
$ grunt test
```

Test are written using [Mocha](http://mochajs.org/) 