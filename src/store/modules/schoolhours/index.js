import axios from "axios";
import appPlugin from "@/Providers/appPlugins";
import {
  CREATE_SCHOOL_HOUR,
  DELETE_SCHOOL_HOUR,
  FETCH_SCHOOL_HOURS,
  GET_SCHOOL_HOUR_HEADER,
  GET_SCHOOL_HOUR_LLIST,
  SET_SCHOOL_HOUR,
  UPDATE_SCHOOL_HOUR
} from "./moduleNames";
import { UPDATE_TITLE } from "../titles/moduleNames";

const schoolhours = {
  state: {
    schoolHoursHeader: [
      {
        name: "Ders Adı",
        display: "shName"
      },
      {
        name: "Başlangıç Saati",
        display: "beginDate"
      },
      {
        name: "Bitiş Saati",
        display: "endDate"
      },
      {
        name: "",
        display: ""
      }
    ],
    schoolHoursList: []
  },
  mutations: {
    [SET_SCHOOL_HOUR](state, data) {
      state.schoolHoursList = data;
    }
  },
  actions: {
    [DELETE_SCHOOL_HOUR]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteSchoolHour", data)
          .then(response => {
            if (response.status === 200) {
              state.schoolHoursList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },

    [CREATE_SCHOOL_HOUR]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSchoolProgramHour", data)
          .then(res => {
            state.schoolHoursList = [...state.schoolHoursList, res.data];
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [UPDATE_SCHOOL_HOUR]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/updateSchoolHour/" + updatedData.id, updatedData)
          .then(response => {
            state.schoolHoursList[updatedData.index].shName =
              updatedData.shName;
            state.schoolHoursList[updatedData.index].beginDate =
              updatedData.begdt;
            state.schoolHoursList[updatedData.index].endDate =
              updatedData.enddt;
            //response.data;
            resolve(response);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },

    [FETCH_SCHOOL_HOURS]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/getSchoolHour", data)
          .then(res => {
            let sorted = appPlugin.sorttime(res.data);
            commit(SET_SCHOOL_HOUR, sorted);
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
    [GET_SCHOOL_HOUR_LLIST](state) {
      return state.schoolHoursList;
    },
    [GET_SCHOOL_HOUR_HEADER](state) {
      return state.schoolHoursHeader;
    }
  }
};
export default schoolhours;
