import { combineReducers } from 'redux'
import app from './app'
import counter from './counter'
import system from './system'
import banner from './banner'
import homework from './homework'
import course from './course'
import mine from './mine'
import user from './user'

export default combineReducers({
  app,
  counter,
  system,
  banner,
  homework,
  course,
  mine,
  user,
})
