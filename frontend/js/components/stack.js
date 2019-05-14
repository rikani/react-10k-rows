import React from 'react'
import axios from 'axios'
import classnames from 'classnames'
import { connect } from 'react-redux'

const STACK_STICKY_CLASS = 'stack_sticky-header'
const BODY_SCROLLING_CLASS = 'stack__body_scrolling'

class Stack extends React.Component {
  constructor(props) {
    super(props)

    this.table = React.createRef()
    this.header = React.createRef()
    this.body = React.createRef()
    this.windowHeight = null
    this.rowsInPage = 0

    this.state = {
      list: [],
      length: 0,
      rowsInPage: 0,
      offset: 0
    }

    this.onWindowResize = this.onWindowResize.bind(this)
    this.onWindowScroll = this.onWindowScroll.bind(this)
  }

  componentDidMount() {
    this.updateWindowSize()
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('scroll', this.onWindowScroll)

    axios.get('/api/data')
      .then( res => {
        this.setState({
          list: res.data,
          length: res.data.length
        }, () => {
          this.updateStackParams()
          this.updateBodySize(this.state.length)
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.firstName !== nextProps.firstName) {
      return true
    }

    if (this.state.rowsInPage !== nextState.rowsInPage) {
      return true
    }

    if (this.state.offset !== nextState.offset) {
      return true
    }

    return false
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('scroll', this.onWindowScroll)
  }

  render() {
    return (
      <div className="stack" role="table" ref={this.table}>
        <div className="stack__header" role="row" ref={this.header}>
          <div className="stack__column stack__column_head stack__column_tiny" role="columnheader">ID</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">First Name</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">Last Name</div>
          <div className="stack__column stack__column_head stack__column_large" role="columnheader">Email</div>
          <div className="stack__column stack__column_head stack__column_tiny" role="columnheader">Gender</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">IP Address</div>
        </div>
        <div className="stack__body" role="rowgroup" ref={this.body}>
          {
            this.state.length > 0 ? this.renderRows() : this.renderLoading()
          }
        </div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="stack__loading">Loading...</div>
    )
  }

  renderRows() {
    const { offset, list } = this.state
    const { height } = this.props
    const filteredRows = this.getFilteredRows(list)
    const visibleRows = this.getVisibleRows(filteredRows)
    this.updateBodySize(filteredRows.length)
    
    return (
      visibleRows.map( ({ id, first_name, last_name, email, gender, ip_address}, index) => {
        const rowNumber = index + offset;
        const rowCls = classnames('stack__row', {
          'stack__row_even': rowNumber % 2 !== 0
        });
        const rowStayle = {
          top: `${(index + offset) * height}px`
        };
        return (
          <div key={id} className={rowCls} role="row" style={rowStayle}>
            <div className="stack__column stack__column_tiny" title={id} role="cell">{id}</div>
            <div className="stack__column stack__column_medium" title={first_name} role="cell">{first_name}</div>
            <div className="stack__column stack__column_medium" title={last_name} role="cell">{last_name}</div>
            <div className="stack__column stack__column_large" title={email} role="cell">{email}</div>
            <div className="stack__column stack__column_tiny" title={gender} role="cell">{gender}</div>
            <div className="stack__column stack__column_medium" title={ip_address} role="cell">{ip_address}</div>
          </div>
        )
      })
    )
  }

  onWindowResize() {
    this.updateWindowSize()
    this.updateStackParams()
  }

  onWindowScroll() {
    this.toggleStickyMode()
    this.setScrolling()
    this.updateOffset()
  }

  toggleStickyMode() {
    const { top } = this.table.current.getBoundingClientRect()
    const { left, width } = this.table.current.getBoundingClientRect()

    if (top <= 1) {
      this.table.current.classList.add(STACK_STICKY_CLASS)
      this.header.current.style.left = `${left}px`
      this.header.current.style.width = `${width}px`
    } else {
      this.table.current.classList.remove(STACK_STICKY_CLASS)
      this.header.current.style.left = ''
      this.header.current.style.width = ''
    }
  }

  getFilteredRows(list) {
    const { firstName } = this.props

    return list.filter( ({ first_name }) => first_name.toLowerCase().indexOf(firstName.toLowerCase()) > -1)
  }

  getVisibleRows(list) {
    const { offset, rowsInPage } = this.state

    return list.slice(offset, rowsInPage + offset)
  }

  setScrolling() {
    this.body.current.classList.add(BODY_SCROLLING_CLASS)
    if (this.to) {
      clearTimeout(this.to)
    }

    this.to = setTimeout(() => {
      this.body.current.classList.remove(BODY_SCROLLING_CLASS)
    }, 200)
  }

  updateOffset() {
    const { top } = this.body.current.getBoundingClientRect()
    let offset = 0

    if (top < 0) {
      offset = Math.floor(Math.abs(top) / this.props.height)
    }

    const delta = this.state.offset - offset

    if (this.state.offset !== offset && (offset === 0 || delta <= -6 || delta >= 1)) {
      if (delta >= 1) {
        offset = Math.max(0, offset - 5)
      }
      this.setState({ offset })
    }
  }

  updateBodySize(length) {
    this.body.current.style.height = `${length * this.props.height}px`;
  }

  updateWindowSize() {
    this.windowHeight = document.documentElement.clientHeight;
  }

  updateStackParams() {
    this.setState({
      rowsInPage: Math.ceil(this.windowHeight / this.props.height) + 10
    })
  }
}

const mapStateToProps = state => ({ firstName: state })

export default connect(mapStateToProps)(Stack)
