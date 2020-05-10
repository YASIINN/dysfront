import axios from "axios";
import {
  CREATE_SC_BRANCHES,
  DELETE_SC_BRANCHES,
  FETCH_ALL_SC_BRANCHES,
  FETCH_SC_BRANCHES,
  GET_SC_BRANCHES,
  GET_SC_BRANCHES_HEADER,
  SET_SC_BRANCHES,
  UPDATE_SC_BRANCHES
} from "./moduleNames";

const scBranches = {
  state: {
    scBranchesHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "sbCode",
        title: '<i class="fas fa-lightbulb"></i>Şube Kodu'
      },
      {
        name: "sbName",
        title: '<i class="far fa-file-alt"></i> Şube Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    scBranchesList: []
  },
  mutations: {
    [SET_SC_BRANCHES](state, data) {
      state.scBranchesList = data;
    }
  },
  actions: {
    [DELETE_SC_BRANCHES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/deleteSporClubBranch/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [UPDATE_SC_BRANCHES]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/updateSporClubBranch/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_SC_BRANCHES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSporClubBranch", data)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_SC_BRANCHES]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllSporClubBranch")
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                commit(SET_SC_BRANCHES, res.data);
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },
    [FETCH_SC_BRANCHES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getSporClubBranch",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getSporClubBranch", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_SC_BRANCHES](state) {
      return state.scBranchesList;
    },
    [GET_SC_BRANCHES_HEADER](state) {
      return state.scBranchesHeader;
    }
  }
};
export default scBranches;
