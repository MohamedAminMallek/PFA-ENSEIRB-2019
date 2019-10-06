import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authtoken: ""
  },
  mutations: {
    LOGIN(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.authtoken = "";
    }
  },
  actions: {
    login(commit, token) {
      this.commit("LOGIN", token);
      localStorage.setItem("token", token);
    },
    logout() {
      this.commit("LOGOUT");
      localStorage.removeItem("token", token);
    },
    init(){
      const tokenLocalStorage = localStorage.getItem("token");
      if (tokenLocalStorage) {
        this.commit("LOGIN", tokenLocalStorage);
      }
    }
  },
  getters: {
    token: function(state) {
      return state.authtoken;
    }
  }
});
