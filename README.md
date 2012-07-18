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

  console.log(JSON.stringify(p.result()));

}).listen(3000);
```
