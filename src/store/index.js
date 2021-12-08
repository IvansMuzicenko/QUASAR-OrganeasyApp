import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import users from './users'
import notification from './notification'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      users,
      notification
    },
    strict: process.env.DEBUGGING
  })

  return Store
})
