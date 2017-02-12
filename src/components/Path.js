import Segment from './Segment'
import Selector from './Selector'

import svgpath from 'svgpath'

class Path {
  constructor(canvas) {
    const object = canvas.content.path()
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

    this.controls = this.canvas.group()
    this.controls.attr({ id: `control-${this.id}` })
    this.selectors = this.canvas.group()
    this.selectors.attr({ id: `selector-${this.id}` })

    this.controls.add(this.draftPath)

    this.canvas.controls.add(this.controls)
    this.canvas.selectors.add(this.selectors)

    this.selector = new Selector(this)

    this.mousedown(this.onMouseDown.bind(this))
    this.dblclick(this.onDoubleClick.bind(this))
    this.hideSelectors()

    this.mode = null
    window.path = this
  }

  onMouseDown(event) {
    console.log('path mouse down')
    if (this.canvas.props.path !== this) {
      this.canvas.updateState({ path: this })
      this.showSelectors()
    }
    this.canvas.updateState({ active: this })
    this.st = this.transform()
    this.sb = this.getBBox()
  }

  onMouseMove(event) {
    console.log('mouse move')
    if (this.mode === 'selector') {
      // this.move(point, this.st)
      this.move()
    }
  }

  onMouseUp(event) {
    console.log('path mouse up')
    const point = this.canvas.props.point
    const start = this.canvas.props.start

    let transform = this.transform().localMatrix
    let matrix = []
    for (let key of Object.keys(transform)) {
      matrix.push(transform[key])
    }
    const d = this.attr('d')
    const nd = svgpath(d).matrix(matrix)
    this.attr('d', nd.toString())
    const dx = point.x - start.x
    const dy = point.y - start.y
    this.transform('translate(0, 0)')
    this.updateSegments()
  }

  onDoubleClick(event) {
    if (this.canvas.props.mode === 'select') {
      this.toggle()
    }
  }

  updateSegments() {
    const items = Snap.parsePathString(this.attr('d'))
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item[0] === 'M') {
        this.segments[0].updatePoint({ x: item[1], y: item[2] })
      }
      if (item[0] === 'C') {
        this.segments[i].updatePoint({ x: item[5], y: item[6] })
        this.segments[i].updateAnchors({ x: item[3], y: item[4] }, 1)
        this.segments[i-1].updateAnchors({ x: item[1], y: item[2] }, 0)
      }
    }
  }

  move() {
    const point = this.canvas.props.point
    const start = this.canvas.props.start
    const dx = point.x - start.x
    const dy = point.y - start.y
    const sx = this.st.localMatrix.e
    const sy = this.st.localMatrix.f
    this.transform(`translate(${sx + dx}, ${sy + dy})`)
    this.selector.update()
  }

  resize(pos) {
    const point = this.canvas.props.point
    const start = this.canvas.props.start
    const dx = point.x - start.x
    const dy = point.y - start.y
    let scaleX = 1 + (dx / this.sb.width)
    let scaleY = 1 + (dy / this.sb.height)
    let translateX = this.sb.x
    let translateY = this.sb.y
    if (['nw', 'w', 'sw'].includes(pos)) {
      translateX = this.sb.x2
      scaleX = 1 - (dx / this.sb.width)
    }
    if (['nw', 'n', 'ne'].includes(pos)) {
      translateY = this.sb.y2
      scaleY = 1 - (dy / this.sb.height)
    }
    if (['n', 's'].includes(pos)) {
      scaleX = 1
    }
    if (['w', 'e'].includes(pos)) {
      scaleY = 1
    }
    let transform = ''
    transform += `translate(${translateX}, ${translateY}) `
    transform += `scale(${scaleX}, ${scaleY}) `
    transform += `translate(${-translateX}, ${-translateY})`
    this.transform(transform)
    this.selector.update()
  }

  initSegment() {
    const point = this.canvas.props.point
    if (this.segment) {
      this.segment.hideAnchors()
    }
    const id = this.segments.length
    this.segment = new Segment(this, id)
    this.segment.updatePoint(point)
    this.segment.updateAnchors(point)
    this.update()
  }

  updateAnchor() {
    const point = this.canvas.props.point
    this.draftPath.attr('display', 'none')
    this.segment.updateAnchors(point)
    this.update(true)
  }

  drawDraft() {
    const point = this.canvas.props.point
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

  addSegment() {
    const point = this.canvas.props.point
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

  finish() {
    const point = this.canvas.props.point
    this.draftPath.remove()
    this.hideControls()
    this.showSelectors()
  }

  toggle() {
    if (this.controls.attr('display') === 'none') {
      this.hideSelectors()
      this.showControls()
    } else {
      this.showSelectors()
      this.hideControls()
    }
  }

  showSelectors() {
    this.mode = 'selector'
    this.selectors.attr({ display: 'inline' })
  }

  hideSelectors() {
    this.selectors.attr({ display: 'none' })
  }

  showControls() {
    this.mode = 'control'
    this.controls.attr({ display: 'inline' })
    for (let segment of this.segments) {
      segment.show()
    }
  }

  hideControls() {
    this.controls.attr({ display: 'none' })
    for (let segment of this.segments) {
      segment.hide()
    }
  }

}

export default Path