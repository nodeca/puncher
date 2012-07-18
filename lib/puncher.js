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
  this.started = Date.now();
};


/**
 *  Puncher#start(message[, meta]) -> Puncher
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
  return this;
};


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
  return this;
};


/**
 *  Puncher#stopped() -> Boolean
 *
 *  Tells if all started scopes were stopped.
 **/
Puncher.prototype.stopped = function stopped() {
  return true;
};


/**
 *  Puncher#result() -> Array
 *
 *  Returns profiling result.
 *
 *
 *  ##### Example
 *
 *      puncher.result();
 *
 *  Returns `Array` with following structure:
 *
 *      [
 *        {
 *          message:  'Iterate values',
 *          meta:     {count: 2},
 *          start:    1342604275397,
 *          stop:     1342604276397,
 *          offset:   {start: 5, stop: 1005},
 *          children: [
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
  return [];
};
