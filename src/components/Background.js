
class Background {
  constructor(canvas) {
    const config = {
      width: 580,
      height: 400,
      x: 100,
      y: 100
    }

    const object = canvas.svg()
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }
    this.config = Object.assign(config, { id: 'background' })
    this.attr(this.config)
    const unit = this.group(
      this.rect(0, 0, 10, 10).attr({ fill: '#fff' }),
      this.rect(0, 0, 5, 5).attr({ fill: '#eee' }),
      this.rect(5, 5, 5, 5).attr({ fill: '#eee' }),
    )
    const pattern = unit.pattern(0, 0, 10, 10).attr({ id: 'checker-pattern' })
    this.rect(0, 0, '100%', '100%').attr({ stroke: '#fff', fill: pattern })

    window.background = this
  }
}

export default Background