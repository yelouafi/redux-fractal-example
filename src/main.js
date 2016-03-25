import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import { connect } from './redux-dataset'
import CounterList from './CounterList'

const store = window.store = createStore(CounterList.update)
const ns = connect(CounterList, store)

function render() {
  ReactDOM.render(
    <CounterList.render
      state={store.getState()}
      ns={ns} />,

    document.getElementById('root')
  )
}

render()
store.subscribe(render)
