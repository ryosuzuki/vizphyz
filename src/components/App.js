import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="ui column centered grid">
          <div className="nine wide column">
            <h1 id="top" className="ui center aligned huge header">
              Exploring the Design Space of Automated Hints
            </h1>
          </div>
        </div>
      </div>
    )
  }
}

export default App

