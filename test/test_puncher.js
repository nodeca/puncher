/*global describe, it, before, after, beforeEach, afterEach*/


'use strict';


// stdlib
var path    = require('path');
var format  = require('util').format;
var assert  = require('assert');


// internal
var Puncher = require('..');


////////////////////////////////////////////////////////////////////////////////


describe('Puncher', function () {
  var puncher;


  beforeEach(function () {
    puncher = new Puncher();
  });


  it("should correctly calculate start/stops", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      result = puncher.stop().result;

      var foo = result[0];

      assert.ok(105 > foo.elapsed.total && foo.elapsed.total >= 100,
        format('Expect total elapsed time %d to be about 100ms',
          foo.elapsed.total));

      assert.ok(Math.abs(foo.elapsed.total - (foo.stop - foo.start)) < 1,
        format('Expect start/stop difference %d to be about total elapsed time %d',
          foo.stop - foo.start, foo.elapsed.total));

      done();
    }, 100);
  });


  it("should properly calculate start/stops of nested scopes", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result;

        var foo = result[0], bar = foo.childs[0];

        assert.ok(205 > foo.elapsed.total && foo.elapsed.total >= 200,
          format('Expect overall time %d to be about 100ms',
            foo.elapsed.total));

        assert.ok(105 > bar.elapsed.total && bar.elapsed.total >= 100,
          format('Expect overall time of nested scope %d to be about 100ms',
            foo.elapsed.total));

        done();
      }, 100);
    }, 100);
  });


  it("should calculate missed coverage", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result;

        var foo = result[0], bar = foo.childs[0];

        assert.ok(105 > foo.elapsed.missed && foo.elapsed.missed >= 100,
          format('Expect missed coverage %d to be about 100ms',
            foo.elapsed.missed));

        assert.equal(0, bar.elapsed.missed,
          format('Expect missed coverage %d of scope without childs to be 0ms',
            bar.elapsed.missed));

        done();
      }, 100);
    }, 100);
  });


  it("should tell if there are non-closed scopes", function () {
    puncher.start('Foo').start('Bar').stop();

    assert.ok(!puncher.stopped, 'Should be non-stopped');

    puncher.stop();

    assert.ok(puncher.stopped, 'Should be stopped');
  });


  it("should allow stop all non-closed scopes", function () {
    puncher.start('Foo').start('Bar').stop(true);
    assert.ok(puncher.stopped, 'Should be stopped');
  });


  it("should support set metadata on start", function () {
    puncher.start('Foo', {bar: 'baz'}).stop();
    assert.equal(puncher.result.shift().meta.bar, 'baz');
  });


  it("should support set metadata on stop", function () {
    puncher.start('Foo', {bar: 'baz'}).stop({moo: 'moo'});
    assert.equal(puncher.result.shift().meta.bar, 'baz');
    assert.equal(puncher.result.shift().meta.moo, 'moo');
  });

  it("should use process.hrtime() if available", function (done) {
    var result, hrtime = null, hrtime_calls = 0;

    // Setup process.hrtime() mock
    if (typeof process.hrtime === 'function') {
      hrtime = process.hrtime;

      process.hrtime = function () {
        hrtime_calls++;
        return hrtime.apply(null, arguments);
      };
    } else {
      process.hrtime = function () {
        hrtime_calls++;
        return 0; // we do not check result in this test
      };
    }

    puncher.start('Foo');
    setTimeout(function () {
      result = puncher.stop().result;

      var foo = result[0];

      assert.equal(hrtime_calls, 2);

      // Cleanup process.hrtime() mock
      if (typeof hrtime === 'function') {
        process.hrtime = hrtime;
      } else {
        process.hrtime = null;
      }

      done();
    }, 100);
  });

  it("should use Date.now() if process.hrtime() is not available", function (done) {
    var result, hrtime = null;

    // Delete process.hrtime()
    if (typeof process.hrtime === 'function') {
      hrtime = process.hrtime;

      process.hrtime = null;
    }

    puncher.start('Foo');
    setTimeout(function () {
      result = puncher.stop().result;

      var foo = result[0];

      assert.ok(105 > foo.elapsed.total && foo.elapsed.total >= 100,
        format('Expect total elapsed time %d to be about 100ms',
          foo.elapsed.total));

      assert.ok(Math.abs(foo.elapsed.total - (foo.stop - foo.start)) < 1,
        format('Expect start/stop difference %d to be about total elapsed time %d',
          foo.stop - foo.start, foo.elapsed.total));

      // Restore process.hrtime()
      if (typeof hrtime === 'function') {
        process.hrtime = hrtime;
      }

      done();
    }, 100);
  });

});
