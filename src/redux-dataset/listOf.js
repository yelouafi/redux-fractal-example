
import { modelOf } from './modelOf'
import {  assign, push, ident, currentField, fieldDown } from './utils'

export function listOf(model, finder = ident, {update: _update, actions, views, render}={}) {

  function update (state = [], action) {
    if(action.type === 'LIST_ADD') {
      let newState = state.slice()
      newState.push(
        model.init ? model.init(...action.args) : model.update(undefined, action)
      )
      return newState
    }

    else if(action.type === 'LIST_REMOVE') {
      const idx = finder(action.key, state)
      if(idx >= 0) {
        let newState = state.slice()
        newState.splice(idx, 1)
        return newState
      } else {
        return state
      }
    }

    else if(action.path && !action.broadcast) {
      const key = currentField(action)
      const idx = finder(key, state)
      if(idx >= 0) {
        let newState = state.slice()
        newState[idx] = model.update(state[idx], fieldDown(action))
        return newState
      }
      return state
    } else if(_update) {
      return _update(state, action)
    }

    return state.map(item => model.update(item, action))
  }

  function itemSelector(key, select) {
    return () => {
      const state = select()
      const idx = finder(key, state)
      if(idx >= 0)
        return state[idx]
    }
  }

  const listActions = assign({}, {
    add: (...args) => ({ type: 'LIST_ADD', args }),
    remove: key => ({ type: 'LIST_REMOVE', key })
  }, actions)

  function connectAt(key, select, dispatch, path) {
    const itemPath = push(path, key)

    return model.connect(
      itemSelector(key, select),
      dispatch,
      itemPath
    )
  }

  const connectedByKey = {}
  const listModel = modelOf({ update, actions: listActions, views, render })
  const baseConnect = listModel.connect
  listModel.connect = (select, dispatch, path=[]) => {
    const dataset = baseConnect(select, dispatch, path)
    dataset.get = key => {
      if(connectedByKey[key])
        return connectedByKey[key]

      const ds = connectedByKey[key] = connectAt(key, select, dispatch, path)
      ds.remove = () => dataset.remove(key)
      return ds
    }
    return dataset
  }


  return listModel
}
