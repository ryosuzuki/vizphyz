import Segment from './Segment'
import Selector from './Selector'

class Image {
  constructor(canvas) {
    const object = canvas.imageLayer.image()
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    this.canvas = canvas
    this.selectors = this.canvas.group()
    this.selectors.attr({ id: `selector-${this.id}` })
    this.canvas.selectors.add(this.selectors)

    this.selector = new Selector(this)

    this.mousedown(this.onMouseDown.bind(this))
    this.dblclick(this.onDoubleClick.bind(this))
    this.hideSelectors()

    this.mode = null
    window.image = this
  }

  onMouseDown(event) {
    console.log('image mouse down')
    if (this.canvas.props.path !== this) {
      this.canvas.updateState({ path: this })
      this.showSelectors()
    }
    this.canvas.updateState({ active: this })
    this.st = this.transform()
    this.sb = this.getBBox()
    this.selector.update()
    this.showSelectors()
  }

  onMouseMove(event) {
    console.log('mouse move')
    if (this.mode === 'selector') {
      // this.move(point, this.st)
      this.move()
    }
  }

  onMouseUp(event) {
    return false
    console.log('path mouse up')
    // const point = this.canvas.props.point
    // const start = this.canvas.props.start

    // let transform = this.transform().localMatrix
    // let matrix = []
    // for (let key of Object.keys(transform)) {
    //   matrix.push(transform[key])
    // }
    // const d = this.attr('d')
    // const nd = svgpath(d).matrix(matrix)
    // this.attr('d', nd.toString())
    // const dx = point.x - start.x
    // const dy = point.y - start.y
    // this.transform('translate(0, 0)')
    // this.updateSegments()
  }

  onDoubleClick(event) {
  }

  move() {
    const point = this.canvas.props.point
    const start = this.canvas.props.start
    const translateX = point.x - start.x
    const translateY = point.y - start.y
    let matrix = this.st.localMatrix.clone()
    matrix.translate(translateX, translateY)
    this.transform(matrix.toString())
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
    let matrix = this.st.localMatrix.clone()
    matrix.translate(translateX, translateY)
    matrix.scale(scaleX, scaleY, 0, 0)
    matrix.translate(-translateX, -translateY)
    this.transform(matrix.toString())
    this.selector.update()
  }

  toggle() {
    if (this.selectors.attr('display') === 'none') {
      this.showSelectors()
    } else {
      this.hideSelectors()
    }
  }

  showSelectors() {
    this.mode = 'selector'
    this.selectors.attr({ display: 'inline' })
  }

  hideSelectors() {
    this.selectors.attr({ display: 'none' })
  }

}

export default Image