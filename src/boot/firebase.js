import { boot } from 'quasar/wrappers'
import firebase from '/src/firebase'

export default boot(({ app }) => {
  app.config.globalProperties.$firebase = firebase
})
