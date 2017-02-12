import React, { Component } from 'react'
import { BlockPicker } from 'react-color'
import actions from '../redux/actions'


class Panel extends Component {
  constructor() {
    super()
    window.panel = this
    this.state = {
      picker: false,
      type: 'fill'
    }
  }

  componentDidMount() {
  }

  onClick(type) {
    console.log(type)
    this.setState({ picker: !this.state.picker, type: type })
  };

  onClose() {
    this.setState({ picker: false })
  };

  onChange(color) {
    if (!this.props.path) return false
    const path = this.props.path
    if (this.state.type === 'fill') {
      path.attr({ fill: color.hex })
    } else {
      path.attr({ stroke: color.hex, strokeWidth: 10 })
    }
    this.props.store.dispatch(actions.updateState({ path: path }))
    console.log(color)
  };

  render() {
    if (!this.props.path) {
      return <div id="panel"></div>
    }

    let color = 'none'
    if (this.props.path) color = this.props.path.attr()[this.state.type]

    return (
      <div id="panel">
        <div className="ui feed">
          <div className="event">
            <div className="content">
              <div className="summary">
                <button className="ui button" onClick={ this.onClick.bind(this, 'fill') }>Fill Color</button>

                <button className="ui button" onClick={ this.onClick.bind(this, 'stroke') }>Stroke Color</button>

                { this.state.picker ? <div id="color-picker-popover">
                  <div id="color-picker-cover" onClick={ this.onClose.bind(this) }/>
                  <BlockPicker color={ color } onChange={ this.onChange.bind(this) } />
                </div> : null }

              </div>
              <div className="text">
                Hello world
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Panel