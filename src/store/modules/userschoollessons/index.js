import axios from "axios";
import {
  SET_USER_SCHOOL_LESSONS,
  UPDATE_USER_SCHOOL_LESSONS,
  CREATE_USER_SCHOOL_LESSONS,
  DELETE_USER_SCHOOL_LESSONS,
  FETCH_USER_SCHOOL_LESSONS,
  GET_USER_SCHOOL_LESSONS,
  GET_USER_SCHOOL_LESSONS_HEADER,
  FETCH_ALL_SCHOOL_SCHOOL_LESSONS
} from "./moduleNames";

const userschoollessons = {
  state: {
    userSchoolLessonHeader: [
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
    userSchoolLessonList: []
  },
  mutations: {
    [SET_USER_SCHOOL_LESSONS](state, data) {
      //  state.unitsList = data
    }
  },
  actions: {
    [DELETE_USER_SCHOOL_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/userschoollessons/" + data.deleted.uslid)
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
    [UPDATE_USER_SCHOOL_LESSONS]({ commit, state }, updatedData) {
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
    [CREATE_USER_SCHOOL_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userschoollessons", data)
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
    [FETCH_ALL_SCHOOL_SCHOOL_LESSONS]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/getUserSchoolLesson", data)
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
    [FETCH_USER_SCHOOL_LESSONS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getUnits", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getUnits", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_USER_SCHOOL_LESSONS](state) {
      return state.userSchoolLessonList;
    },
    [GET_USER_SCHOOL_LESSONS_HEADER](state) {
      return state.userSchoolLessonHeader;
    }
  }
};
export default userschoollessons;
