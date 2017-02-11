
class Selector {
  constructor(path) {
    this.path = path
    this.bbox = null
    this.grips = []
    this.init()
  }

  init() {
    const positions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

    this.bbox = this.path.canvas.rect(-10, -10, 8, 8)
    .attr({
      fill: 'none',
      stroke: '#4F80FF',
      strokeWidth: 1,
      pointerEvents: 'none',
      id: `bbox-${this.path.id}`
    })

    for (let i = 0; i < 8; i++) {
      const pos = positions[i]
      this.grips[i] = this.path.canvas.rect(-10, -10, 8, 8)
      .attr({
        fill: '#4F80FF',
        stroke: '#4F80FF',
        strokeWidth: 1,
        cursor: `${pos}-resize`,
        pointerEvents: 'all',
        id: `grip-${this.path.id}-${pos}`
      })
      this.grips[i].pos = pos

      this.grips[i].onMouseDown = (event) => {
        console.log('grip mouse down')
        window.mousedown = this.grips[i]
      }
      this.grips[i].onMouseMove = (event, point) => {
        this.resizePath(point, pos)
      }
      this.grips[i].onMouseUp = (event, point) => {
        this.resizePath(point, pos)
      }
      this.grips[i].mousedown(this.grips[i].onMouseDown.bind(this))
    }

    this.path.selectors.add(this.bbox)
    this.path.selectors.add(this.grips)

  }

  update() {
    const bbox = this.path.getBBox()
    this.bbox.attr({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height })
    for (let grip of this.grips) {
      switch (grip.pos) {
        case 'nw':
          grip.attr({ x: bbox.x - 4, y: bbox.y - 4 })
          break
        case 'n':
          grip.attr({ x: bbox.x - 4 + bbox.width / 2, y: bbox.y - 4 })
          break
        case 'ne':
          grip.attr({ x: bbox.x - 4 + bbox.width, y: bbox.y - 4 })
          break
        case 'e':
          grip.attr({ x: bbox.x - 4 + bbox.width, y: bbox.y - 4 + bbox.height / 2 })
          break
        case 'se':
          grip.attr({ x: bbox.x - 4 + bbox.width, y: bbox.y - 4 + bbox.height })
          break
        case 's':
          grip.attr({ x: bbox.x - 4 + bbox.width / 2, y: bbox.y - 4 + bbox.height })
          break
        case 'sw':
          grip.attr({ x: bbox.x - 4, y: bbox.y - 4 + bbox.height })
          break
        case 'w':
          grip.attr({ x: bbox.x - 4, y: bbox.y - 4 + bbox.height / 2 })
          break
        default:
          break
      }

    }

  }

  resizePath(point, pos) {



  }

}

export default Selector