var EventEmitter = require('events').EventEmitter;
var globalEmitter = module.exports = new EventEmitter();

var mixinFor = function (eventName, events) {
    events = events || globalEmitter;

    var pascal = eventName[0].toUpperCase() + eventName.slice(1);

    var noop = function(){};

    var mixin = {
        componentWillMount: function(){
            if (!this["on" + pascal]) {
                return;
            }

            events.on(event, this["on" + pascal]);
        },
        componentWillUnmount: function(){
            if (!this["on" + pascal]) {
                return;
            }

            events.removeListener(event, this["on" + pascal]);
        }
    };

    // add emit method
    mixin["emit" + pascal] = events.emit.bind(events, event);

    return mixin;
};

module.exports = mixinFor;
