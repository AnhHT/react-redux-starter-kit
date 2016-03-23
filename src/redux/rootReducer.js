import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import Todos from './modules/Todos'

const reducers = {
  counter: counter,
  router: router,
  todo: Todos
}

export default combineReducers(reducers)
