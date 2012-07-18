Puncher
=======

[![Build Status](https://secure.travis-ci.org/nodeca/puncher.png)](http://travis-ci.org/nodeca/puncher)

Utility library that helps to easily profile your application and find
bottlenecks.


Usage overview
--------------

``` javascript
var Puncher = require('puncher');


require('http').createServer(function (req, res) {
  var p = new Puncher();

  p.start('Get users');

  Users.findAll(function (err, users) {
    p.stop(); // Close `Get users` scope

    p.start('Iterate users');

    users.forEach(function (u) {
      p.start('Do something with user', {user: u});

      // ... do something

      p.stop();
    });

    p.stop(); // Close `Iterate users` scope

    console.log(require('util').inspect(p.result, false, 10, true));
  });
}).listen(3000);
```
