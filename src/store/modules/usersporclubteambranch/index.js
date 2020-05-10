import axios from "axios";
import {
  CREATE_USER_SPOR_CLUB_TEAMS,
  DELETE_USER_SPOR_CLUB_TEAMS,
  FETCH_USER_SPOR_CLUB_TEAMS,
  GET_USER_SPOR_CLUB_TEAMS,
  GET_USER_SPOR_CLUB_TEAMS_HEADER,
  SET_USER_SPOR_CLUB_TEAMS
} from "./moduleNames";

const usersporclubteam = {
  state: {
    userClubTeamHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "uCode",
        title: '<i class="fas fa-lightbulb"></i>Birim Kodu'
      },
      {
        name: "uName",
        title: '<i class="far fa-file-alt"></i> Birim Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userClubTeamList: []
  },
  mutations: {
    [SET_USER_SPOR_CLUB_TEAMS](state, data) {
      state.userClubTeamList = data;
    }
  },
  actions: {
    [DELETE_USER_SPOR_CLUB_TEAMS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteUserSporClubTeam", data)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_USER_SPOR_CLUB_TEAMS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addUserSporClubTeam", data)
          .then(response => {
            if (response.status === 200) {
              // state.unitsList = [...state.unitsList, response.data]
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_USER_SPOR_CLUB_TEAMS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USER_SPOR_CLUB_TEAMS](state) {
      return state.userClubTeamList;
    },
    [GET_USER_SPOR_CLUB_TEAMS_HEADER](state) {
      return state.userClubTeamHeader;
    }
  }
};
export default usersporclubteam;
