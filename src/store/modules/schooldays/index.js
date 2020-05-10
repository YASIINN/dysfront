import axios from "axios";
import {
  CREATE_SCHOOL_DAYS,
  DELETE_SCHOOL_DAYS,
  FETCH_SCHOOL_DAYS,
  GET_SCHOOL_DAYS_HEADER,
  GET_SCHOOL_DAYS_LIST,
  SET_SCHOOL_DAYS,
  SHOW_SCHOOL_DAYS
} from "./moduleNames";

const schooldays = {
  state: {
    schoolDaysHeader: [
      {
        name: "Gün Adı",
        display: "sdName"
      },
      {
        name: "",
        display: ""
      }
    ],
    schoolDaysList: []
  },
  mutations: {
    [SET_SCHOOL_DAYS](state, data) {
      state.schoolDaysList = data;
    }
  },
  actions: {
    [DELETE_SCHOOL_DAYS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteSchoolDays", data)
          .then(response => {
            if (response.status === 200) {
              state.schoolDaysList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },

    [CREATE_SCHOOL_DAYS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSchoolProgramDays", data)
          .then(res => {
            //TODO 204 Bakılacak
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [SHOW_SCHOOL_DAYS]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/showSchoolProgramType/" + data.id)
          .then(res => {
            commit(SET_SCHOOL_DAYS, res.data);
            resolve(res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_DAYS]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("getSchoolDays", data)
          .then(res => {
            commit(SET_SCHOOL_DAYS, res.data);
            resolve(res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    }
  },
  getters: {
    [GET_SCHOOL_DAYS_LIST](state) {
      return state.schoolDaysList;
    },
    [GET_SCHOOL_DAYS_HEADER](state) {
      return state.schoolDaysHeader;
    }
  }
};
export default schooldays;
