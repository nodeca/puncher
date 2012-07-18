/*global describe, it, before, after, beforeEach, afterEach*/


'use strict';


// stdlib
var path    = require('path');
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

      var foo = result[0], ms = foo.stop - foo.start;

      assert.ok(205 > ms && ms >= 200, 'Elapsed time is about 200ms');
      assert.ok(ms === foo.offset.stop - foo.offset.start,
                'Elapsed time is the same for offsets');

      done();
    }, 200);
  });


  it("should properly calculate star/atops of nested scopes", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result;

        var foo = result[0], bar = foo.children[0],
            foo_ms = foo.stop - foo.start,
            bar_ms = bar.stop - bar.start;

        assert.ok(405 > foo_ms && foo_ms >= 400,
                  'Elapsed overal time is about 400ms');
        assert.ok(205 > bar_ms && bar_ms >= 200,
                  'Elapsed time of nested scope is about 200ms');

        done();
      }, 200);
    }, 200);
  });


  it("should tell if there are non-closed scopes", function () {
    puncher.start('Foo').start('Bar').stop();

    assert.ok(!puncher.stopped(), 'Should be non-stopped');

    puncher.stop();

    assert.ok(puncher.stopped(), 'Should be stopped');
  });


  it("should allow stop all non-closed scopes", function () {
    puncher.start('Foo').start('Bar').stop(true);
    assert.ok(puncher.stopped(), 'Should be stopped');
  });
});
