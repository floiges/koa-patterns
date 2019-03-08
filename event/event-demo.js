/** 
 * Node events 
*/

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
    console.log(a, b, this, this === myEmitter);
});
myEmitter.on('event', (a, b) => {
    // 注意使用箭头函数时 this 的指向
    console.log(a, b, this, this === myEmitter);
});
myEmitter.emit('event', 'a', 'b');

// handling event only once
let m = 0;
myEmitter.once('once', function() {
    console.log(++m);
});
myEmitter.emit('once');
myEmitter.emit('once');

// When an error occurs within an EventEmitter instance, 
// the typical action is for an 'error' event to be emitted
// myEmitter.on('error', function(err) {
//     console.log(err);
// });
// myEmitter.emit('error', new Error('whoops!'));

// newListener event
myEmitter.once('newListener', (event, listener) => {
    if (event === 'haha') {
        // insert a new listener in front
        myEmitter.on('haha', () => {
            console.log('B');
        });
    }
});
myEmitter.on('haha', () => {
    console.log('A');
});
myEmitter.emit('haha');

console.log(EventEmitter.listenerCount(myEmitter, 'haha'));
console.log(myEmitter.getMaxListeners());
console.log(myEmitter.eventNames());
console.log(myEmitter.listeners('haha'));

myEmitter.once('log', () => { console.log('log once') });