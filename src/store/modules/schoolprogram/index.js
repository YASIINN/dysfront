import axios from "axios";
import {
  CREATE_SCHOOL_PROGRAM,
  DELETE_SCHOOL_PROGRAM,
  FETCH_ALL_SCHOOL_PROGRAM,
  FETCH_SCHOOL_PROGRAM,
  GET_SCHOOL_PROGRAM,
  GET_SCHOOL_PROGRAM_HEADER,
  SET_SCHOOL_PROGRAM,
  UPDATE_SCHOOL_PROGRAM,
  SET_USER_SCHOOL_PROGRAM,
  GET_USER_SCHOOL_PROGRAM,
  FETCH_USER_SCHOOL_PROGRAM
} from "./moduleNames";

const schoolprogram = {
  state: {
    schoolprogramheader: [
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
    ],
    userschoolprogramlist: [],
    schoolprogramlist: []
  },
  mutations: {
    [SET_SCHOOL_PROGRAM](state, data) {
      state.schoolprogramlist = data;
    },
    [SET_USER_SCHOOL_PROGRAM](state, data) {
      state.userschoolprogramlist = data;
    }
  },
  actions: {
    [DELETE_SCHOOL_PROGRAM]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/deleteSchoolProgram", {
            urlparse: data.urlparse
          })
          .then(response => {
            state.schoolprogramlist.splice(data.deletedIndex, 1);
            resolve(response);
          })
          .catch(err => {
            resolve();
          });
      });
      return deferred;
    },
    [UPDATE_SCHOOL_PROGRAM]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/updateSchoolProgram", data)
          .then(res => {
            if (res.status === 200) {
              state.schoolprogramlist[data.findexIndex].users = [];
              state.schoolprogramlist[data.findexIndex].lessons.lesson_id =
                data.lessonid;
              state.schoolprogramlist[data.findexIndex].lessons.lName =
                data.lName;
              state.schoolprogramlist[data.findexIndex];
              data.userData.forEach(item => {
                state.schoolprogramlist[data.findexIndex].users.push({
                  user_id: item.user_id,
                  uFullName: item.uFullName
                });
              });
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [CREATE_SCHOOL_PROGRAM]({ commit, state, dispatch }, data) {
      console.log("gelen", data);
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/addSchoolProgram", data)
          .then(res => {
            if (res.status === 200) {
              let userData = [];
              data.programUserData.forEach(item => {
                userData.push({
                  uFullName: item.uFullName,
                  user_id: item.user_id
                });
              });
              let schoolprogram = {
                scoolprogramcontentid: res.data.contentid,
                schoolprogramid: res.data.programid,
                school_id: data.schoolid,
                clases_id: data.classid,
                branches_id: data.branchid,
                school_p_type_id: data.ptypeid,
                school_day_id: data.programContentData[0].dayid,
                school_hour_id: data.programContentData[0].hourid,
                lessons: {
                  lesson_id: data.programContentData[0].lessonid,
                  lName: data.programContentData[0].lname
                },
                users: userData
              };
              state.schoolprogramlist = [
                ...state.schoolprogramlist,
                schoolprogram
              ];
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_SCHOOL_PROGRAM]({ commit, state, dispatch }, data) {
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
    [FETCH_USER_SCHOOL_PROGRAM]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/getUserSchoolProgram", data)
          .then(res => {
            commit(SET_USER_SCHOOL_PROGRAM, res.data);
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_PROGRAM]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("getSchoolClassProgram", data)
          .then(res => {
            commit(SET_SCHOOL_PROGRAM, res.data);
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    }
  },
  getters: {
    [GET_SCHOOL_PROGRAM_HEADER](state) {
      return state.schoolprogramheader;
    },
    [GET_SCHOOL_PROGRAM](state) {
      return state.schoolprogramlist;
    },
    [GET_USER_SCHOOL_PROGRAM](state) {
      return state.userschoolprogramlist;
    }
  }
};
export default schoolprogram;
