import axios from "axios";
import {
  GET_USER_RELATIONACTIVITY,
  FETCH_ACTIVITIES,
  SET_USER_RELATIONACTIVITY,
  GET_USER_ACTIVITY_INFO,
  DELETE_USER_ACTIVITY_WEEK,
  CREATE_USER_ACTIVITY,
  FETCH_ACTIVITY_WEEK_LESSONS,
  FETCH_ACTIVITY_INFO,
  CREATE_USER_ACTIVITY_PERIOD,
  CREATE_USER_ACTIVITY_CLASES,
  CREATE_USER_ACTIVITY_LESSONS,
  GET_USER_ACTIVITY_HEADER,
  FETCH_USER_ACTIVITY,
  FETCH_USER_ACTIVITY_WEEK,
  GET_USER_ACTIVITY_WEEK_HEADER,
  FETCH_USER_ACTIVITY_WEEK_LESSON,
  GET_USER_ACTIVITY_WEEK_LESSON_HEADER,
  GET_USER_ACTIVITY_WEEK_CLASES_HEADER,
  FETCH_USER_ACTIVITY_WEEK_CLASES,
  DELETE_USER_ACTIVITY_WEEK_CLASES,
  DELETE_USER_ACTIVITY_WEEK_LESSONS,
  DELETE_USER_ACTIVITY
} from "./moduleNames";

const userrelationactivity = {
  state: {
    userActivityRelationHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "aCode",
        title: '<i class="fas fa-lightbulb"></i>Faaliyet Kodu'
      },
      {
        name: "aName",
        title: '<i class="far fa-file-alt"></i> Faaliyet Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userActivityWeekRelationHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "aCode",
        title: '<i class="fas fa-lightbulb"></i>Faaliyet Kodu'
      },
      {
        name: "aName",
        title: '<i class="far fa-file-alt"></i> Faaliyet Adı'
      },
      {
        name: "pCode",
        title: '<i class="fas fa-lightbulb"></i>Dönem Kodu'
      },
      {
        name: "pName",
        title: '<i class="far fa-file-alt"></i> Dönem Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userActivityWeekLessonRelationHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "aCode",
        title: '<i class="fas fa-lightbulb"></i>Faaliyet Kodu'
      },
      {
        name: "aName",
        title: '<i class="far fa-file-alt"></i> Faaliyet Adı'
      },
      {
        name: "pCode",
        title: '<i class="fas fa-lightbulb"></i>Dönem Kodu'
      },
      {
        name: "pName",
        title: '<i class="far fa-file-alt"></i> Dönem Adı'
      },
      {
        name: "lCode",
        title: '<i class="fas fa-lightbulb"></i>Ders Kodu'
      },
      {
        name: "lName",
        title: '<i class="far fa-file-alt"></i> Ders Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userActivityWeekClasesRelationHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "aCode",
        title: '<i class="fas fa-lightbulb"></i>Faaliyet Kodu'
      },
      {
        name: "aName",
        title: '<i class="far fa-file-alt"></i> Faaliyet Adı'
      },
      {
        name: "pCode",
        title: '<i class="fas fa-lightbulb"></i>Dönem Kodu'
      },
      {
        name: "pName",
        title: '<i class="far fa-file-alt"></i> Dönem Adı'
      },
      {
        name: "gCode",
        title: '<i class="fas fa-lightbulb"></i>Sınıf Kodu'
      },
      {
        name: "gName",
        title: '<i class="far fa-file-alt"></i> Sınıf Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userActivityRelationList: []
  },
  mutations: {
    [SET_USER_RELATIONACTIVITY](state, data) {
      state.userActivityRelationList = data;
    }
  },
  actions: {
    [DELETE_USER_ACTIVITY]({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteActivityUser", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [DELETE_USER_ACTIVITY_WEEK]({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteActivityUserPeriod", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [DELETE_USER_ACTIVITY_WEEK_LESSONS]({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteActivityUserLessons", { urlparse: data.query })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [DELETE_USER_ACTIVITY_WEEK_CLASES]({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteActivityUserClases", { urlparse: data.query })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_ACTIVITY_INFO]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data.query) {
          axios
            .post("/getActivityInfo", { urlparse: data.query })
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        } else {
          axios
            .post("/getActivityInfo", {})
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        }
      });
      return deferred;
    },
    [FETCH_ACTIVITY_WEEK_LESSONS]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data.query) {
          axios
            .post("/getActivityWeekLesson", { urlparse: data.query })
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        } else {
          axios
            .post("/getActivityWeekLesson", {})
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        }
      });
      return deferred;
    },
    [CREATE_USER_ACTIVITY_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addActivityUserLessons", data)
          .then(res => {
            if (res.status === 200) {
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_USER_ACTIVITY_CLASES]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addActivityUserClases", data)
          .then(res => {
            if (res.status === 200) {
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_USER_ACTIVITY_PERIOD]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addActivityUserPeriod", data)
          .then(res => {
            if (res.status === 200) {
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_USER_ACTIVITY]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addActivityUser", data)
          .then(res => {
            if (res.status === 200) {
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_USER_ACTIVITY_WEEK_CLASES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getActivityUserClases",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getActivityUserClases", {}, data.httpOpt);
      }
    },

    [FETCH_USER_ACTIVITY_WEEK_LESSON]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getActivityUserLessons",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getActivityUserLessons", {}, data.httpOpt);
      }
    },
    [FETCH_USER_ACTIVITY_WEEK]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getActivityUserPeriod/" + data.id,
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post(
          "/getActivityUserPeriod/" + data.id,
          {},
          data.httpOpt
        );
      }
    },
    [FETCH_USER_ACTIVITY]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getActivityUser/" + data.id,
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getActivityUser/" + data.id, {}, data.httpOpt);
      }
    },
    [FETCH_ACTIVITIES]({ commit, state, dispatch }, data) {
      axios
        .get("/getAllActivityUserRelation")
        .then(res => {
          if (res.status) {
            if (res.status === 200) {
              commit(SET_USER_RELATIONACTIVITY, res.data);
            }
          }
        })
        .catch(err => {});
    }
  },
  getters: {
    [GET_USER_ACTIVITY_WEEK_HEADER](state) {
      return state.userActivityWeekRelationHeader;
    },
    [GET_USER_RELATIONACTIVITY](state) {
      return state.userActivityRelationList;
    },
    [GET_USER_ACTIVITY_HEADER](state) {
      return state.userActivityRelationHeader;
    },
    [GET_USER_ACTIVITY_WEEK_LESSON_HEADER](state) {
      return state.userActivityWeekLessonRelationHeader;
    },
    [GET_USER_ACTIVITY_WEEK_CLASES_HEADER](state) {
      return state.userActivityWeekClasesRelationHeader;
    }
  }
};
export default userrelationactivity;
