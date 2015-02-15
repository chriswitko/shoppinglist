var EventEmitter = require('events').EventEmitter;
var globalEmitter = module.exports = new EventEmitter();

var mixinFor = function (eventName, events) {
    events = events || globalEmitter;

    var pascal = eventName[0].toUpperCase() + eventName.slice(1);

    var noop = function(){};

    var mixin = {
        componentDidUpdate: function() {
          console.log('componentDidUpdate');
        },
        componentDidMount: function() {
          console.log('componentDidMount');
        },
        componentWillMount: function(){
          // if(!this.isMounted) return;
            if (!this["on" + pascal]) {
                return;
            }

            console.log('event', events);
            console.log('pascal', pascal);

            events.on(event, this["on" + pascal]);
        },
        componentWillUnmount: function(){
          // if(!this.isMounted) return;
            if (!this["on" + pascal]) {
                return;
            }

            events.removeListener(event, this["on" + pascal]);
            // events.off(event, this["on" + pascal]);
        }
    };

    // add emit method
    mixin["emit" + pascal] = events.emit.bind(events, event);

    return mixin;
};

module.exports = mixinFor;
