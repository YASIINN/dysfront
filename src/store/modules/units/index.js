import axios from "axios";
import {
  FETCH_ALL_UNITS,
  FETCH_UNITS,
  UPDATE_UNITS,
  DELETE_UNITS,
  GET_UNITS,
  GET_UNITS_HEADER,
  CREATE_UNITS,
  SET_UNITS
} from "./moduleNames";
const units = {
  state: {
    unitsListHeader: [
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
    unitsList: []
  },
  mutations: {
    [SET_UNITS](state, data) {
      state.unitsList = data;
    }
  },
  actions: {
    [DELETE_UNITS]({ commit, state }, data) {
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
    [UPDATE_UNITS]({ commit, state }, updatedData) {
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
    [CREATE_UNITS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/units", {
            name: data.created.name,
            code: data.created.code,
            orqparse: data.orqparse,
            urlparse: data.urlparse
          })
          .then(response => {
            if (response.status === 200) {
              state.unitsList = [...state.unitsList, response.data];
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_UNITS]({ commit }, data) {
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
    [FETCH_UNITS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_UNITS](state) {
      return state.unitsList;
    },
    [GET_UNITS_HEADER](state) {
      return state.unitsListHeader;
    }
  }
};
export default units;
