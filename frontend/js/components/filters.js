import React from 'react'

const Filters = () => (
  <div className="filters">
    <h2 className="filters__header">Filters</h2>
    <div className="filters__item">
      <label className="filters__item-label" for="first-name">First Name:</label>
      <div className="filters__item-field">
        <input type="text" className="filters__item-input" id="first-name" />
      </div>
    </div>
  </div>
)

export default Filters
