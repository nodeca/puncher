Puncher
=======


Usage overview
--------------

``` javascript
var Puncher = require('puncher');


require('http').createServer(function (req, res) {
  var p = new Puncher('Profiling request lifecycle');

  // ... start nested request for resource

  p.start('Retreiving users');

  // ... close nested block

  p.stop();

  // ... log results

  console.log(p.toString());

}).listen(3000);
```


API Overview
------------

``` javascript
Puncher.prototype.start     = function (message, meta); // -> Puncher
Puncher.prototype.stop      = function (); // -> Puncher
Puncher.prototype.toString  = function ();
Puncher.prototype.toJSON    = function ();
```
