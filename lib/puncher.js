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
 *  ``` javascript
 *  puncher.start('Iterate values', {count: arr.length});
 *  arr.forEach(function (el) {
 *    puncher.start('Store element in database', {el: el});
 *    db.save(el, function (err) {
 *      puncher.stop();
 *
 *      // ...
 *    });
 *  });
 *  puncher.stop();
 *  ```
 **/
Puncher.prototype.start = function start(message, meta) {
  var scope = {};

  scope.message = message;
  scope.start   = process.hrtime();
  scope.stop    = null;
  scope.elapsed = {total: null, missed: null};
  scope.meta    = meta || {};
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
  return scope.childs.reduce(function (memo, scope) {
    return [memo[0] + scope.elapsed.total[0], memo[1] + scope.elapsed.total[1]];
  }, [0,0]);
}



function merge_meta(dst, src) {
  if ('[object Object]' === Object.prototype.toString.call(src)) {
    Object.getOwnPropertyNames(src).forEach(function (k) {
      dst[k] = src[k];
    });
  }

  return dst;
}


/**
 *  Puncher#stop([all = false][, meta = {}]) -> Puncher
 *  - all (Boolean): Stop all started scopes if `true`.
 *  - meta (Object): Add more additional information.
 *
 *  Closes previously started scope.
 *
 *
 *  ##### See Also:
 *
 *  - [[Puncher#start]]
 **/
Puncher.prototype.stop = function stop(all, meta) {
  var scope = this.__waiters__.pop();
  var child_elapsed;

  if ('boolean' !== typeof all) {
    meta = all;
    all  = false;
  }

  if (scope) {
    scope.stop            = process.hrtime();
    scope.elapsed.total   = process.hrtime(scope.start);
    if(scope.childs.length) {
        child_elapsed          = get_elapsed_by_childs(scope);
        if( scope.elapsed.total[1] < child_elapsed[1]) {
            scope.elapsed.missed  = [scope.elapsed.total[0] - child_elapsed[0] - 1, 1000000000 - Math.abs(scope.elapsed.total[1] - child_elapsed[1])];
        } else {
            scope.elapsed.missed  = [scope.elapsed.total[0] - child_elapsed[0], scope.elapsed.total[1] - child_elapsed[1]];
        }
    } else {
        scope.elapsed.missed = [0,0];
    }
    scope.meta            = merge_meta(scope.meta, meta);
  }

  if (all) {
    while(!this.stopped) {
      this.stop();
    }
  }

  return this;
};


/**
 *  Puncher#stopped -> Boolean
 *
 *  Tells if all started scopes were stopped.
 **/
Object.defineProperty(Puncher.prototype, 'stopped', {
  get: function is_stopped() {
    return 0 === this.__waiters__.length;
  }
});


/**
 *  Puncher#result -> Array
 *
 *  Returns profiling result, with following structure:
 *
 *  ``` javascript
 *  [
 *    {
 *      "message":  "Foo",
 *      "start":    1342641419901,
 *      "stop":     1342641420102,
 *      "elapsed":  {"total": 201, "missed": 100},
 *      "meta":     {},
 *      "childs":   [
 *        {
 *          "message":  "Bar",
 *          "start":    1342641420001,
 *          // ...
 *        },
 *        // ...
 *      ]
 *    },
 *    // ...
 *  ]
 *  ```
 **/
Object.defineProperty(Puncher.prototype, 'result', {
  get: function get_result() {
    return this.__result__.slice();
  }
});
