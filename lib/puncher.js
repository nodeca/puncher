/**
 *  class Puncher
 *
 *  Provides easy way to profile complex workflows.
 **/


'use strict';


/**
 *  new Puncher()
 *
 *  Creates new instance of the Puncher
 **/
var Puncher = module.exports = function Puncher() {
  this.__started__  = Date.now();
  this.__waiters__  = [];
  this.__result__   = [];
};


/**
 *  Puncher#start(message[, meta = {}]) -> Puncher
 *  - message (String): Scope description
 *  - meta (Object): Additional information. You can put any info here.
 *
 *  Starts new scope of timestamps.
 *
 *
 *  ##### Example
 *
 *      puncher.start('Iterate values', {count: arr.length});
 *      arr.forEach(function (el) {
 *        puncher.start('Store element in database', {el: el});
 *        db.save(el, function (err) {
 *          puncher.stop();
 *
 *          // ...
 *        });
 *      });
 *      puncher.stop();
 **/
Puncher.prototype.start = function start(message, meta) {
  var scope = {};

  scope.message = message;
  scope.start   = Date.now();
  scope.stop    = null;
  scope.elapsed = {total: null, missed: null};
  scope.meta    = meta || {};
  scope.offset  = {start: this.__started__ - scope.start, stop: null};
  scope.childs  = [];

  if (this.__waiters__.length) {
    this.__waiters__[this.__waiters__.length - 1].childs.push(scope);
  } else {
    this.__result__.push(scope);
  }

  this.__waiters__.push(scope);

  return this;
};


function get_elapsed_by_childs(scope) {
  var elapsed = 0, i, l;

  for (i = 0, l = scope.childs.length; i < l; i++) {
    elapsed += scope.childs[i].elapsed.total;
  }

  return elapsed;
}


/**
 *  Puncher#stop([all = false]) -> Puncher
 *
 *  Closes previously started scope.
 *
 *
 *  ##### See Also:
 *
 *  - [[Puncher#start]]
 **/
Puncher.prototype.stop = function stop(all) {
  var scope = this.__waiters__.pop();

  if (scope) {
    scope.stop            = Date.now();
    scope.elapsed.total   = scope.stop - scope.start;
    scope.elapsed.missed  = scope.elapsed.total - get_elapsed_by_childs(scope);
    scope.offset.stop     = scope.offset.start + scope.elapsed.total;
  }

  if (all) {
    while(!this.stopped()) {
      this.stop();
    }
  }

  return this;
};


/**
 *  Puncher#stopped() -> Boolean
 *
 *  Tells if all started scopes were stopped.
 **/
Puncher.prototype.stopped = function stopped() {
  return 0 === this.__waiters__.length;
};


/**
 *  Puncher#result() -> Array
 *
 *  Returns profiling result, with following structure:
 *
 *      [
 *        {
 *          message:  'Iterate values',
 *          meta:     {count: 2},
 *          start:    1342604275397,
 *          stop:     1342604276397,
 *          offset:   {start: 5, stop: 1005},
 *          childs: [
 *            {
 *              message:  'Store element in database',
 *              meta:     {el: 'Foo'},
 *              start:    1342604275497,
 *              // ...
 *            },
 *            // ...
 *          ]
 *        }
 *      ]
 **/
Puncher.prototype.result = function result() {
  return this.__result__.slice();
};
