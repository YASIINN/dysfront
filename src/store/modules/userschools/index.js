import axios from "axios";
import Plugin from "@/Providers/appPlugins";
import {
  UPDATE_USER_SCHOOL,
  CREATE_USER_SCHOOL,
  DELETE_USER_SCHOOL,
  FETCH_ALL_USER_SCHOOL,
  FETCH_USER_SCHOOL,
  GET_USER_SCHOOL,
  GET_USER_SCHOOL_HEADER,
  SET_USER_SCHOOL
} from "./moduleNames";
const userschools = {
  state: {
    userSchoolHeader: [
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
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userUTypesList: []
  },
  mutations: {
    [SET_USER_SCHOOL](state, data) {}
  },
  actions: {
    [DELETE_USER_SCHOOL]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteuserschool", {
            userid: data.userid,
            schoolid: data.schoolid,
            surlparse: data.surlparse,
            urlparse: data.urlparse
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
    [UPDATE_USER_SCHOOL]({ commit, state }, updatedData) {
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
    [CREATE_USER_SCHOOL]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userschool", data)
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
    [FETCH_ALL_USER_SCHOOL]({ commit, state, dispathc }, data) {
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
    [FETCH_USER_SCHOOL]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USER_SCHOOL](state) {
      return state.userUTypesList;
    },
    [GET_USER_SCHOOL_HEADER](state) {
      return state.userSchoolHeader;
    }
  }
};
export default userschools;
