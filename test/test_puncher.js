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
      result = puncher.stop().result();

      var foo = result[0];

      assert.ok(105 > foo.elapsed.total && foo.elapsed.total >= 100,
        format('Expect total elapsed time %d to be about 100ms',
          foo.elapsed.total));

      assert.equal(foo.elapsed.total, foo.stop - foo.start,
        format('Expect start/stop difference %d equal total elapsed time %d',
          foo.stop - foo.start, foo.elapsed.total));

      assert.equal(foo.elapsed.total, foo.offset.stop - foo.offset.start,
        format('Expect offset start/stop difference %d equal total elapsed time %d',
          foo.stop - foo.start, foo.elapsed.total));

      done();
    }, 100);
  });


  it("should properly calculate star/atops of nested scopes", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result();

        var foo = result[0], bar = foo.childs[0];

        assert.ok(205 > foo.elapsed.total && foo.elapsed.total >= 200,
          format('Expect overal time %d to be about 100ms',
            foo.elapsed.total));

        assert.ok(105 > bar.elapsed.total && bar.elapsed.total >= 100,
          format('Expect overal time of nested scope %d to be about 100ms',
            foo.elapsed.total));

        done();
      }, 100);
    }, 100);
  });


  it("should calculate time elapsed by scope child scopes and self", function (done) {
    var result;

    puncher.start('Foo');
    setTimeout(function () {
      puncher.start('Bar');
      setTimeout(function () {
        result = puncher.stop(true).result();

        var foo = result[0];

        assert.ok(105 > foo.elapsed.childs && foo.elapsed.childs >= 100,
          format('Expect time of nested scopes %d to be about 100ms',
            foo.elapsed.childs));

        assert.ok(105 > foo.elapsed.self && foo.elapsed.self >= 100,
          format('Expect time of the scopes itself %d to be about 100ms',
            foo.elapsed.self));

        done();
      }, 100);
    }, 100);
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
