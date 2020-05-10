import axios from "axios";
import {
  FETCH_TITLES,
  GET_TITLES,
  SET_TITLE,
  CREATE_TITLES,
  UPDATE_TITLE,
  DELETE_TITLE,
  GET_TITLEHEADER,
  FETCH_ALL_TITLES
} from "./moduleNames";
const titles = {
  state: {
    titleListHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "tCode",
        title: '<i class="fas fa-lightbulb"></i>Ünvan Kodu'
      },
      {
        name: "tName",
        title: '<i class="far fa-file-alt"></i> Ünvan Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    titleList: []
  },
  mutations: {
    [SET_TITLE](state, data) {
      state.titleList = data;
    }
  },
  actions: {
    [DELETE_TITLE]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/title/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.titleList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [UPDATE_TITLE]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/title/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.titleList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.titleList[i] = response.data;
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
    [CREATE_TITLES]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/title", {
            name: data.created.name,
            code: data.created.code,
            urlparse: data.urlparse,
            orqparse: data.orqparse
          })
          .then(response => {
            if (response.status === 200) {
              state.titleList = [...state.titleList, response.data];
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_TITLES]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAlltitles")
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                commit(SET_TITLE, res.data);
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },
    [FETCH_TITLES]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post("/getTitles", { urlparse: data.query }, data.httpOpt);
      } else {
        return axios.post("/getTitles", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_TITLES](state) {
      return state.titleList;
    },
    [GET_TITLEHEADER](state) {
      return state.titleListHeader;
    }
  }
};
export default titles;
