import React, { Component } from 'react'
import Segment from './Segment'

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.segments = []
    this.paths = []
    this.segment = null
    this.path = null
    this.drawing = false
    this.mousedown = false
    window.canvas = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300
    this.height = window.innerHeight

    this.paper = Snap(this.width, this.height).remove();
    this.paper.prependTo(document.querySelector("#canvas"));

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
    this.bbox = this.paper.rect(0, 0, 0, 0)
    .attr({
      fill: 'none',
      stroke: '#4F80FF',
      strokeWidth: 0.5,
    })
  }

  onMouseDown(event) {
    const point = this.getCursor(event)
    if (this.paths.length > 0) {
      const path = this.paths[0]
      const inside = Snap.path.isPointInside(path, point.x, point.y)

      if (this.pointDown) {

      }

      if (this.anchorDown) {

      }
      return false

      if (inside) {
        if (this.bbox.attr('display') === 'none') {
          const bbox = path.getBBox()
          this.bbox.attr({
            display: 'inline',
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height
          })
          path.segments.map((segment) => {
            segment.hide()
          })
          this.showSegments = false
        } else {
          this.bbox.attr('display', 'none')
          path.segments.map((segment) => {
            segment.show()
          })
          this.showSegments = true
        }
      } else {
        this.bbox.attr('display', 'none')
        path.segments.map((segment) => {
          segment.hide()
        })
        this.showSegments = false
      }

      return false
    }

    this.drawing = true
    this.mousedown = true
    if (this.segment) {
      this.segment.hideAnchors()
    }
    const index = this.segments.length
    this.segment = new Segment(index, this.paper)
    this.segment.updatePoint(point)
    this.segment.updateAnchors(point)
    this.draw()
  }

  onMouseMove(event) {
    const point = this.getCursor(event)

    if (this.pointDown) {
      this.segment = this.segments[this.pointDown]
      this.segment.movePoint(point)
      this.draw()
    }

    if (this.anchorDown) {
      const index = Number(this.anchorDown.split('-')[0])
      const id = Number(this.anchorDown.split('-')[1])
      this.segment = this.segments[index]
      this.segment.updateAnchors(point, id)
      this.draw()
    }

    if (!this.drawing) return false
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
    this.pointDown = null
    this.anchorDown = null

    if (!this.drawing) return false

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
    if (this.paths.length > 0) return false
    this.drawing = false
    this.mousedown = false
    this.path.segments = Array.from(this.segments)

    // this.paths.push(this.path.clone())
    this.paths.push(this.path)
    this.paths[0].segments = Array.from(this.segments)
    this.paths[0].segments.map((segment) => {
      segment.showAnchors()
    })
    this.pointDown = null
    this.anchorDown = null
  }

  render () {
    return (
      <div id="canvas"></div>
    )
  }
}

export default Canvas