
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

    this.point.onMouseDown = (event) => {
      console.log('point mouse down')
      window.mousedown = this.point
    }
    this.point.onMouseMove = (event, point) => {
      this.movePoint(point)
    }
    this.point.onMouseUp = (event, point) => {
      this.movePoint(point)
    }
    this.point.mousedown(this.point.onMouseDown.bind(this))

    for (let i = 0; i < 2; i++) {
      this.anchors[i] = this.path.canvas.circle(-10, -10, 3)
      .attr({
        fill: '#4F80FF',
        stroke: '#4F80FF',
        cursor: 'move',
        id: `anchor-${this.path.id}-${this.id}-${i}`
      })
      this.anchors[i].onMouseDown = (event) => {
        console.log('anchor mouse down')
        window.mousedown = this.anchors[i]
      }
      this.anchors[i].onMouseMove = (event, point) => {
        this.moveAnchors(point, i)
      }
      this.anchors[i].onMouseUp = (event, point) => {
        this.moveAnchors(point, i)
      }
      this.anchors[i].mousedown(this.anchors[i].onMouseDown.bind(this))


      this.lines[i] = this.path.canvas.line(0, 0, 0, 0)
      .attr({
        stroke: '#4F80FF',
        strokeWidth: 1,
        id: `line-${this.path.id}-${this.id}-${i}`
      })
    }

    this.path.controls.add(this.point)
    this.path.controls.add(this.anchors)
    this.path.controls.add(this.lines)
  }

  transform(dx, dy) {
    const point = {
      x: this.point.x + dx,
      y: this.point.y + dy,
    }
    this.movePoint(point)
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

  moveAnchors(point, i) {
    this.updateAnchors(point, i)
    this.path.update()
  }

  updatePoint(point) {
    Object.assign(this.point, point)
    this.point.attr({ x: point.x-3, y: point.y-3 })
  }

  updateAnchors(anchor, i = 0) {
    Object.assign(this.anchors[i], {
      x: anchor.x,
      y: anchor.y
    })
    Object.assign(this.anchors[(i+1)%2], {
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