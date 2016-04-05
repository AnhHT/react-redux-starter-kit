import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import Todos from './modules/Todos'
import fileTodo from './modules/fileTodo'

const reducers = {
  router: router,
  todo: Todos,
  fileTodo: fileTodo
}

export default combineReducers(reducers)
