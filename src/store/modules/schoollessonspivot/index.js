import axios from "axios";
import Plugin from "@/Providers/appPlugins";
import {
  FETCH_SCHOOL_LESSONS_PIVOT,
  GET_SCHOOL_LESSONS_PIVOT,
  GET_SCHOOL_LESSONS_PIVOT_HEADERS,
  FETCH_SCHOOL_LESSON_PROGRAM_DATA,
  CREATE_SCHOOL_LESSONS_PIVOT,
  DELETE_SCHOOL_LESSONS_PIVOT,
  SET_SCHOOL_LESSONS_PIVOT,
  UPDATE_SCHOOL_LESSONS_PIVOT,
  FETCH_SCHOOL_LESSONS_ALL
} from "./moduleNames";

const schoollessonspivot = {
  state: {
    schoollessonspivotheader: [
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
        name: "lName",
        title: '<i class="far fa-file-alt"></i> Ders Adı'
      },
      {
        name: "lCode",
        title: '<i class="far fa-file-alt"></i> Ders Kodu'
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
  mutations: {},
  actions: {
    [DELETE_SCHOOL_LESSONS_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteschoollessonspivot/" + data.deleted.slid, {
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
    [CREATE_SCHOOL_LESSONS_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/schoollessonspivot", {
            dataList: data.created,
            urlparse: data.urlparse
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
    [FETCH_SCHOOL_LESSONS_ALL]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("getAllSL", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_LESSON_PROGRAM_DATA]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("getallschoollessonspivot", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_LESSONS_PIVOT]({ commit, state, dispatch }, data) {
      if (data.urlparse) {
        return axios.post("/getschoollessonspivot", data, data.httpOpt);
      } else {
        return (data = axios.post("/getschoollessonspivot", {}, data.httpOpt));
      }
    }
  },
  getters: {
    [GET_SCHOOL_LESSONS_PIVOT_HEADERS](state) {
      return state.schoollessonspivotheader;
    }
  }
};
export default schoollessonspivot;
