import axios from "axios";
import {
  FETCH_LESSONS,
  GET_LESSONS,
  GET_LESSONS_HEADER,
  SET_LESSONS,
  CREATE_LESSONS,
  DELETE_LESSONS,
  UPDATE_LESSONS,
  FETCH_ALL_LESSONS,
  DELETE_SUB_LESSONS,
  ADD_SUB_LESSONS,
  UPDATE_SUB_LESSONS
} from "./moduleNames";

const lessons = {
  state: {
    lessonsList: [],
    lessonHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
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
        name: "type",
        title: '<i class="far fa-file-alt"></i> Ders Türü'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_LESSONS](state, data) {
      state.lessonsList = data;
    }
  },
  actions: {
    [UPDATE_SUB_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/updateSubLesson/" + data.id, data.data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    async [UPDATE_LESSONS]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/lesson/" + updatedData.id, updatedData)
          .then(res => {
            if (res.status === 200) {
              state.lessonsList.forEach((item, i) => {
                if (item.id === res.data.id) {
                  state.lessonsList[i] = res.data;
                }
              });
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      // let response = await axios.put('/lesson/' + updatedData.id, updatedData)

      return deferred;
    },
    [DELETE_SUB_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/deleteSubLesson/" + data.id)
          .then(response => {
            if (response.status === 200) {
              // state.lessonsList.splice(data.index, 1)
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [DELETE_LESSONS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/lesson/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              resolve(response);
              state.lessonsList.splice(data.index, 1);
            }
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [ADD_SUB_LESSONS]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSubLessons", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [CREATE_LESSONS]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        let lessonData;
        if (data.subData) {
          lessonData = {
            orqparse: data.orqparse,
            name: data.created.name,
            code: data.created.code,
            pid: 0,
            type: data.created.type,
            urlparse: data.urlparse,
            subData: data.subData
          };
        } else {
          lessonData = {
            orqparse: data.orqparse,
            name: data.created.name,
            code: data.created.code,
            pid: 0,
            type: 0,
            urlparse: data.urlparse
          };
        }

        axios
          .post("/lesson", lessonData)
          .then(res => {
            if (res.status === 200) {
              state.lessonsList = [...state.lessonsList, res.data];
              resolve(res);
            } else if (res.status === 204) {
              resolve(res);
            }
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    async [FETCH_ALL_LESSONS]({ commit, state, dipathc }) {
      let response = await axios.get("/getAllLessons");
      if (response.status === 200) {
        commit(SET_LESSONS, response.data);
      }
      return response;
    },
    [FETCH_LESSONS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getLesson", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getLesson", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_LESSONS](state) {
      return state.lessonsList;
    },
    [GET_LESSONS_HEADER](state) {
      return state.lessonHeader;
    }
  }
};
export default lessons;
