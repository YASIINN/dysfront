import axios from "axios";
import {
  CREATE_SC_TEAM_BRANCH,
  DELETE_SC_TEAM_BRANCH,
  FETCH_ALL_SC_TEAM_BRANCH,
  FETCH_SC_TEAM_BRANCH,
  GET_SC_TEAM_BRANCH,
  GET_SC_TEAM_BRANCH_HEADER,
  SET_SC_BTEAM_BRANCH,
  FETCH_ALL_SC_TEAM_EXCEL,
  DELETE_SC_TEAM_DELETE_STUDENTS,
  UPDATE_SC_TEAM_BRANCH
} from "./moduleNames";

const scTeamBranch = {
  state: {
    sctblistHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "scCode",
        title: '<i class="fas fa-lightbulb"></i>Kulüp Kodu'
      },
      {
        name: "scName",
        title: '<i class="far fa-file-alt"></i> Kulüp Adı'
      },
      {
        name: "stCode",
        title: '<i class="far fa-file-alt"></i>Takım Kodu'
      },
      {
        name: "stName",
        title: '<i class="far fa-file-alt"></i>Takım Adı'
      },
      {
        name: "sbCode",
        title: '<i class="far fa-file-alt"></i>Şube Kodu'
      },
      {
        name: "sbName",
        title: '<i class="far fa-file-alt"></i>Şube Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    sctbList: []
  },
  mutations: {
    [SET_SC_BTEAM_BRANCH](state, data) {
      state.teamList = data;
    }
  },
  actions: {
    [DELETE_SC_TEAM_DELETE_STUDENTS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteSCTeamBranchStudent", data)
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
    [DELETE_SC_TEAM_BRANCH]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteSCTeamBranch/" + data.deleted.sctbid, {})
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
    [CREATE_SC_TEAM_BRANCH]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSCTeamBranch", data)
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

    [FETCH_ALL_SC_TEAM_EXCEL]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllExport/" + data.id)
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },
    [FETCH_ALL_SC_TEAM_BRANCH]({ commit }, data) {
      if (data.query) {
        return axios.post(
          "/getAllSCTeam",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getAllSCTeam", {}, data.httpOpt);
      }
    },
    [FETCH_SC_TEAM_BRANCH]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getSCTeamBranch",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getSCTeamBranch", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_SC_TEAM_BRANCH](state) {
      return state.teamList;
    },
    [GET_SC_TEAM_BRANCH_HEADER](state) {
      return state.sctblistHeader;
    }
  }
};
export default scTeamBranch;
