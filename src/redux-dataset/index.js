
export { modelOf } from './modelOf'
export { listOf } from './listOf'
export { unionOf, caseOf } from './unionOf'
export { combineModels } from './combineModels'
export { byId, thunk, broadcast } from './utils'

export function connect(model, store) {
  return model.connect(store.getState, store.dispatch)
}
