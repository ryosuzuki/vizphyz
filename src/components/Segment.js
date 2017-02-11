
class Segment {

  constructor(path, id) {
    this.id = id
    this.path = path
    this.point = null
    this.anchors = []
    this.lines = []
    this.init()
  }

  init() {

    this.point = this.path.canvas.rect(-10, -10, 6, 6)
    .attr({
      fill: '#fff',
      stroke: '#4F80FF',
      strokeWidth: 1,
      cursor: 'move',
      id: `point-${this.path.id}-${this.id}`
    })

    this.point.mousedown(function(event) {
      if (window.mousedown) return false
      window.mousedown = `point-${this.id}`
      // this.start = this.path.canvas.mouse(event)
    }.bind(this))

    /*
    this.point.mousemove(function(event) {
      if (window.mousedown !== this.point.attr('id')) return false
      const point = this.path.canvas.mouse(event)
      this.movePoint(point)
    }.bind(this))

    this.point.mousemove(function(event) {
      if (window.mousedown !== this.point.attr('id')) return false
      window.mousedown = null
    }.bind(this))
    */

    for (let i = 0; i < 2; i++) {
      const anchor = this.path.canvas.circle(-10, -10, 3)
      .attr({
        fill: '#4F80FF',
        stroke: '#4F80FF',
        cursor: 'move',
        id: `anchor-${this.path.id}-${this.id}-${i}`
      })

      anchor.mousedown(function(event) {
        if (window.mousedown) return false
        window.mousedown = `anchor-${this.id}-${i}`
      }.bind(this))

      const line = this.path.canvas.line(0, 0, 0, 0)
      .attr({
        stroke: '#4F80FF',
        strokeWidth: 1,
        id: `line-${this.path.id}-${this.id}-${i}`
      })

      this.anchors.push(anchor)
      this.lines.push(line)

    }

    this.path.controls.add(this.point)
    this.path.controls.add(this.anchors)
    this.path.controls.add(this.lines)

  }


  movePoint(point) {
    const diff = {
      x: point.x - this.point.x,
      y: point.y - this.point.y,
    }
    const anchor = {
      x: this.anchors[0].x + diff.x,
      y: this.anchors[0].y + diff.y,
    }
    this.updatePoint(point)
    this.updateAnchors(anchor)
    this.path.update()
  }

  moveAnchors(point, id) {
    this.updateAnchors(point, id)
    this.path.update()
  }

  updatePoint(point) {
    Object.assign(this.point, point)
    this.point.attr({ x: point.x-3, y: point.y-3 })
  }

  updateAnchors(anchor, id = 0) {
    Object.assign(this.anchors[id], {
      x: anchor.x,
      y: anchor.y
    })
    Object.assign(this.anchors[(id+1)%2], {
      x: 2*this.point.x - anchor.x,
      y: 2*this.point.y - anchor.y,
    })

    for (let i = 0; i < 2; i++) {
      this.anchors[i].attr({
        cx: this.anchors[i].x,
        cy: this.anchors[i].y
      })
      this.lines[i].attr({
        x1: this.point.x,
        y1: this.point.y,
        x2: this.anchors[i].x,
        y2: this.anchors[i].y,
      })
    }
  }

  toggle() {
    if (this.point.attr('display') === 'none') {
      this.show()
    } else {
      this.hide()
    }
  }

  hide() {
    this.hidePoint()
    this.hideAnchors()
  }

  hidePoint() {
    this.point.attr('display', 'none')
  }

  hideAnchors() {
    for (let i = 0; i < 2; i++) {
      this.anchors[i].attr('display', 'none')
      this.lines[i].attr('display', 'none')
    }
  }

  show() {
    this.showPoint()
    this.showAnchors()
  }

  showPoint() {
    this.point.attr('display', 'inline')
  }

  showAnchors() {
    for (let i = 0; i < 2; i++) {
      this.anchors[i].attr('display', 'inline')
      this.lines[i].attr('display', 'inline')
    }
  }

}


export default Segment