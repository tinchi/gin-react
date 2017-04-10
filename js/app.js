import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  render() {
    console.log("App render()")
    return <div > Hello {
      this.props.name
    } < /div>;
  }
}

ReactDOM.render( < App name = "Gin 11" / > , document.getElementById('app'));