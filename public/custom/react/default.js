var Hello = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Welcome to React</h1>
        <div>Hello {this.props.name}</div>
      </div>
    );
  }
});

ReactDOM.render(
  <Hello name="World" />,
  document.getElementById('container')
);
