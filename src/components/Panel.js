import React, { Component } from 'react'
import { BlockPicker } from 'react-color'
import actions from '../redux/actions'
import NumberEditor from 'react-number-editor'

class Panel extends Component {
  constructor() {
    super()
    window.panel = this
    this.state = {
      picker: false,
      type: 'fill',
      fill: null,
      stroke: null,
      strokeWidth: 0,
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

  onColorChange(color) {
    if (!this.props.path) return false
    const path = this.props.path
    const hash = {}
    hash[this.state.type] = color.hex
    path.attr(hash)
    this.props.store.dispatch(actions.updateState({ path: path }))
    this.setState(hash)
    console.log(color)
  };

  onValueChange(value) {
    if (!this.props.path) return false
    const path = this.props.path
    path.attr({ strokeWidth: value })
    this.props.store.dispatch(actions.updateState({ path: path }))

    this.setState({ strokeWidth: value })
    console.log(value)
  }

  update() {
    if (!this.props.path) return false

    this.setState({
      fill: this.props.path.attr()['fill'],
      stroke: this.props.path.attr()['stroke'],
      strokeWidth: Number(this.props.path.attr('strokeWidth').replace('px', ''))
    })
  }

  render() {
    if (!this.props.path) {
      return (
        <div id="panel"></div>
      )
    }

    return (
      <div id="panel">
        <div className="ui feed">
          <div className="event">
            <div className="content">
              <div className="summary">
                <button className="ui button" onClick={ this.onClick.bind(this, 'fill') }>Fill: { this.state.fill }</button>

                <br />

                <button className="ui button" onClick={ this.onClick.bind(this, 'stroke') }>Stroke: { this.state.stroke }</button>

                <br />

                <NumberEditor min={0} max={20} step={0.1} decimals={2} value={ this.state.strokeWidth } onValueChange={ this.onValueChange.bind(this) } />,

              </div>
              <div className="text">

                Hello world


                { this.state.picker ? <div id="color-picker-popover">
                  <div id="color-picker-cover" onClick={ this.onClose.bind(this) }/>
                  <BlockPicker color={ 'none' } onChange={ this.onColorChange.bind(this) } />
                </div> : null }


              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Panel