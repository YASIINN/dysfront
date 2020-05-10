import axios from "axios";
import {
  CREATE_USER_SPOR_CLUB,
  DELETE_USER_SPOR_CLUB,
  FETCH_USER_SPOR_CLUB,
  GET_USER_SPOR_CLUB,
  GET_USER_SPOR_CLUB_HEADER,
  SET_USER_CLUB
} from "./moduleNames";

const usersporclub = {
  state: {
    userClubHeader: [
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
    userClubList: []
  },
  mutations: {
    [SET_USER_CLUB](state, data) {
      state.unitsList = data;
    }
  },
  actions: {
    [DELETE_USER_SPOR_CLUB]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteUserSporClub", data)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_USER_SPOR_CLUB]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addUserSporClub", data)
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
    [FETCH_USER_SPOR_CLUB]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USER_SPOR_CLUB](state) {
      return state.userClubList;
    },
    [GET_USER_SPOR_CLUB_HEADER](state) {
      return state.userClubHeader;
    }
  }
};
export default usersporclub;
