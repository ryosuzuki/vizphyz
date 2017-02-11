import Segment from './Segment'

class Path {
  constructor(canvas) {
    const config = {
      stroke: '#999',
      strokeWidth: 1,
      fill: 'non'
    }
    this.canvas = canvas
    this.path = this.canvas.path('').attr(config)
    this.draft = this.canvas.path('').attr({ stroke: '#22C', strokeWidth: 0.5, fill: 'none' })
    this.segments = []
    this.segment = null

    window.path = this
  }

  initSegment(point) {
    if (this.segment) {
      this.segment.hideAnchors()
    }
    const index = this.segments.length
    this.segment = new Segment(index, this.canvas)
    this.segment.updatePoint(point)
    this.segment.updateAnchors(point)
    this.update()
  }

  updateAnchor(point) {
    this.draft.attr('display', 'none')
    this.segment.updateAnchors(point)
    this.update(true)
  }

  drawDraft(point) {
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

  addSegment(point) {
    this.segment.updateAnchors(point)
    this.segments.push(this.segment)
    this.update()
  }

  update(preview) {
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

  finish(point) {
    this.path.segments = Array.from(this.segments)
  }

}

export default Path