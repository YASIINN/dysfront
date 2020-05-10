import axios from "axios";
import {
  CREATE_SPOR_CLUBS,
  DELETE_SPOR_CLUB,
  FETCH__ALL_SPOR_CLUB,
  FETCH_SPOR_CLUBS,
  GET_SPOR_CLUB,
  GET_SPOR_CLUB_HEADER,
  SET_SPOR_CLUB,
  UPDATE_SPOR_CLUB,
  SHOW_SPOR_CLUB,
  FETCH_SPOR_CLUB_USER,
  FETCH_SPOR_CLUB_STUDENTS,
  FETCH_ALL_SPOR_CLUB_STUDENTS_EXPORT,
  FETCH_ALL_SPOR_CLUB_PERSONS_EXPORT
} from "./moduleNames";

const sporclub = {
  state: {
    sporclubListHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "scName",
        title: '<i class="fas fa-lightbulb"></i>Spor Kulübü Kodu'
      },
      {
        name: "scCode",
        title: '<i class="far fa-file-alt"></i> Spor Kulübü  Adı'
      },
      {
        name: "get_companies.cName",
        title: '<i class="far fa-file-alt"></i> Bağlı Olduğu Firma'
      },
      {
        name: "__slot:details",
        title: '<i class="fas fa-pen-fancy"></i>Detaylar'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    sporClubList: []
  },
  mutations: {
    [SET_SPOR_CLUB](state, data) {
      state.sporClubList = data;
    }
  },
  actions: {
    [DELETE_SPOR_CLUB]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/sporclub/" + data.deleted.id)
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
    [UPDATE_SPOR_CLUB]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/updateSporClub/" + updatedData.updated.id, updatedData.updated)
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
    [CREATE_SPOR_CLUBS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addsporClub", data)
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

    [SHOW_SPOR_CLUB]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/showSporClub/" + data.id)
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },

    [FETCH__ALL_SPOR_CLUB]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllSporclub")
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                commit(SET_SPOR_CLUB, res.data);
                resolve(res.data);
              }
            }
          })
          .catch(err => {});
      });
      return deferred;
    },
    [FETCH_ALL_SPOR_CLUB_PERSONS_EXPORT]({ commit, state, dispatch }, data) {
      return axios.post("/getSporClubUserExport/" + data.id, {});
    },
    [FETCH_ALL_SPOR_CLUB_STUDENTS_EXPORT]({ commit, state, dispatch }, data) {
      return axios.post("/getAllStudentsExport", { clubid: data.id });
    },

    [FETCH_SPOR_CLUB_STUDENTS]({ commit, state, dispatch }, data) {
      if (data.fullname) {
        return axios.post(
          "/getSporClubStudents",
          { club_id: data.id, fullname: data.fullname },
          data.httpOpt
        );
      } else {
        return axios.post(
          "/getSporClubStudents",
          { club_id: data.id },
          data.httpOpt
        );
      }
    },
    [FETCH_SPOR_CLUB_USER]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getSporClubUser/" + data.id,
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getSporClubUser/" + data.id, {}, data.httpOpt);
      }
    },
    [FETCH_SPOR_CLUBS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getSporClubs",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getSporClubs", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_SPOR_CLUB](state) {
      return state.sporClubList;
    },
    [GET_SPOR_CLUB_HEADER](state) {
      return state.sporclubListHeader;
    }
  }
};
export default sporclub;
