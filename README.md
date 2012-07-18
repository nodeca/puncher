Puncher
=======


Usage overview
--------------

``` javascript
var Puncher = require('puncher');


require('http').createServer(function (req, res) {
  var p = new Puncher('Profiling request lifecycle');

  // ... some preparation code ...

  p.mark('Some middlepoint');

  // ... start nested request for resource

  p.push('Retreiving users');

  // ... close nested block

  p.pop();

  // ... log results

  console.log(p.toString());

}).listen(3000);
```
