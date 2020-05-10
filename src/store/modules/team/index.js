import axios from "axios";
import {
  CREATE_TEAMS,
  DELETE_TEAMS,
  FETCH_ALL_TEAMS,
  FETCH_TEAMS,
  GET_TEAMS,
  GET_TEAMS_HEADER,
  SET_TEAMS,
  UPDATE_TEAMS
} from "./moduleNames";

const team = {
  state: {
    teamListHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "stCode",
        title: '<i class="fas fa-lightbulb"></i>Takım Kodu'
      },
      {
        name: "stName",
        title: '<i class="far fa-file-alt"></i> Takım Adı'
      },
      {
        name: "sporclub.scName",
        title: '<i class="far fa-file-alt"></i> Bağlı Olduğu Kulüp Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    teamList: []
  },
  mutations: {
    [SET_TEAMS](state, data) {
      state.teamList = data;
    }
  },
  actions: {
    [DELETE_TEAMS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/deleteTeams/" + data.deleted.id)
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
    [UPDATE_TEAMS]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/updateTeams/" + updatedData.updated.id, updatedData.updated)
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
    [CREATE_TEAMS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addTeams", data)
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
    [FETCH_ALL_TEAMS]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getallTeams")
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                commit(SET_TEAMS, res.data);
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },
    [FETCH_TEAMS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getTeams", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getTeams", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_TEAMS](state) {
      return state.teamList;
    },
    [GET_TEAMS_HEADER](state) {
      return state.teamListHeader;
    }
  }
};
export default team;
