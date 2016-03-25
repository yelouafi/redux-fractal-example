
export const assign = Object.assign

export function push(arr, item) {
  let newArr = arr.slice()
  newArr.push(item)
  return newArr
}

export function locateBy(predicate) {
  return (key, arr) => {
    for(let i = 0, len = arr.length; i < len; i++) {
      if(predicate(key, arr[i], i, arr))
        return i
    }
    return -1
  }
}

export const byId = locateBy((id, it) => it.id === id)

export const ident = v => v
export const error = (msg) => { throw new Error(msg) }

export const currentField = action => action.path[action.pathIndex]
export const fieldDown = action => {
  action.pathIndex++
  return action
}


export function thunk(th) {
  th.__thunk__ = true
  return th
}

export function broadcast(action) {
  action.broadcast = true
  return action
}
