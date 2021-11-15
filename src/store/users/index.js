const state = () => {
  return {
    user: {
      userData: { email: null, userId: null },
      tasks: {},
      processes: {},
    },
  };
};

const actions = {
  setUser({ commit }, user) {
    commit("SET_USER", user);
  },
};

const mutations = {
  SET_USER(state, user) {
    state.user.userData.userId = user.userId;
    state.user.userData.email = user.email;
  },
};

const getters = {
  email: (state) => state.user.userData.email,
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
