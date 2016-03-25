
import React from 'react'
import { modelOf, listOf, combineModels, broadcast } from './redux-dataset'
import Counter from './Counter'
import ToggleField from './ToggleField'



const CounterList = modelOf({

  update: combineModels({
    counters: listOf(Counter),
    filter: ToggleField
  }),

  actions: {
    resetAll: () => broadcast(Counter.Reset())
  },

  views: {
    visibleCounters: (state) => (
      !state.filter
        ? state.counters
        : state.counters.filter(c => c !== 0)
    )
  },

  render: ({state, ns}) => (
    <div>
      <button onClick={ ns.counters.add }>Add Counter</button>{' '}
      <button onClick={ ns.resetAll }>Reset All</button>{' '}
      <button onClick={ ns.filter.Toggle }>{
        state.filter ? 'Show all' : 'Show only positive'
      }</button>
      <hr/>
      <div>{
        ns.visibleCounters().map((c, idx) =>
          <Counter.render
            key={idx}
            state={c}
            ns={ns.counters.get(idx)}
            onRemove={() => ns.counters.remove(idx)}
            />
        )
      }</div>
    </div>
  )
})

export default CounterList
