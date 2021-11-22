const state = () => {
  return {
    user: {
      email: null,
      userId: null,
      userData: {},
    },
  };
};

const actions = {
  setUser({ commit }, user) {
    commit("SET_USER", user);
  },
  setUserData({ commit }, userData) {
    commit("SET_USER_DATA", userData);
  },
  // addTask({ commit }, newTask) {
  //   commit("ADD_TASK", newTask);
  // },
  // addProcess({ commit }, newProcess) {
  //   commit("ADD_PROCESS", newProcess);
  // },
};

const mutations = {
  SET_USER(state, user) {
    state.user.userId = user.userId;
    state.user.email = user.email;
  },
  SET_USER_DATA(state, userData) {
    state.user.userData = userData;
    for (const task in state.user.userData.tasks) {
      state.user.userData.tasks[task] = state.user.userData.tasks[task].sort(
        function (a, b) {
          return (
            a.time.slice(a.time.indexOf(" ")).replace(":", ".") -
            b.time.slice(b.time.indexOf(" ")).replace(":", ".")
          );
        }
      );
    }
  },
  ADD_TASK(state, newTask) {
    state.user.userData.tasks[state.user.userData.tasks.length] = newTask;
  },
  ADD_PROCESS(state, newProcess) {
    state.user.userData.tasks[state.user.userData.tasks.length] = newProcess;
  },
};

const getters = {
  email: (state) => state.user.email,
  userId: (state) => state.user.userId,
  userData: (state) => state.user.userData,
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
