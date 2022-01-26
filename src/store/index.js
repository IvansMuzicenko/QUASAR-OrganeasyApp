import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import users from './users'
import notification from './notification'
import categories from './categories'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      users,
      notification,
      categories
    },
    strict: process.env.DEBUGGING
  })

  return Store
})
