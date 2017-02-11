import React, { Component } from 'react'
import Layer from './Layer'
import Path from './Path'


class Canvas extends Component {
  constructor(props) {
    super(props)
    window.canvas = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300
    this.height = window.innerHeight

    this.mode = 'path'

    this.root = Snap(this.width, this.height).remove();
    this.root.attr({ id: 'root' })
    this.root.appendTo(document.querySelector("#workspace"));

    const config = {
      width: 580,
      height: 400,
      x: 200,
      y: 100
    }

    const background = {
      fill: '#fff',
      opacity: 0.5
    }

    this.background = this.root.svg(config.x, config.y, config.width, config.height)
    this.background.attr({ id: 'background' })
    const unit = this.background.group(
      this.background.rect(0, 0, 10, 10).attr({ fill: '#fff' }),
      this.background.rect(0, 0, 5, 5).attr({ fill: '#eee' }),
      this.background.rect(5, 5, 5, 5).attr({ fill: '#eee' }),
    )
    const pattern = unit.pattern(0, 0, 10, 10).attr({ id: 'checker-pattern' })
    this.background.rect(0, 0, '100%', '100%').attr({ stroke: '#fff', fill: pattern })

    this.canvas = this.root.svg(config.x, config.y, config.width, config.height)
    this.canvas.attr({ id: 'canvas' })
    this.canvas.rect(-1, -1, config.width+2, config.height+2).attr(background)

    const layer = new Layer(this.canvas)

    this.canvas.mousedown(this.onMouseDown.bind(this))
    this.canvas.mousemove(this.onMouseMove.bind(this))
    this.canvas.mouseup(this.onMouseUp.bind(this))
    this.canvas.dblclick(this.onDoubleClick.bind(this))
  }

  onMouseDown(event) {
    const point = this.mouse(event)
    this.mousedown = true
    this.drawing = true
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        if (!this.path) this.path = new Path(this.canvas)
        this.path.initSegment(point)
        break
      default:
        break
    }
  }

  onMouseMove(event) {
    if (!this.drawing) return false

    const point = this.mouse(event)
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        if (this.mousedown) {
          this.path.updateAnchor(point)
        } else {
          this.path.drawDraft(point)
        }
        break
      default:
        break
    }

  }

  onMouseUp(event) {
    const point = this.mouse(event)
    this.mousedown = false
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        this.path.addSegment(point)
        break
      default:
        break
    }
  }

  onDoubleClick(event) {
    const point = this.mouse(event)
    this.mousedown = false
    this.drawing = false
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        this.path.finish(point)
        break
      default:
        break
    }
  }

  mouse(event) {
    const m = (Snap.matrix(this.canvas.node.getScreenCTM())).invert()
    const ex = event.clientX
    const ey = event.clientY
    return { x: m.x(ex, ey), y: m.y(ex, ey) }
  }

  render() {
    return (
      <div id="workspace"></div>
    )
  }

}

export default Canvas