
import { assign, currentField, fieldDown } from './utils'

export function combineModels(model) {

  const fields = Object.keys(model)

  function updateField(state, field, fieldModel, action) {
    if(!fieldModel)
      error(`model has no field ${field}`)

    const fieldState = state !== undefined ? state[field] : undefined
    return fieldModel.update(fieldState, action)
  }

  function combinedUpdate(state, action) {
    //console.log(action)
    if(action.path && !action.broadcast) {
      const field = currentField(action)
      let newState = assign({}, state)
      newState[field] = updateField(state, field, model[field], fieldDown(action))
      return newState
    }

    else {
      let newState = assign({}, state)
      fields.forEach((field) => {
        newState[field] = updateField(state, field, model[field], action)
      })
      return newState
    }
  }

  combinedUpdate.fields = model

  return combinedUpdate
}
