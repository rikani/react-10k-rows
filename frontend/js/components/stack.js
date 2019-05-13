import React from 'react'
import axios from 'axios'

export default class Stack extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: []
    }
  }
  componentDidMount() {
    axios.get('/api/data')
      .then( res => {
        this.setState({
          list: res.data
        })
      })
  }
  render() {
    return (
      <div className="stack" role="table">
        <div className="stack__header" role="row">
          <div className="stack__column stack__column_head stack__column_tiny" role="columnheader">ID</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">First Name</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">Last Name</div>
          <div className="stack__column stack__column_head stack__column_large" role="columnheader">Email</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">Gender</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">IP Address</div>
        </div>
        <div className="stack__body" role="rowgroup">
          {
            this.state.list.splice(0, 100).map( person => (
              <div key={person.id} className="stack__row" role="row">
                <div className="stack__column stack__column_tiny" title={person.id} role="cell">{person.id}</div>
                <div className="stack__column stack__column_medium" title={person.first_name} role="cell">{person.first_name}</div>
                <div className="stack__column stack__column_medium" title={person.last_name} role="cell">{person.last_name}</div>
                <div className="stack__column stack__column_large" title={person.email} role="cell">{person.email}</div>
                <div className="stack__column stack__column_medium" title={person.gender} role="cell">{person.gender}</div>
                <div className="stack__column stack__column_medium" title={person.ip_address} role="cell">{person.ip_address}</div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
