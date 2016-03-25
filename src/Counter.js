
import React from 'react'
import { modelOf, unionOf } from './redux-dataset'
import { take, put, call, fork } from 'redux-saga/effects'


const actions = unionOf({
  Increment: [],
  IncrementAsync: [],
  Decrement: [],
  Reset: []
})

function update(state = 0, ac) {
  return actions.caseOf(ac, {
    Increment: () => state + 1,
    Decrement: () => state - 1,
    Reset: () => 0,
    _: () => state
  })
}

const delay = (ms) => new Promise(r => setTimeout(r, ms))

function* incrementAsync() {
  yield call(delay, 1000)
  yield put(actions.Increment())
}

function* saga() {
  while(true) {
    yield take('IncrementAsync')
    yield fork(incrementAsync)
  }

}

function render({state, ns, onRemove}) {
  return (
    <div style={{margin: '5px', padding: '1em', border: '1px solid #eee'}}>
      <span style={{marginRight: '2em'}}>Counter : {state}</span>
      <button onClick={ns.Increment}>Increment</button>{' '}
      <button onClick={ns.Decrement}>Decrement</button>{' '}
      <button onClick={ns.Reset}>Reset</button>{' '}
      <button onClick={onRemove}>Remove</button>
      <button onClick={ns.IncrementAsync}>Increment async</button>{' '}
    </div>
  )
}

export default modelOf({ actions, update, saga, render })
