
const Any = () => true

function validate(value, contract) {
  if(contract === String)
    return typeof value === 'string'

  if(contract === Number)
    return typeof value === 'number'

  else
    return contract(value)
}

export function unionOf(union) {
  const res = {}
  const keys = Object.keys(union)
  const unionKey = keys.join('|')

  keys.forEach(type => {
    const contracts = union[type]
    res[type] = (...args) => {
      contracts.forEach((c, idx) => {
        if(!validate(args[idx], c))
          throw new Error(`Case Error: invalid argument passed to ${type} at position ${idx}`)
      })
      return {type, args, unionKey }
    }


  })


  res.caseOf = (action, cases) => {
    let handler, args
    if(action.unionKey === unionKey) {
      handler = cases[action.type] || cases._
      args = action.args
    } else {
      handler = cases._
      args = [action]
    }
    if(!handler)
      throw `Unkwon case action ${action}`

    return handler.apply(null, args)
  }

  return res
}
