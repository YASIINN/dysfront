import axios from "axios";
import {
  CREATE_SCHOOL_LESSONS_CLASES_PIVOT,
  FETCH_SCHOOL_LESSONS_CLASES_PIVOT,
  DELETE_SCHOOL_LESSONS_CLASES_PIVOT,
  SET_SCHOOL_LESSONS_CLASES_PIVOT,
  FETCH_ALL_EXCEL_EXPORT_DATA,
  GET_SCHOOL_LESSONS_CLASES_PIVOT_HEADER,
  GET_SCHOOL_LESSONS_CLASES_PIVOT
} from "./moduleNames";

const schoollessonclasespivot = {
  state: {
    schoollessonsclasesHeader: [
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
        name: "cName",
        title: '<i class="far fa-file-alt"></i> Sınıf Adı'
      },
      {
        name: "cCode",
        title: '<i class="far fa-file-alt"></i> Sınıf Kodu'
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
    [DELETE_SCHOOL_LESSONS_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/schoollessonclasespivot/" + data.deleted.slcid)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve();
          });
      });
      return deferred;
    },
    [CREATE_SCHOOL_LESSONS_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/schoollessonclasespivot", {
            dataList: data.created,
            urlparse: data.urlparse
            // urlparse: data.urlparse
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
    [FETCH_SCHOOL_LESSONS_CLASES_PIVOT]({ commit, state, dispatch }, data) {
      if (data.urlparse) {
        return axios.post("/getschoollessonclasespivot", data, data.httpOpt);
      } else {
        return (data = axios.post(
          "/getschoollessonclasespivot",
          {},
          data.httpOpt
        ));
      }
    }
  },
  getters: {
    [GET_SCHOOL_LESSONS_CLASES_PIVOT_HEADER](state) {
      return state.schoollessonsclasesHeader;
    }
  }
};
export default schoollessonclasespivot;
