import React, { Component } from 'react'
import actions from '../redux/actions'
import SvgSaver from 'svgsaver'
import moment from 'moment'

import Background from './Background'
import Layer from './Layer'
import Path from './Path'
import Image from './Image'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.canvas = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300 - 200
    this.height = window.innerHeight

    const object = Snap(this.width, this.height).remove();
    object.appendTo(document.querySelector('#workspace'));
    Object.assign(this, object)
    const keys = Object.keys(Object.getPrototypeOf(object))
    for (let key of keys) {
      this[key] = object[key]
    }

    this.attr({ id: 'canvas' })

    this.background = new Background(this)

    this.imageLayer = canvas.svg()
    this.imageLayer.attr({
      width: 580,
      height: 400,
      x: 100,
      y: 100,
      id: 'image-layer',
    })
    // this.imageLayer.attr({ id: 'image-layer' })

    this.content = canvas.svg()
    this.content.attr({
      width: 580,
      height: 400,
      x: 100,
      y: 100,
      id: 'content',
      background: '#fff'
    })

    this.layer = this.group()
    this.layer.attr({ id: 'layer-0' })

    this.controls = this.group()
    this.controls.attr({ id: 'controls' })

    this.selectors = this.group()
    this.selectors.attr({ id: 'selectors' })

    // this.objects = []

    this.mousedown(this.onMouseDown.bind(this))
    this.mousemove(this.onMouseMove.bind(this))
    this.mouseup(this.onMouseUp.bind(this))
    this.dblclick(this.onDoubleClick.bind(this))

    this.updateState({
      mode: 'select',
      drawing: false,
      active: null,
      offsetX: 100,
      offsetY: 100,
    })
  }


  onMouseDown(event) {
    event.preventDefault()
    this.updateMousePosition(event, true)

    if (this.props.active) return false

    if (this.props.mode === 'select' && this.props.path) {
      this.props.path.hideSelectors()
      if (this.props.path.hideControls) {
        this.props.path.hideControls()
      }
      this.updateState({ path: null })
      return false
    }

    if (this.props.mode !== 'path') return false

    this.updateState({ active: this, drawing: true })

    if (!this.props.path) {
      const path = new Path(this)
      this.updateState({ path: path })
    }
    this.props.path.initSegment()
  }

  onMouseMove(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    if (this.props.active && this.props.active !== this) {
      this.props.active.onMouseMove(event)
      return false
    }

    if (!this.props.drawing) {
      return false
    }
    if (this.props.active === null) {
      this.props.path.drawDraft()
    }
    if (this.props.active === this) {
      this.props.path.updateAnchor()
    }
  }

  onMouseUp(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    if (this.props.active && this.props.active !== this) {
      this.props.active.onMouseUp(event)
      this.updateState({ active: null })
      return false
    }

    if (this.props.active === this) {
      this.updateState({ active: null })
      this.props.path.addSegment()
    }
  }

  onDoubleClick(event) {
    event.preventDefault()
    this.updateMousePosition(event)

    switch (this.props.mode) {
      case 'select':
        break
      case 'path':
        this.props.path.finish()
        break
      default:
        break
    }

    this.updateState({
      active: null,
      drawing: false,
      mode: 'select',
      // path: null
    })
  }

  updateMousePosition(event, start = false) {
    const m = (Snap.matrix(this.node.getScreenCTM())).invert()
    const ex = event.clientX
    const ey = event.clientY
    const point = {
      x: m.x(ex, ey) - this.props.offsetX,
      y: m.y(ex, ey) - this.props.offsetY
    }
    if (start) {
      this.updateState({ point: point, start: point })
    } else {
      this.updateState({ point: point })
    }
  }

  updateState(state) {
    this.props.store.dispatch(actions.updateState(state))
    this.controls.transform(`translate(${this.props.offsetX}, ${this.props.offsetY})`)
    this.selectors.transform(`translate(${this.props.offsetX}, ${this.props.offsetY})`)

    // this.props.store.dispatch(actions.updateState(state))
    // this.props.store.dispatch(actions.updateState(Object.assign(this.props.state, state)))
  }

  addImage(image) {
    let ratio, width, height
    if (image.width > image.height) {
      ratio = image.height / image.width
      width = this.width / 2
      height = width * ratio
    } else {
      ratio = image.width / image.height
      height = this.height / 2
      width = height * ratio
    }
    const x = this.props.offsetX
    const y = this.props.offsetY
    const path = new Image(this)
    path.attr({
      href: image.url,
      x: x,
      y: y,
      width: width,
      height: height,
      opacity: 0.5
    })
  }

  save(type) {
    const svgsaver = new SvgSaver()
    const content = document.querySelector('#content')
    const filename = moment().format('YYYYMMDDHHmm')
    if (type === 'png') {
      svgsaver.asPng(content, filename)
    } else {
      svgsaver.asSvg(content, filename)
    }
  }

  render() {
    return (
      <div>
        <div id="workspace"></div>
        <div id="save-buttons" className="ui buttons">
          <button className="ui button" onClick={ this.save.bind(this, 'svg') }>Save SVG</button>
          <button className="ui button" onClick={ this.save.bind(this, 'png') }>Save PNG</button>
        </div>
      </div>
    )
  }
}

export default Canvas