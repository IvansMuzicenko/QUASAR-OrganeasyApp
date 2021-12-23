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
    if (userData && userData.tasks) {
      for (const [key, value] of Object.entries(userData.tasks)) {
        userData.tasks[key] = Object.values(value).sort(
          (a, b) =>
            a.time.slice(a.time.indexOf(' ')).replace(':', '.') -
            b.time.slice(b.time.indexOf(' ')).replace(':', '.')
        )
      }
    }
    if (userData && userData.processes) {
      userData.processes = Object.values(userData.processes).sort(
        (a, b) => a.time - b.time
      )
    }

    state.user.userData = userData
  },
  LOGOUT(state) {
    state.user.email = null
    state.user.userId = null
    state.user.userData = {}

    this.$router.push('/auth')
  },
  ADD_TASK(state, newTask) {
    state.user.userData.tasks[state.user.userData.tasks.length] = newTask
  },
  ADD_PROCESS(state, newProcess) {
    state.user.userData.tasks[state.user.userData.tasks.length] = newProcess
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
  }
}

const getters = {
  email: (state) => state.user.email,
  userId: (state) => state.user.userId,
  userData: (state) => state.user.userData,
  tasks: (state) => state.user?.userData?.tasks || {},
  notes: (state) => state.user?.userData?.notes || {},
  processes: (state) => state.user?.userData?.processes || {}
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
