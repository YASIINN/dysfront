import axios from "axios";
import { CREATE_PERSON_PASSWORD, FORGOT_PASSWORD } from "./moduleNames";

const userpassword = {
  state: {},
  mutations: {},
  actions: {
    [FORGOT_PASSWORD]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/forgotpassword", data)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_PERSON_PASSWORD]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userpassword", data)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    }
  },
  getters: {}
};
export default userpassword;
