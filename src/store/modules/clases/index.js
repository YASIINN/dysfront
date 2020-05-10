import axios from "axios";
import {
  FETCH_ALL_CLASES,
  FETCH_CLASES,
  GET_CLASES,
  GET_CLASES_HEADER,
  SET_CLASES,
  CREATE_CLASES,
  DELETE_CLASES,
  UPDATE_CLASES
} from "./moduleNames";

const clases = {
  state: {
    clasesList: [],
    clasesHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "cCode",
        title: '<i class="fas fa-lightbulb"></i>Sınıf Kodu'
      },
      {
        name: "cName",
        title: '<i class="far fa-file-alt"></i> Sınıf Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_CLASES](state, data) {
      state.clasesList = data;
    }
  },
  actions: {
    [UPDATE_CLASES]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/clases/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.clasesList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.clasesList[i] = response.data;
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
    [DELETE_CLASES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/clases/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.clasesList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_CLASES]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/clases", {
            name: data.created.name,
            code: data.created.code,
            orqparse: data.orqparse,
            urlparse: data.urlparse
          })
          .then(response => {
            if (response.status === 200) {
              state.clasesList = [...state.clasesList, response.data];
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });

      return deferred;
    },
    async [FETCH_ALL_CLASES]({ commit, state, dipathc }) {
      let response = await axios.get("/getAllClases");
      if (response.status === 200) {
        commit(SET_CLASES, response.data);
      }
      return response;
    },
    [FETCH_CLASES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getClases", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getClases", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_CLASES](state) {
      return state.clasesList;
    },
    [GET_CLASES_HEADER](state) {
      return state.clasesHeader;
    }
  }
};
export default clases;
