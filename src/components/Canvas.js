import React, { Component } from 'react'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.canvas = this
  }

  componentDidMount() {
    this.width = window.innerWidth - 300
    this.height = window.innerHeight

    this.root = Snap(this.width, this.height).remove();
    this.root.attr('id', 'root')
    this.root.appendTo(document.querySelector("#workspace"));

    const config = {
      width: 580,
      height: 400
    }

    this.background = Snap(config.width, config.height).remove();
    this.background.attr('id', 'background')
    this.background.appendTo(document.querySelector("#root"));

    this.content = Snap(config.width, config.height).remove();
    this.content.attr('id', 'content')
    this.content.appendTo(document.querySelector("#root"));

    const unit = this.background.group(
      this.background.rect(0, 0, 10, 10).attr({ fill: '#fff' }),
      this.background.rect(0, 0, 5, 5).attr({ fill: '#eee' }),
      this.background.rect(5, 5, 5, 5).attr({ fill: '#eee' }),
    )
    const pattern = unit.pattern(0, 0, 10, 10)
    const background = this.background.rect(0, 0, '100%', '100%')
    background.attr({ stroke: '#000', fill: pattern })
  }

  render() {
    return (
      <div id="workspace"></div>
    )
  }

}

export default Canvas