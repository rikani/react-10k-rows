import React from 'react'
import Header from './header.js'
import Filters from './filters.js'
import Stack from './stack.js'

const App = () => (
  <div className="app">
    <header className="app__header">
      <Header title="Stack" />
    </header>
    <div className="app__body">
      <aside className="app__aside">
        <Filters />
      </aside>
      <section className="app__main">
        <Stack />
      </section>
    </div>
  </div>
)

export default App
