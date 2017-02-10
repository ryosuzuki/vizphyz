import React, { Component } from 'react'

import Segment from './Segment'

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

    this.paper.mousedown((event) => {
      this.onMouseDown(event)
    })
    this.paper.mousemove((event) => {
      this.onMouseMove(event)
    })
    this.paper.mouseup((event) => {
      this.onMouseUp(event)
    })
    this.paper.dblclick((event) => {
      this.onDoubleClick(event)
    });

    const container = document.querySelector("#container");
    this.paper.prependTo(container);
    this.segments = []
    this.segment = null
    this.drawing = false
    this.mousedown = false

    this.path = this.paper.path('')
    .attr({
      stroke: '#999',
      strokeWidth: 1,
      fill: 'none'
    })
    this.draft = this.paper.path('')
    .attr({
      stroke: '#22C',
      strokeWidth: 0.5,
      fill: 'none'
    })
  }

  onMouseDown(event) {
    this.drawing = true
    this.mousedown = true
    const point = this.getCursor(event)
    if (this.segment) {
      this.segment.hideAnchors()
    }
    this.segment = new Segment(0, this.paper)
    this.segment.updatePoint(point)
    this.segment.updateAnchors(point)
    this.draw()
  }

  onMouseMove(event) {
    if (!this.drawing) return false

    const point = this.getCursor(event)
    if (this.mousedown) {
      this.draft.attr('display', 'none')
      this.segment.updateAnchors(point)
      this.draw(true)
    } else {
      const lseg = this.segments[this.segments.length-1]
      let d = ''
      d += 'M '
      d += `${lseg.point.x} ${lseg.point.y} `
      d += 'C '
      d += `${lseg.anchors[0].x} ${lseg.anchors[0].y} `
      d += `${point.x} ${point.y} `
      d += `${point.x} ${point.y} `
      this.draft.attr({ d: d, display: 'inline' })
    }
  }

  onMouseUp(event) {
    this.mousedown = false
    const point = this.getCursor(event)
    this.segment.updateAnchors(point)
    this.segments.push(this.segment)
    this.draw()
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
      const pseg = this.segments[i-1]
      const cseg = this.segments[i]
      d += 'C '
      d += `${pseg.anchors[0].x} ${pseg.anchors[0].y} `
      d += `${cseg.anchors[1].x} ${cseg.anchors[1].y} `
      d += `${cseg.point.x} ${cseg.point.y} `
    }
    if (preview) {
      d += 'C '
      d += `${this.segment.anchors[1].x} ${this.segment.anchors[1].y} `
      d += `${this.segment.point.x} ${this.segment.point.y} `
      d += `${this.segment.point.x} ${this.segment.point.y} `
    }
    this.path.attr('d', d)
  }

  getCursor(event) {
    const m = (Snap.matrix(this.paper.node.getScreenCTM())).invert()
    const ex = event.clientX
    const ey = event.clientY
    return { x: m.x(ex, ey), y: m.y(ex, ey) }
  }

  onDoubleClick(event) {
    this.drawing = false
    this.mousedown = false
    this.path = this.path.clone()
    this.path.segments = this.segments
    this.path.segments.map((segment) => {
      segment.showAnchors()
    })
    this.segments = []
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

