'use strict';


// require Puncher library
var Puncher = require('..');


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
