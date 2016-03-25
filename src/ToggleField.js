
import { modelOf, unionOf } from './redux-dataset'

const actions = unionOf({
  Toggle: []
})

const update = (state = false, ac) => actions.caseOf(ac, {
  Toggle: () => !state,
  _: () => state
})


export default modelOf({ actions, update })
