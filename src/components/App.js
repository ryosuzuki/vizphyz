import React, { Component } from 'react'

import Sidebar from './Sidebar'
import Canvas from './Canvas'
import Path from './Path'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    window.app = this
  }

  componentDidMount() {
    this.canvas = new Canvas('#workspace')
  }

  render() {
    return (
      <div>
        {/*
        <Sidebar />
        */}
        <div id="workspace"></div>
      </div>
    )
  }
}

export default App

