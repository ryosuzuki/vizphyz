import React, { Component } from 'react'
import moment from 'moment'
import ImagesClient from 'google-images'

const CSE_ID = '007741964338032796999:f69392isk_m'
const API_KEY = 'AIzaSyCnoc9gsHVdHZYGXSx_YkPUht9TuZ0kFP8'
let client = new ImagesClient(CSE_ID, API_KEY)

class Sidebar extends Component {
  constructor() {
    super()
    this.state = {
      images: [],
      keyword: ''
    }
    window.sidebar = this
  }

  componentDidMount() {
  }

  onChange(event) {
    this.setState({ keyword: event.target.value })
  }

  onSubmit(event) {
    event.preventDefault()
    console.log('searching...')
    client.search(this.state.keyword)
    .then((images) => {
      console.log(images)
      this.setState({ images: images })
    })
  }

  render() {
    return (
      <div id="sidebar">
        <div className="ui feed">
          <form className="ui icon input" onSubmit={ this.onSubmit.bind(this) }>
            <input className="prompt" type="text" placeholder="Search animals..."
              value={ this.state.keyword }
              onChange={ this.onChange.bind(this) }

            />
            <i className="search link icon"></i>
          </form>
          { this.state.images.map((image) => {
            return (
              <div className={ "event" }  id={ image.url } key={ image.url }>
                <div className="content">
                  <div className="summary">
                    { image.type }
                  </div>
                  <div className="text">
                    Hello world
                    <img src={ image.thumbnail.url } />
                  </div>
                </div>
              </div>
            )
          }) }
        </div>
      </div>
    )
  }

}

export default Sidebar