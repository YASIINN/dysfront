import axios from "axios";
import {
  CREATE_PROGRAM_TYPE,
  DELETE_PROGRAM_TYPE,
  FETCH_ALL_P_TYPES,
  GET_P_TYPE,
  GET_P_TYPE_HEADER,
  SET_P_TYPE,
  UPDATE_PROGRAM_TYPE
} from "./moduleNames";

const programtype = {
  state: {
    programTypeList: []
  },
  mutations: {
    [SET_P_TYPE](state, data) {
      state.programTypeList = data;
    }
  },
  actions: {
    [DELETE_PROGRAM_TYPE]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/school/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.schoolList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [UPDATE_PROGRAM_TYPE]({ commit, state }, updatedData) {
      const data = {
        name: updatedData.updated.name,
        code: updatedData.updated.code,
        cid: updatedData.updated.company,
        urlparse: updatedData.urlparse
      };
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/school/" + updatedData.updated.id, data)
          .then(response => {
            if (response.status === 200) {
              state.schoolList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.schoolList[i] = response.data;
                }
              });
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_PROGRAM_TYPE]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/school", {
            name: data.created.name,
            code: data.created.code,
            cid: data.created.company,
            urlparse: data.urlparse,
            orqparse: data.orqparse
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_P_TYPES]({ commit }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("getAllProgramTypes")
          .then(res => {
            commit(SET_P_TYPE, res.data);
            resolve(res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    }
  },
  getters: {
    [GET_P_TYPE](state) {
      return state.programTypeList;
    }
  }
};
export default programtype;
