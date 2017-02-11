import Layer from './Layer'
import Path from './Path'

class Canvas {
  constructor(root, config) {
    const object = root.svg()
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    const background = {
      fill: '#fff',
      opacity: 0.5,
      id: 'canvas-background'
    }
    this.config = Object.assign(config, { id: 'canvas' })
    this.mode = 'path'
    this.attr(this.config)

    this.background = this.rect(-1, -1, config.width+2, config.height+2).attr(background)

    this.layer = this.group()
    this.layer.attr({ id: 'layer-0' })
    // this.controls = this.group()
    // this.controls.attr({ id: 'controls' })
    // this.selections = this.group()
    // this.selections.attr({ id: 'selections' })
    // this.objects = []

    this.mousedown(this.onMouseDown.bind(this))
    this.mousemove(this.onMouseMove.bind(this))
    this.mouseup(this.onMouseUp.bind(this))
    this.dblclick(this.onDoubleClick.bind(this))

    window.canvas = this

    this.current = {
      layer: this.layer
    }
  }

  onMouseDown(event) {
    if (window.mousedown) return false
    window.mousedown = this.id

    const point = this.mouse(event)
    this.drawing = true
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        if (!this.current.path) {

          const id = this.current.layer.children().length
          this.current.path = new Path(this)
          this.current.layer.add(this.current.path.group)
        }
        this.current.path.initSegment(point)
        break
      default:
        break
    }
  }

  onMouseMove(event) {
    const point = this.mouse(event)

    if (!this.drawing) {
      if (window.mousedown && window.mousedown.includes('point-')) {
        const id = Number(window.mousedown.split('-')[1])
        path.segments[id].movePoint(point)
      }
      if (window.mousedown && window.mousedown.includes('anchor-')) {
        const id = Number(window.mousedown.split('-')[1])
        const i  = Number(window.mousedown.split('-')[2])
        path.segments[id].moveAnchors(point, i)
      }
      return false
    }

    switch (this.mode) {
      case 'select':

        break
      case 'path':
        if (window.mousedown === this.id) {
          this.current.path.updateAnchor(point)
        } else {
          this.current.path.drawDraft(point)
        }
        break
      default:
        break
    }
  }

  onMouseUp(event) {
    if (window.mousedown !== this.id) {
      window.mousedown = null
      return false
    }

    window.mousedown = null

    const point = this.mouse(event)
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        this.current.path.addSegment(point)
        break
      default:
        break
    }
  }

  onDoubleClick(event) {
    window.mousedown = null

    const point = this.mouse(event)
    this.drawing = false
    switch (this.mode) {
      case 'select':

        break
      case 'path':
        this.current.path.finish(point)
        this.current.path = null
        break
      default:
        break
    }
  }

  mouse(event) {
    const m = (Snap.matrix(this.node.getScreenCTM())).invert()
    const ex = event.clientX
    const ey = event.clientY
    return { x: m.x(ex, ey), y: m.y(ex, ey) }
  }

}

export default Canvas