
import { assign, push } from './utils'
import createSagaMiddleware from 'redux-saga'


export function modelOf({init, update: _update, actions = {}, views = {}, saga, render}) {

  const actionNames = Object.keys(actions)
  const viewNames = Object.keys(views)

  let update
  if(init) {
     update = (state, action) => state === undefined ? init() : _update(state, action)
  } else {
    update = _update
  }

  function connect (select, dispatch, path=[]) {
    const dataset = { pick: select }
    let sagaEmitter

    function modelDispatch(action) {
      action.path = path
      action.pathIndex = 0
      const res = dispatch(action)
      if(sagaEmitter)
        sagaEmitter(action)
      return res
    }

    if(update.fields) {
      Object.keys(update.fields).forEach(field => {
        const getFieldState = () => select()[field]
        const fieldModel = update.fields[field]
        dataset[field] = fieldModel.connect(
          getFieldState,
          dispatch,
          push(path, field)
        )
      })
    }

    actionNames.forEach(key => {
      const action = actions[key]
      dataset[key] = action.__thunk__
        ? action(dataset)
        : (...args) => modelDispatch(action(...args))
    })

    viewNames.forEach(key => {
      const view = views[key]
      dataset[key] = () => view(select())
    })
    console.log('connected!')

    if(saga) {

      sagaEmitter = createSagaMiddleware(saga)({getState: select, dispatch: modelDispatch})(()=>{})

    }

    return dataset
  }

  return assign({ init, update, render, connect }, actions, views)
}
