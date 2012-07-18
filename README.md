Puncher
=======


Usage overview
--------------

``` javascript
var Puncher = require('puncher');


require('http').createServer(function (req, res) {
  var p = new Puncher();

  // ... start nested request for resource

  p.start('Retreiving users');

  // ... close nested block

  p.stop();

  // ... log results

  console.log(require('util').inspect(p.result, false, 10, true));

}).listen(3000);
```
