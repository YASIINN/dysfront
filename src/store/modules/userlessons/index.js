import axios from "axios";
import {
  UPDATE_USER_LESSONS,
  CREATE_USER_LESSONS,
  DELETE_USER_LESSONS,
  FETCH_ALL_USER_LESSONS,
  GET_USER_LESSONS,
  GET_USER_LESSONS_HEADER,
  SET_USER_LESSONS
} from "./moduleNames";

const userlessons = {
  state: {
    userLessonsHeader: [
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
      { name: "sName", title: '<i class="fas fa-lightbulb"></i>Okul Adı' },
      {
        name: "lCode",
        title: '<i class="fas fa-lightbulb"></i>Ders Kodu'
      },
      {
        name: "lName",
        title: '<i class="fas fa-graduation-cap"></i>Ders Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userLessonsList: []
  },
  mutations: {
    [SET_USER_LESSONS](state, data) {
      state.userLessonsList = data;
    }
  },
  actions: {
    [DELETE_USER_LESSONS]({ commit, state }, data) {
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
    [UPDATE_USER_LESSONS]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/units/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  //     state.unitsList[i] = response.data
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
    [CREATE_USER_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/userlessons", data)
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
    [FETCH_ALL_USER_LESSONS]({ commit, state, dispathc }, data) {
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
    }
  },
  getters: {
    [GET_USER_LESSONS](state) {
      return state.userLessonsList;
    },
    [GET_USER_LESSONS_HEADER](state) {
      return state.userLessonsHeader;
    }
  }
};
export default userlessons;
