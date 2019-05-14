import React from 'react'
import axios from 'axios'
import classnames from 'classnames'

const BODY_SCROLLING_CLASS = 'stack__body_scrolling'

export default class Stack extends React.Component {
  constructor(props) {
    super(props)

    this.table = React.createRef()
    this.header = React.createRef()
    this.body = React.createRef()
    this.windowHeight = null
    this.rowsInPage = 0

    this.state = {
      list: [],
      tableRect: { left: 0, width: 0 },
      stikyHeader: false,
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
          this.updateBodySize()
          this.updateTableSize()
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.rowsInPage !== nextState.rowsInPage) {
      return true
    }

    if (this.state.offset !== nextState.offset) {
      return true
    }

    if ( this.state.stikyHeader !== nextState.stikyHeader ) {
      return true
    }

    const { left: currentLeft, width: currentWidth } = this.state.tableRect
    const { left: nextLeft, width: nextWidth } = nextState.tableRect

    if ( currentLeft !== nextLeft || currentWidth !== nextWidth ) {
      return true
    }

    return false
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('scroll', this.onWindowScroll)
  }

  render() {
    let headerStyles = null
    const stackCls = classnames('stack', {
      'stack_stiky-header': this.state.stikyHeader
    })
    if (this.state.stikyHeader) {
      const { left, width } = this.state.tableRect
      headerStyles = { left, width }
    }
    return (
      <div className={stackCls} role="table" ref={this.table}>
        <div className="stack__header" role="row" ref={this.header} style={headerStyles}>
          <div className="stack__column stack__column_head stack__column_tiny" role="columnheader">ID</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">First Name</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">Last Name</div>
          <div className="stack__column stack__column_head stack__column_large" role="columnheader">Email</div>
          <div className="stack__column stack__column_head stack__column_medium" role="columnheader">Gender</div>
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
    const visibleRows = this.state.list.slice(this.state.offset, this.state.rowsInPage + this.state.offset)
    
    return (
      visibleRows.map( ({ id, first_name, last_name, email, gender, ip_address}, index) => {
        const rowNumber = index + this.state.offset;
        const rowCls = classnames('stack__row', {
          'stack__row_even': rowNumber % 2 !== 0
        });
        const rowStayle = {
          top: `${(index + this.state.offset) * this.props.height}px`
        };
        return (
          <div key={id} className={rowCls} role="row" style={rowStayle}>
            <div className="stack__column stack__column_tiny" title={id} role="cell">{id}</div>
            <div className="stack__column stack__column_medium" title={first_name} role="cell">{first_name}</div>
            <div className="stack__column stack__column_medium" title={last_name} role="cell">{last_name}</div>
            <div className="stack__column stack__column_large" title={email} role="cell">{email}</div>
            <div className="stack__column stack__column_medium" title={gender} role="cell">{gender}</div>
            <div className="stack__column stack__column_medium" title={ip_address} role="cell">{ip_address}</div>
          </div>
        )
      })
    )
  }

  onWindowResize() {
    this.updateTableSize()
    this.updateWindowSize()
    this.updateStackParams()
  }

  onWindowScroll() {
    this.updateHeaderPosition()
    this.setScrolling()
    this.updateOffset()
  }

  updateTableSize() {
    const { left, width } = this.table.current.getBoundingClientRect()
    const { left: currentLeft, width: currentWidth } = this.state.tableRect

    if (currentLeft !== left || currentWidth !== width ) {
      this.setState({
        tableRect: { left, width },
      })
    }
  }

  updateHeaderPosition() {
    const { top } = this.table.current.getBoundingClientRect()
    const newStikyState = top <= 1

    if ( this.state.stikyHeader !== newStikyState ) {
      this.setState({
        stikyHeader: newStikyState,
      })
    }
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

  updateBodySize() {
    this.body.current.style.height = `${this.state.length * this.props.height}px`;
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
