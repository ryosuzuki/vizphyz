import 'semantic-ui-css/semantic.js'
import 'rc-slider/dist/rc-slider.css'
import 'rc-tooltip/assets/bootstrap.css'
import './style.css'
import 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js';


import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

render(
  <App />,
  document.getElementById('react-app')
)
