import React, { Component } from 'react'

import Canvas from './Canvas'
import Sidebar from './Sidebar'

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
        <Sidebar />
        <Canvas />
      </div>
    )
  }
}

export default App

