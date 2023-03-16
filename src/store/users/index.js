import { convertTimeToMinutes } from 'src/dateTimeHelper'
const state = () => {
  return {
    user: {
      email: null,
      userId: null,
      userData: {}
    }
  }
}

const mutations = {
  SET_USER(state, user) {
    state.user.userId = user.userId
    state.user.email = user.email
  },
  SET_USER_DATA(state, userData) {
    state.user.userData = userData
  },
  LOGOUT(state) {
    state.user.email = null
    state.user.userId = null
    state.user.userData = {}

    this.$router.push('/auth')
  },
  CHECKTIMELOGCROSSINGS(state) {
    for (const date of Object.keys(state.user.userData.timeLogs)) {
      const dateLogs = state.user.userData.timeLogs[date]
      let logs = Object.values(dateLogs).sort(
        (a, b) =>
          convertTimeToMinutes(a.timeFrom) - convertTimeToMinutes(b.timeFrom)
      )

      logs.forEach((el, index) => {
        let prevEl = logs[index - 1]
        if (
          prevEl &&
          convertTimeToMinutes(prevEl.timeFrom) <=
            convertTimeToMinutes(el.timeFrom) &&
          convertTimeToMinutes(prevEl.timeTo) >
            convertTimeToMinutes(el.timeFrom)
        ) {
          el.crossings = prevEl.crossings ? prevEl.crossings + 1 : 1
        }
      })
    }
  }
}

const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  setUserData({ commit }, userData) {
    commit('SET_USER_DATA', userData)
  },
  logout({ commit }) {
    commit('LOGOUT')
  },
  checkTimeLogCrossings({ commit }) {
    commit('CHECKTIMELOGCROSSINGS')
  }
}

const getters = {
  email: (state) => state.user.email,
  userId: (state) => state.user.userId,
  userData: (state) => state.user.userData,
  tasks: (state) => state.user?.userData?.tasks || {},
  freeTasks: (state) => state.user?.userData?.freeTasks || {},
  notes: (state) => state.user?.userData?.notes || {},
  processes: (state) => state.user?.userData?.processes || {},
  categories: (state) => state.user?.userData?.categories || {},
  timeLogs: (state) => state.user?.userData?.timeLogs || {}
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
