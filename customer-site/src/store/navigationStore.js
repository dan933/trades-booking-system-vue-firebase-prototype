import { createStore } from "vuex";

export default createStore({
  state: {
    view: "landing",
  },
  mutations: {
    updateView(state, payload) {
      state.view = payload;
    },
  },
  actions: {},
  getters: {},
});
