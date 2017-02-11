import Segment from './Segment'
import Selector from './Selector'

class Path {
  constructor(canvas) {
    const object = canvas.path()
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    const config = {
      stroke: '#999',
      strokeWidth: 1,
      fill: '#000',
      opacity: 0.5
    }
    this.attr(config)
    this.canvas = canvas
    this.draftPath = canvas.path('')
    this.draftPath.attr({
      stroke: '#22C',
      strokeWidth: 0.5,
      fill: 'none',
      id: 'draft-path'
    })

    this.segments = []
    this.segment = null

    this.group = this.canvas.group()
    this.group.attr({ id: `group-${this.id}` })
    this.controls = this.canvas.group()
    this.controls.attr({ id: `control-${this.id}` })
    this.selectors = this.canvas.group()
    this.selectors.attr({ id: `selector-${this.id}` })

    this.selector = new Selector(this)

    this.group.add(this, this.controls, this.selectors)
    this.mousedown(this.onMouseDown.bind(this))
    // this.mousemove(this.onMouseMove.bind(this))
    // this.mouseup(this.onMouseUp.bind(this))

    this.hideSelectors()

    window.path = this
  }

  onMouseDown(event, point) {
    console.log('path mouse down')
    window.mousedown = this
    this.start = this.canvas.mouse(event)
    this.st = this.transform().localMatrix
  }

  onMouseMove(event) {
    console.log('mouse move')
    const point = this.canvas.mouse(event)
    const dx = point.x - this.start.x
    const dy = point.y - this.start.y
    const sx = this.st.e
    const sy = this.st.f
    this.transform(`translate(${sx + dx} ${sy + dy})`)
  }

  onMouseUp(event) {
    console.log('mouse up')
    const point = this.canvas.mouse(event)
    const dx = point.x - this.start.x
    const dy = point.y - this.start.y
    for (let segment of this.segments) {
      segment.transform(dx, dy)
    }
    this.transform('translate(0, 0)')
  }


  initSegment(point) {
    if (this.segment) {
      this.segment.hideAnchors()
    }
    const id = this.segments.length
    this.segment = new Segment(this, id)
    this.segment.updatePoint(point)
    this.segment.updateAnchors(point)
    this.update()
  }

  updateAnchor(point) {
    this.draftPath.attr('display', 'none')
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
    this.draftPath.attr({ d: d, display: 'inline' })
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
    this.attr('d', d)
    this.selector.update()
  }

  finish(point) {
    this.draftPath.remove()
    this.showControls()
  }

  showSelectors() {
    this.selectors.attr({ display: 'inline' })
  }

  hideSelectors() {
    this.selectors.attr({ display: 'none' })
  }

  showControls() {
    for (let segment of this.segments) {
      segment.show()
    }
  }

  hideControls() {
    for (let segment of this.segments) {
      segment.show()
    }
  }

}

export default Path