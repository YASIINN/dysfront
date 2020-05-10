import axios from "axios";
import {
  FETCH_SCHOOLS,
  GET_SCHOOLS,
  GET_SCHOOLS_HEADER,
  CREATE_SCHOOLS,
  UPDATE_SCHOOLS,
  DELETE_SCHOOLS,
  SET_SCHOOLS,
  FETCH_ALL_SCHOOLS,
  FETCH_SCHOOL_PERSON,
  GET_SCHOOL_PERSON_HEADER,
  FETCH_SCHOOL_STUDENTS,
  GET_SCHOOL_STUDENTS_HEADER,
  FETCH_SCHOOL_STUDENTS_EXCEL_EXPORT,
  SHOW_SCHOOL
} from "./moduleNames";

const schools = {
  state: {
    schoolStudentHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "s_tc",
        title: '<i class="fas fa-lightbulb"></i>Öğrenci TC'
      },
      {
        name: "s_name",
        title: '<i class="fas fa-lightbulb"></i>Öğrenci Adı'
      },
      {
        name: "s_surname",
        title: '<i class="fas fa-graduation-cap"></i>Öğrenci  SoyAdı'
      },
      {
        name: "school_no",
        title: '<i class="fas fa-building"></i>Öğrenci Numarası'
      },
      {
        name: "cName",
        title: '<i class="fas fa-building"></i>Öğrenci Sınıfı'
      },
      {
        name: "bName",
        title: '<i class="fas fa-building"></i>Öğrenci Şubesi'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    schoolPersonHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "uName",
        title: '<i class="fas fa-lightbulb"></i>Personel Adı'
      },
      {
        name: "uSurname",
        title: '<i class="fas fa-graduation-cap"></i>Personel SoyAdı'
      },
      {
        name: "uPhone",
        title: '<i class="fas fa-building"></i>Telefon Numarası'
      },
      {
        name: "uEmail",
        title: '<i class="fas fa-building"></i>Email Adresi'
      }
      /*     {
             name: '__slot:actions',
             title: '<i class="fas fa-pen-fancy"></i>İşlemler'
           }*/
    ],
    schoolListHeader: [
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
      {
        name: "sName",
        title: '<i class="fas fa-graduation-cap"></i>Okul Adı'
      },
      {
        name: "studentCount",
        title: '<i class="fas fa-graduation-cap"></i>Öğrenci Sayısı'
      },
      {
        name: "get_companies.cName",
        title: '<i class="fas fa-building"></i>Firma Adı'
      },
      {
        name: "__slot:details",
        title: '<i class="fas fa-info"></i>Detaylar'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    schoolList: []
  },
  mutations: {
    [SET_SCHOOLS](state, data) {
      state.schoolList = data;
    }
  },
  actions: {
    [DELETE_SCHOOLS]({ commit, state }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/school/" + data.deleted.id)
          .then(response => {
            debugger
            if (response.status === 200) {
              if(state.schoolList.length>0){
                state.schoolList.splice(data.index, 1);
              }
            }
            resolve(response);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOL_STUDENTS_EXCEL_EXPORT]({}, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data.query) {
          axios
            .post("/getExcelStudentsData", { urlparse: data.query })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              resolve(err);
            });
        }
      });
      return deferred;
    },
    [FETCH_SCHOOL_STUDENTS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data.query) {
          axios
            .post("/getSchoolStudents", { urlparse: data.query }, data.httpOpt)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        } else {
          axios
            .post("/getSchoolStudents", data, data.httpOpt)
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
    [FETCH_SCHOOL_PERSON]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data.query) {
          axios
            .post(
              "/getschooluser/" + data.id,
              { urlparse: data.query },
              data.httpOpt
            )
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve(err);
            });
        } else {
          axios
            .post("/getschooluser/" + data.id, data)
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
    [UPDATE_SCHOOLS]({ commit, state }, updatedData) {
      const data = {
        name: updatedData.updated.name,
        code: updatedData.updated.code,
        cid: updatedData.updated.company,
        urlparse: updatedData.urlparse
      };
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/school/" + updatedData.updated.id, data)
          .then(response => {
            if (response.status === 200) {
              state.schoolList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.schoolList[i] = response.data;
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
    [CREATE_SCHOOLS]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/school", {
            name: data.created.name,
            code: data.created.code,
            cid: data.created.company,
            urlparse: data.urlparse,
            orqparse: data.orqparse
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [SHOW_SCHOOL]({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/showSchool/" + data.id)
          .then(res => {
            resolve(res.data);
            commit(SET_SCHOOLS, res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_ALL_SCHOOLS]({ commit }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("getAllSchool")
          .then(res => {
            commit(SET_SCHOOLS, res.data);
            resolve(res.data);
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_SCHOOLS]({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          "/getSchools",
          { urlparse: data.query },
          data.httpOpt
        );
      } else {
        return axios.post("/getSchools", {}, data.httpOpt);
      }
    }
  },
  getters: {
    [GET_SCHOOLS](state) {
      return state.schoolList;
    },
    [GET_SCHOOLS_HEADER](state) {
      return state.schoolListHeader;
    },
    [GET_SCHOOL_PERSON_HEADER](state) {
      return state.schoolPersonHeader;
    },
    [GET_SCHOOL_STUDENTS_HEADER](state) {
      return state.schoolStudentHeader;
    }
  }
};
export default schools;
