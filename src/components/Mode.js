import React, { Component } from 'react'
import actions from '../redux/actions'

class Mode extends Component {
  constructor() {
    super()
    window.mode = this
  }

  componentDidMount() {
  }

  onClick(event) {
    const mode = event.target.id
    if (this.props.path) {
      this.props.path.hideControls()
      this.props.path.hideSelectors()
    }
    this.props.store.dispatch(actions.updateState({ mode: mode, path: null }))
  };

  render() {
    const active = (mode) => {
      return this.props.mode === mode ? 'active' : ''
    }

    return (
      <div id="mode">
        <div className="">
          <i id="select"
             className={ `fa fa-mouse-pointer fa-fw ${active('select')}` }
             style={{ fontSize: '1.5em', marginLeft: '13px'  }}
             onClick={ this.onClick.bind(this) }></i>
          <i id="path"
             className={ `material-icons ${active('path')}`}
             onClick={ this.onClick.bind(this) }>brush</i>
          <i id="draw"
             className={ `material-icons ${active('draw')}`}
             onClick={ this.onClick.bind(this) }>gesture</i>
          <i id="cut"
             className={ `material-icons ${active('cut')}`}
             onClick={ this.onClick.bind(this) }>content_cut</i>
          <i id="rectangle"
             className={ `material-icons disable ${active('rectangle')}`}
             style={{ fontSize: '2em', marginLeft: '12px'  }}
             onClick={ this.onClick.bind(this) }>crop_landscape</i>
          <i id="circle"
             className={ `material-icons disable ${active('circle')}`}
             onClick={ this.onClick.bind(this) }>panorama_fish_eye</i>
          <i id="star" className="material-icons disable" onClick={ this.onClick.bind(this) }>star_border</i>
          <i id="layers" className="material-icons disable" onClick={ this.onClick.bind(this) }>layers</i>
          <i id="color" className="material-icons disable" onClick={ this.onClick.bind(this) }>color_lens</i>
          <i id="zoom" className="material-icons disable" onClick={ this.onClick.bind(this) }>zoom_in</i>
          {/*
          for resize
          <i className="material-icons active">center_focus_weak</i>
          <i className="material-icons active">center_focus_weak</i>
          <i className="material-icons">crop</i>
          <i className="material-icons">photo_size_select_small</i>
          <i className="material-icons">fullscreen</i>
          <i className="material-icons">zoom_out_map</i>
          for rotate
          <i className="material-icons">crop_rotate</i>

          <i className="material-icons">format_color_fill</i>
          <i className="material-icons">create</i>
          <i className="material-icons">aspect_ratio</i>
          <i className="material-icons">crop_square</i>
          <i className="material-icons">grade</i>
          */}
        </div>
      </div>
    )
  }

}

export default Mode