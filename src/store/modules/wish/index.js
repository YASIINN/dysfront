import axios from "axios";
import {
  CREATE_WISHES,
  FETCH_WISHES,
  GET_WISHES,
  GET_WISHES_HEADER,
  SET_WISHES
} from "./moduleNames";

const wishes = {
  state: {
    wishesHeader: [
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
    wishesList: []
  },
  mutations: {
    [SET_WISHES](state, data) {
      state.wishesList = data;
    }
  },
  actions: {
    [CREATE_WISHES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/wish", data)
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
    [FETCH_WISHES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getwishes", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getwishes", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_WISHES](state) {
      return state.wishesList;
    },
    [GET_WISHES_HEADER](state) {
      return state.wishesHeader;
    }
  }
};
export default wishes;
