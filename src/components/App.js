import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    this.state = {}
    this.mousedown = false
  }

  componentDidMount() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.paper = Snap(this.width, this.height).remove();

    this.paper.mousedown((e) => {
      this.onMouseDown(e)
    })
    this.paper.mousemove((e) => {
      this.onMouseMove(e)
    })
    this.paper.mouseup((e) => {
      this.onMouseUp(e)
    })
    // var circle = paper.circle(-10,-10,10).attr("fill", "red");
    // paper.mousemove(function(e){
    //   var m = (Snap.matrix(paper.node.getScreenCTM())).invert();
    //   var ex = e.clientX;
    //   var ey = e.clientY;
    //   circle.attr({cx:m.x(ex, ey), cy:m.y(ex, ey)});
    // });

    const container = document.querySelector("#container");
    this.paper.prependTo(container);
    this.line = []
  }

  onMouseDown(e) {
    console.log('mouse down')
    this.mousedown = true
    const pos = this.getCursor(e)
    this.line.push(pos)
  }

  onMouseMove(e) {
    if (!this.mousedown) return false
    console.log('mouse move')
    console.log(this.getCursor(e))
  }

  onMouseUp(e) {
    console.log('mouse up')
    this.mousedown = false
  }

  draw() {
    let path = ''
    const start = this.line[0]
    path += `M ${start.x} ${start.y}`
    for (let i = 1; i < this.line.length; i++) {
      const point = this.line[i]
      path += `L ${point.x} ${point.y}`
    }
    this.paper.path(path)
  }

  getCursor(e) {
    const m = (Snap.matrix(this.paper.node.getScreenCTM())).invert()
    const ex = e.clientX
    const ey = e.clientY
    return { x: m.x(ex, ey), y: m.y(ex, ey) }
  }

  render() {
    return (
      <div>
        <div id="container"></div>
      </div>
    )
  }
}

export default App

