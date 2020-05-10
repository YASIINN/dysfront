import axios from "axios";
import {
  UPDATE_USERUTYPES,
  CREATE_USERUTYPES,
  DELETE_USERUTYPES,
  FETCH_ALL_USERUTYPES,
  FETCH_USERUTYPES,
  GET_USERUTYPES,
  GET_USERUTYPES_HEADER,
  SET_USERUTYPES
} from "./moduleNames";
const userutypes = {
  state: {
    userUTypesHeader: [
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
    userUTypesList: []
  },
  mutations: {
    [SET_USERUTYPES](state, data) {
      state.unitsList = data;
    }
  },
  actions: {
    [DELETE_USERUTYPES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/units/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [UPDATE_USERUTYPES]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/units/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.unitsList[i] = response.data;
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
    [CREATE_USERUTYPES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userutype", data)
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
    [FETCH_ALL_USERUTYPES]({ commit, state, dispathc }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllUnits")
          .then(response => {
            if (response.status === 200) {
              commit(SET_UNITS, response.data);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });

      return deferred;
    },
    [FETCH_USERUTYPES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USERUTYPES](state) {
      return state.userUTypesList;
    },
    [GET_USERUTYPES_HEADER](state) {
      return state.userUTypesHeader;
    }
  }
};
export default userutypes;
