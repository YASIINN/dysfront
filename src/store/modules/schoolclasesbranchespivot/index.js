import axios from "axios";
import Plugin from "@/Providers/appPlugins";
import {
  CREATE_SCHOOL_CLASES_BRANCHES_PIVOT,
  FETCH_SCHOOL_CLASES_BRANCHES_PIVOT,
  GET_SCHOOL_BRANCHES_CLASES_PIVOT,
  DELETE_SCHOOL_CLASES_BRANCHES_PIVOT,
  FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT,
  SET_SCHOOL_CLASES_BRANCHES,
  FETCH_ALL_SCHOOL_PROGRAM_CLASS_BRANCHES
} from "./moduleNames";

const schoolclasesbranchespivot = {
  state: {
    schoolclasesbranchesHeader: [
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
        name: "bName",
        title: '<i class="far fa-file-alt"></i> Şube Adı'
      },
      {
        name: "bCode",
        title: '<i class="far fa-file-alt"></i> Şube Kodu'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_SCHOOL_CLASES_BRANCHES](state, data) {}
  },
  actions: {
    [DELETE_SCHOOL_CLASES_BRANCHES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/schoolclasesbranchespivot/" + data.deleted.scbid)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            resolve();
          });
      });
      return deferred;
    },
    [CREATE_SCHOOL_CLASES_BRANCHES_PIVOT]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/schoolclasesbranchespivot", {
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

    [FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT](
      { commit, state, dispatch },
      data
    ) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/getAllSCB", data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            resolve(err);
          });
      });

      return deferred;
    },
    [FETCH_SCHOOL_CLASES_BRANCHES_PIVOT]({ commit, state, dispatch }, data) {
      if (data.urlparse) {
        return axios.post("/getSchoolBranchClases", data, data.httpOpt);
      } else {
        return (data = axios.post("/getSchoolBranchClases", {}, data.httpOpt));
      }
    }
  },
  getters: {
    [GET_SCHOOL_BRANCHES_CLASES_PIVOT](state) {
      return state.schoolclasesbranchesHeader;
    }
  }
};
export default schoolclasesbranchespivot;
