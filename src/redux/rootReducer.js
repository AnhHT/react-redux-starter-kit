import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import { Todos as todo } from './modules/Todos'

export default combineReducers({
  counter,
  router,
  todo
})
