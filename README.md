Puncher
=======

[![Build Status](https://secure.travis-ci.org/nodeca/puncher.png)](http://travis-ci.org/nodeca/puncher)

Utility library that helps to easily profile your application and find
bottlenecks.


Usage overview
--------------

``` javascript
// require Puncher library
var Puncher = require('puncher');


// start profiler
var p = new Puncher();


p.start('Do something useless');
setTimeout(function () {
  p.start('Do something more');

  setTimeout(function () {
    p.stop(true);

    console.log(require('util').inspect(p.result, false, 10, true));
  }, 200);
}, 100);
```

Example above will show you something like this:

``` javascript
[ { message: 'Do something useless',
    start: 1342643070592,
    stop: 1342643070898,
    elapsed: { total: 306, missed: 105 },
    meta: {},
    childs:
     [ { message: 'Do something more',
         start: 1342643070697,
         stop: 1342643070898,
         elapsed: { total: 201, missed: 0 },
         meta: {},
         childs: [] } ] } ]
```
