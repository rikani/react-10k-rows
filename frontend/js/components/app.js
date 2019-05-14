import React from 'react'
import Header from './header.js'
import Filters from './filters.js'
import Stack from './stack.js'

const BODY_STICKY_CLASS = 'app__body_sticky'
class App extends React.Component {
  constructor(props) {
    super(props)

    this.body = React.createRef()

    this.onWindowScroll = this.onWindowScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onWindowScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll)
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <Header title="Stack" />
        </header>
        <div className="app__body" ref={this.body}>
          <aside className="app__aside">
            <Filters />
          </aside>
          <section className="app__main">
            <Stack height={40} />
          </section>
        </div>
      </div>
    )
  }

  onWindowScroll() {
    this.toggleStickyMode()
  }

  toggleStickyMode() {
    const body = this.body.current
    const { top } = body.getBoundingClientRect()

    if (top <= 0) {
      body.classList.add(BODY_STICKY_CLASS)
    } else {
      body.classList.remove(BODY_STICKY_CLASS)
    }
  }
}

export default App
