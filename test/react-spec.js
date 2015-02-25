/** @jsx React.DOM */
window.React = require('react');

window.HelloWorld = React.createClass({
  getInitialState: function(){
    return { number: this.randomNumber() };
  },
  randomNumber: function(){
    return Math.random();
  },
  render: function() {
    return (<div>Hello {this.state.number}</div>);
  }
});

describe("HelloWorld", function(){
  it("can spy on a function for a React class", function(){
    jasmineReact.spyOnClass(HelloWorld, "randomNumber").andReturn(42);

    // jasmineReact wraps React.render, so you don't have to worry
    //  about the async nature of when the actual DOM get's rendered, or selecting
    //  where your component needs to get rendered (default is #jasmine_content)
    var myWorld = jasmineReact.render(<HelloWorld />);

    expect(myWorld.state.number).toBe(42);
  });

  it("can assert that a spy has been called", function(){
    jasmineReact.spyOnClass(HelloWorld, "randomNumber");

    jasmineReact.render(<HelloWorld />;

    // because we spy on the class and not the instance, we have to assert that the
    //   function on the class' prototype was called.
    expect(jasmineReact.classPrototype(HelloWorld).randomNumber).toHaveBeenCalled();
  });
});