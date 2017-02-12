import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../redux/actions'

import Sidebar from './Sidebar'
import Canvas from './Canvas'
import Panel from './Panel'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {/*
        <Sidebar />
        */}
        <Canvas
          mode={ this.props.mode }
          drawing={ this.props.drawing }
          active={ this.props.active }
          point={ this.props.point }
          start={ this.props.start }
          path={ this.props.path }
          store={ this.props.store }
        />
        <Panel
          active={ this.props.active }
          path={ this.props.path }
          store={ this.props.store }
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
