import { combineReducers } from 'redux'

function wrapReducer(reducer, ns) {
  return (state, action) => {
    if(state === undefined)
      return reducer(undefined, action)
    if(action.ns && action.ns[0] === ns) {
      return reducer(state, unwrapAction(action))
    }
    return state
  }
}

function wrapActionCreator(ac, ns) {
  return (...args) => {
    const action = ac(...args)
    action.ns = action.ns ? ns.concat(action.ns) : ns
    return action
  }
}

function wrapActions(actions, prefix=[]) {
  const actionsWithNS = {}
  Object.keys(actions).forEach(actionKey => {
    const ac = actions[actionKey]
    if(typeof ac === 'function') {
      actionsWithNS[actionKey] = wrapActionCreator(actions[actionKey], prefix)
    } else {
      actionsWithNS[actionKey] = wrapActions(ac, prefix)
    }
  })
  return actionsWithNS
}

function unwrapAction(action) {
  action.ns = action.ns.slice(1)
  return action
}

export function combineModels(models) {
  const reducersWithNS = {}
  const actionsWithNS = {}

  Object.keys(models).forEach(key => {
    const [reducer, actions] = models[key]
    reducersWithNS[key] = wrapReducer(reducer, key)
    actionsWithNS[key] = wrapActions(actions, [key])
  })
  return [combineReducers(reducersWithNS), actionsWithNS]
}
