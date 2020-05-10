import axios from "axios";
import {
  FETCH_PROVIMCE,
  GET_PROVINCE,
  SET_PROVINCE,
  CREATE_PROVINCE,
  DELETE_PROVINCE,
  UPDATE_PROVINCE,
  GET_PROVINCE_HEADER,
  FETCH_ALL_PROVINCE
} from "./moduleNames";

const provinces = {
  state: {
    provinceList: [],
    provinceHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "pCode",
        title: '<i class="fas fa-lightbulb"></i>Branş Kodu'
      },
      {
        name: "pName",
        title: '<i class="far fa-file-alt"></i> Branş Adı'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_PROVINCE](state, data) {
      state.provinceList = data;
    }
  },
  actions: {
    [UPDATE_PROVINCE]({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put("/province/" + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.provinceList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.provinceList[i] = response.data;
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
    [DELETE_PROVINCE]({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete("/province/" + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.provinceList.splice(data.index, 1);
            }
            resolve(response);
          })
          .catch(err => {
            resolve();
          });
      });

      return deferred;
    },
    [CREATE_PROVINCE]({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post("/province", {
            name: data.created.name,
            code: data.created.code,
            urlparse: data.urlparse,
            orqparse: data.orqparse
          })
          .then(res => {
            if (res.status === 200) {
              state.provinceList = [...state.provinceList, res.data];
            }
            resolve(res);
          })
          .catch(err => {
            resolve(err.message);
          });
      });
      return deferred;
    },
    [FETCH_ALL_PROVINCE]({ commit, state, dispatch }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get("/getAllProvince")
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_PROVINCE, res.data);
                resolve(res.data);
              }
            }
          })
          .catch(err => {
            resolve(err);
          });
      });
      return deferred;
    },
    [FETCH_PROVIMCE]({ commit, state, dispatch }, data) {
      if (data) {
        if (data.query != "") {
          return axios.post(
            "/getProvinces",
            { urlparse: data.query },
            data.httpOpt
          );
        } else {
          return (data = axios.post("/getProvinces", {}, data.httpOpt));
        }
      }
    }
  },
  getters: {
    [GET_PROVINCE](state) {
      return state.provinceList;
    },
    [GET_PROVINCE_HEADER](state) {
      return state.provinceHeader;
    }
  }
};
export default provinces;
