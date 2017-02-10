import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    this.state = {}
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

    const container = document.querySelector("#container");
    this.paper.prependTo(container);
    this.segments = []
    this.drawing = false
    this.mousedown = false
  }

  onMouseDown(e) {
    this.drawing = true
    this.mousedown = true
    const pos = this.getCursor(e)
    this.current = {}
    this.current.point = pos
    this.paper.rect(pos.x-3, pos.y-3, 6, 6)
    .attr({
      fill: '#fff',
      stroke: '#4F80FF',
      strokeWidth: 1,
      cursor: 'move',
    })
  }

  onMouseMove(e) {
    if (!this.drawing) return false

    if (this.mousedown) {
      if (this.stretch_line) {
        this.stretch_line.attr('display', 'none')
      }
      const anchor_1 = this.getCursor(e)
      const anchor_2 = {
        x: 2 * this.current.point.x - anchor_1.x,
        y: 2 * this.current.point.y - anchor_1.y
      }

      if (!this.anchor_1 || !this.anchor_2) {
        this.anchor_1 = this.paper.circle(-10, -10, 3)
        .attr({ fill: '#4F80FF', stroke: '#4F80FF' })
        this.anchor_2 = this.paper.circle(-10, -10, 3)
        .attr({ fill: '#4F80FF', stroke: '#4F80FF' })
        this.anchor_line_1 = this.paper.line(0, 0, 0, 0)
        .attr({ stroke: '#4F80FF', strokeWidth: 1 })
        this.anchor_line_2 = this.paper.line(0, 0, 0, 0)
        .attr({ stroke: '#4F80FF', strokeWidth: 1 })
      }
      this.anchor_1.attr({ cx: anchor_1.x, cy: anchor_1.y })
      this.anchor_2.attr({ cx: anchor_2.x, cy: anchor_2.y })
      this.anchor_line_1.attr({
        x1: this.current.point.x,
        y1: this.current.point.y,
        x2: anchor_1.x,
        y2: anchor_1.y,
      })
      this.anchor_line_2.attr({
        x1: this.current.point.x,
        y1: this.current.point.y,
        x2: anchor_2.x,
        y2: anchor_2.y,
      })
      this.draw(anchor_2)
    } else {
      const pos = this.getCursor(e)
      const last = this.segments[this.segments.length-1]
      let d = ''
      d += 'M '
      d += `${this.current.point.x} ${this.current.point.y} `
      d += 'C '
      d += `${last.anchor_1.x} ${last.anchor_1.y} `
      d += `${pos.x} ${pos.y} `
      d += `${pos.x} ${pos.y} `
      if (!this.stretch_line) {
        this.stretch_line = this.paper.path('')
        .attr({
          stroke: '#22C',
          strokeWidth: 0.5,
          fill: 'none'
        })
      }
      this.stretch_line.attr({
        d: d,
        display: 'inline'
      })
    }

  }

  onMouseUp(e) {
    this.mousedown = false
    const anchor_1 = this.getCursor(e)
    this.current.anchor_1 = anchor_1
    const anchor_2 = {
      x: 2 * this.current.point.x - anchor_1.x,
      y: 2 * this.current.point.y - anchor_1.y
    }
    this.current.anchor_2 = anchor_2
    this.segments.push(this.current)
    this.draw()
    this.anchor_1 = undefined
    this.anchor_2 = undefined
    this.anchor_line_1 = undefined
    this.anchor_line_2 = undefined
  }

  draw(preview) {
    if (this.segments.length === 0) {
      let d = ''
      return false
    }
    const start = this.segments[0]
    let d = ''
    d += `M ${start.point.x} ${start.point.y}`

    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i-1]
      const current = this.segments[i]
      d += 'C '
      d += `${prev.anchor_1.x} ${prev.anchor_1.y} `
      d += `${current.anchor_2.x} ${current.anchor_2.y} `
      d += `${current.point.x} ${current.point.y} `
    }

    if (preview) {
      const last = this.segments[this.segments.length-1]
      d += 'C '
      d += `${preview.x} ${preview.y} `
      d += `${this.current.point.x} ${this.current.point.y} `
      d += `${this.current.point.x} ${this.current.point.y} `
    }

    if (!this.path) {
      this.path = this.paper.path(d)
      .attr({
        stroke: '#999',
        strokeWidth: 1,
        fill: 'none'
      })
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

