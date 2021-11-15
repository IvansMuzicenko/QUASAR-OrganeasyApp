import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import users from "./users";

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      users,
    },
    strict: process.env.DEBUGGING,
  });

  return Store;
});
