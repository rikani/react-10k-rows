import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../actions/filter.js'

class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }
  render() {
    return (
      <div className="filters">
        <h2 className="filters__header">Filters</h2>
        <div className="filters__item">
          <label className="filters__item-label" htmlFor="first-name">First Name:</label>
          <div className="filters__item-field">
            <input type="text" className="filters__item-input" id="first-name" onChange={this.onChange} />
          </div>
        </div>
      </div>
    )
  }

  onChange(e) {
    this.props.setFilter(e.target.value)
  }
}

export default connect(null, { setFilter })(Filters)
