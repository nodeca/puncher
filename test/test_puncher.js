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
      result = puncher.stop().result();

      var foo = result[0];

      assert.ok(205 > foo.elapsed && foo.elapsed >= 200,
                'Elapsed time is about 200ms');
      assert.ok(foo.elapsed === foo.stop - foo.start,
                'Elapsed time equals difference between start and stop');
      assert.ok(foo.elapsed === foo.offset.stop - foo.offset.start,
                'Elapsed time equals difference between offest start and stop');

      done();
    }, 200);
  });


  it("should properly calculate star/atops of nested scopes", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result();

        var foo = result[0], bar = foo.children[0];

        assert.ok(405 > foo.elapsed && foo.elapsed >= 400,
                  'Elapsed overal time is about 400ms');
        assert.ok(205 > bar.elapsed && bar.elapsed >= 200,
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
