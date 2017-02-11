import Background from './Background'
import Layer from './Layer'
import Path from './Path'

class Canvas {
  constructor(id) {
    this.width = window.innerWidth - 300
    this.height = window.innerHeight

    const object = Snap(this.width, this.height).remove();
    object.appendTo(document.querySelector(id));
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    this.attr({ id: 'canvas' })
    this.mode = 'path'

    this.background = new Background(this)
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
    window.mousedown = this
    const point = this.mouse(event)
    this.drawing = true
    if (!this.current.path) {
      const id = this.current.layer.children().length
      this.current.path = new Path(this)
      this.current.layer.add(this.current.path.group)
    }
    this.current.path.initSegment(point)
  }

  onMouseMove(event) {
    const point = this.mouse(event)
    if (window.mousedown && window.mousedown !== this) {
      window.mousedown.onMouseMove(event, point)
      return false
    }

    if (!this.drawing) {
      return false
    }
    if (window.mousedown === null) {
      this.current.path.drawDraft(point)
    }
    if (window.mousedown === this) {
      this.current.path.updateAnchor(point)
    }
  }

  onMouseUp(event) {
    const point = this.mouse(event)
    if (window.mousedown && window.mousedown !== this) {
      window.mousedown = null
      // window.mousedown.onMouseUp(event, point)
      return false
    }

    if (window.mousedown === this) {
      window.mousedown = null
      this.current.path.addSegment(point)
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