import axios from 'axios'
import {
  UPDATE_USER_SCHOOL_CLASES_BRANCHES,
  CREATE_USER_SCHOOL_CLASES_BRANCHES,
  DELETE_USER_SCHOOL_CLASES_BRANCHES,
  FETCH_ALL_USER_SCHOOL_CLASES_BRANCHES,
  FETCH_USER_SCHOOL_CLASES_BRANCHES,
  GET_USER_SCHOOL_CLASES_BRANCHES,
  GET_USER_SCHOOL_CLASES_BRANCHES_HEADER,
  SET_USER_SCHOOL_CLASES_BRANCHES
} from './moduleNames'

const userschoolclasesbranches = {
  state: {
    userschoolclasesbranchesHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'sCode',
        title: '<i class="fas fa-lightbulb"></i>Okul Kodu'
      },
      {
        name: 'sName',
        title: '<i class="fas fa-graduation-cap"></i>Okul Adı'
      },
      {
        name: 'cCode',
        title: '<i class="fas fa-lightbulb"></i>Sınıf Kodu'
      },
      {
        name: 'cName',
        title: '<i class="fas fa-graduation-cap"></i>Sınıf Adı'
      },
      {
        name: 'bCode',
        title: '<i class="fas fa-lightbulb"></i>Şube Kodu'
      },
      {
        name: 'bName',
        title: '<i class="fas fa-graduation-cap"></i>Şube Adı'
      },
      {
        name: '__slot:mainteacher',
        title: '<i class="fas fa-graduation-cap"></i>Sınıf Öğretmenliği'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userschoolclasesbranchesList: []
  },
  mutations: {
    [SET_USER_SCHOOL_CLASES_BRANCHES] (state, data) {
      //  state.unitsList = data
    }
  },
  actions: {
    [DELETE_USER_SCHOOL_CLASES_BRANCHES] ({ commit, state }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/userschoolclasesbranches/' + data.deleted.uscbid)
          .then(response => {
            if (response.status === 200) {
              // state.unitsList.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [UPDATE_USER_SCHOOL_CLASES_BRANCHES] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/units/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.unitsList[i] = response.data
                }
              })
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [CREATE_USER_SCHOOL_CLASES_BRANCHES] ({ commit, state }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/userschoolclasesbranches', data)
          .then(response => {

            if (response.status === 200) {
              // state.unitsList = [...state.unitsList, response.data]
            }
            resolve(response)
          })
          .catch(err => {

            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_ALL_USER_SCHOOL_CLASES_BRANCHES] ({ commit, state, dispathc }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/getAllUnits')
          .then(response => {
            if (response.status === 200) {
              commit(SET_UNITS, response.data)
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_USER_SCHOOL_CLASES_BRANCHES] ({ commit, state, dispatch }, data) {
      if (data.query) {

        return axios.post('/getUnits', { urlparse: data.query }, data.httpOpt)
      } else {
        return axios.post('/getUnits', {}, data.httpOpt)
      }
    }
  },
  getters: {
    [GET_USER_SCHOOL_CLASES_BRANCHES] (state) {
      return state.userschoolclasesbranchesList
    },
    [GET_USER_SCHOOL_CLASES_BRANCHES_HEADER] (state) {
      return state.userschoolclasesbranchesHeader
    }
  }
}
export default userschoolclasesbranches
