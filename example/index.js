'use strict';


// require Puncher library
var Puncher = require('..');


// start profiler
var p = new Puncher();


p.start('Total');
setTimeout(function () {

  p.start('Block 1');
  setTimeout(function () {
    p.stop(); // Stop Block 1

    p.start('Block 2');
    setTimeout(function () {
      p.stop(); // Stop Block 2

      p.stop(); // Stop Total
      console.log(require('util').inspect(p.result, false, 10, true));
    }, 300);
  }, 200);
}, 100);
