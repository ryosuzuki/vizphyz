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
    this.segments = []
  }

  onMouseDown(e) {
    console.log('mouse down')
    this.mousedown = true
    const pos = this.getCursor(e)
    this.current = {}
    this.current.point = pos
  }

  onMouseMove(e) {
    if (!this.mousedown) return false
    console.log('mouse move')
    console.log(this.getCursor(e))
  }

  onMouseUp(e) {
    console.log('mouse up')
    this.mousedown = false
    const pos = this.getCursor(e)
    this.current.anchor = pos
    this.segments.push(this.current)
    this.draw()
  }

  draw() {
    const start = this.segments[0]
    let d = ''
    d += `M ${start.point.x} ${start.point.y}`
    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i-1]
      const point = this.segments[i]
      d += 'C '
      d += `${prev.anchor.x} ${prev.anchor.y} `
      d += `${point.point.x} ${point.point.y} `
      d += `${point.point.x} ${point.point.y} `
    }
    if (!this.path) {
      this.path = this.paper.path(d)
    } else {
      this.path.attr('d', d)
    }
    return false
    /*
    const start = this.line[0]
    path += `M ${start.down.x} ${start.down.y}`
    for (let i = 1; i < this.line.length; i++) {
      const prev = this.line[i-1]
      const point = this.line[i]
      path += 'C '
      path += `${prev.up.x} ${prev.up.y} `
      path += `${point.down.x} ${point.down.y} `
      path += `${point.down.x} ${point.down.y} `
    }
    console.log(path)
    this.path = this.paper.path(path)
    */
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

