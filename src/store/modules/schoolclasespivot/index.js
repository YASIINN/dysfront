import axios from "axios";
import {
  FETCH_SCHOOL_CLASES_PIVOT,
  GET_SCHOOL_CLASES_PIVOT,
  SET_SCHOOL_CLASES_PIVOT,
  FETCH_SCHOOL_CLASES_ALL,
  CREATE_SCHOOL_CLASES_PIVOT,
  DELETE_SCHOOL_CLASES_PIVOT,
  GET_SCHOOL_CLASES_PIVOT_HEADER,
  FETCH_ALL_SCHOOL_ALL_CLASES
} from "./moduleNames";

const schoolclasespivot = {
  state: {
    schoolclasesHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "sName",
        title: '<i class="fas fa-lightbulb"></i>Okul Adı'
      },
      {
        name: "sCode",
        title: '<i class="fas fa-lightbulb"></i>Okul Kodu'
      },
      {
        name: "cName",
        title: '<i class="far fa-file-alt"></i> Sınıf Adı'
      },
      {
        name: "cCode",
        title: '<i class="far fa-file-alt"></i> Sınıf Kodu'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    schoolClasesList: []
  },
  mutations: {
    [SET_SCHOOL_CLASES_PIVOT](state, data) {
      state.schoolClasesList = data;
    }
  },
  actions: {
    [DELETE_SCHOOL_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteschoolclasespivot/" + data.deleted.scid, {
            urlparse: data.urlparse
          })
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve();
          });
      });
      return deferred;
    },
    [FETCH_ALL_SCHOOL_ALL_CLASES]({ commit, state, dispatch }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllSchoolClases")
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_CLASES_ALL]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/getSchoolClases", {
            urlparse: data.urlparse
          })
          .then(res => {
            if (res.status === 200) {
              res.data.forEach(item => {
                item.cName = item.clases.cName;
                item.cCode = item.clases.cCode;
                item.id = item.clases.id;
              });
              commit(SET_SCHOOL_CLASES_PIVOT, res.data);
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_SCHOOL_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/schoolclasespivot", {
            school_id: data.school_id,
            clases_id: data.clases_id,
            urlparse: data.urlparse
            // urlparse: data.urlparse
          })
          .then(res => {
            if (res.status === 200) {
              //state.provinceList = [...state.provinceList, res.data]
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      if (data.urlparse) {
        return axios.post("/getschoolclasespivot", data, data.httpOpt);
      } else {
        return (data = axios.post("/getschoolclasespivot", {}, data.httpOpt));
      }
    }
  },
  getters: {
    [GET_SCHOOL_CLASES_PIVOT_HEADER](state) {
      return state.schoolclasesHeader;
    },
    [GET_SCHOOL_CLASES_PIVOT](state) {
      return state.schoolClasesList;
    }
  }
};
export default schoolclasespivot;
