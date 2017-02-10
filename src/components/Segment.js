
class Segment {

  constructor(index, paper) {
    this.index = index
    this.paper = paper
    this.point = null
    this.anchors = []
    this.lines = []
    this.init()
  }

  init() {
    this.point = this.paper.rect(-10, -10, 6, 6)
    .attr({
      fill: '#fff',
      stroke: '#4F80FF',
      strokeWidth: 1,
      cursor: 'move',
    })

    for (let i = 0; i < 2; i++) {
      const anchor = this.paper.circle(-10, -10, 3)
      .attr({
        fill: '#4F80FF',
        stroke: '#4F80FF',
        cursor: 'move',
      })

      const line = this.paper.line(0, 0, 0, 0)
      .attr({
        stroke: '#4F80FF',
        strokeWidth: 1
      })

      this.anchors.push(anchor.clone())
      this.lines.push(line.clone())
    }
  }

  updatePoint(point) {
    Object.assign(this.point, point)
    this.point.attr({ x: point.x-3, y: point.y-3 })
  }

  updateAnchors(anchor) {
    Object.assign(this.anchors[0], {
      x: anchor.x,
      y: anchor.y
    })
    Object.assign(this.anchors[1], {
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

}


export default Segment