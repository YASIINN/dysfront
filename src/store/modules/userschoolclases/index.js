import axios from "axios";
import {
  SET_USER_SCHOOL_CLASES,
  CREATE_USER_SCHOOL_CLASES,
  DELETE_USER_SCHOOL_CLASES,
  FETCH_ALL_USER_SCHOOL_CLASES,
  FETCH_USER_SCHOOL_CLASES,
  GET_USER_SCHOOL_CLASES,
  GET_USER_SCHOOL_CLASES_HEADER,
  UPDATE_USER_SCHOOL_CLASES
} from "./moduleNames";

const userschoolclases = {
  state: {
    userschoolclasesHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "sCode",
        title: '<i class="fas fa-lightbulb"></i>Okul Kodu'
      },
      {
        name: "sName",
        title: '<i class="fas fa-graduation-cap"></i>Okul Adı'
      },
      {
        name: "cCode",
        title: '<i class="fas fa-lightbulb"></i>Sınıf Kodu'
      },
      {
        name: "cName",
        title: '<i class="fas fa-graduation-cap"></i>Sınıf Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userschoolclasesList: []
  },
  mutations: {
    [SET_USER_SCHOOL_CLASES](state, data) {}
  },
  actions: {
    [DELETE_USER_SCHOOL_CLASES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteuserschoolclases/" + data.deleted.uscid, {
            urlparse: data.query
          })
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
    [UPDATE_USER_SCHOOL_CLASES]({ commit, state }, updatedData) {
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
    [CREATE_USER_SCHOOL_CLASES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userschoolclases", data)
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
    [FETCH_ALL_USER_SCHOOL_CLASES]({ commit, state, dispathc }, data) {
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
    [FETCH_USER_SCHOOL_CLASES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USER_SCHOOL_CLASES](state) {
      return state.userschoolclasesList;
    },
    [GET_USER_SCHOOL_CLASES_HEADER](state) {
      return state.userschoolclasesHeader;
    }
  }
};
export default userschoolclases;
