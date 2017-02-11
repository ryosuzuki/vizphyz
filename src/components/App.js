import React, { Component } from 'react'

import Sidebar from './Sidebar'
import Background from './Background'
import Canvas from './Canvas'
import Path from './Path'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    window.app = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300
    this.height = window.innerHeight

    this.root = Snap(this.width, this.height).remove();
    this.root.attr({ id: 'root' })
    this.root.appendTo(document.querySelector("#workspace"));

    const config = {
      width: 580,
      height: 400,
      x: 200,
      y: 100
    }

    this.background = new Background(this.root, config)
    this.canvas = new Canvas(this.root, config)
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

