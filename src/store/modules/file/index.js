import axios from 'axios'
import {
  FETCH_ALL_FİLES,
  FETCH_FİLES,
  GET_FİLES,
  SET_FİLES,
  CREATE_FİLES,
  DELETE_FİLES,
  GET_FİLES_HEADER,
  UPDATE_FİLES,
  ADD_MULTIPLE_FILES
} from './moduleNames'

const files = {
  state: {
    fileList: [],
    fileHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'cCode',
        title: '<i class="fas fa-lightbulb"></i>Sınıf Kodu'
      },
      {
        name: 'cName',
        title: '<i class="far fa-file-alt"></i> Sınıf Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_FİLES] (state, data) {
      state.fileList = data
    }
  },
  actions: {
    [ADD_MULTIPLE_FILES] ({}, data) {
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios
          .post('/addmultiplefiles',data)
          .then(res => {
            debugger
            resolve(res)
          })
          .catch(err => {
            debugger
            resolve(err)
          })
      }))
      return deferred
    },
    test ({}, data) {
      debugger
      axios.post('/testet', data).then((res) => {
      debugger
      }).catch((err) => {
    debugger
      })
    },
    [DELETE_FİLES] ({ commit, state }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/deletefile/' + data.id)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },
    [UPDATE_FİLES] ({ commit, state }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/updatefile/' + data.get('id'), data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {

            if (response.status === 200) {
              //  state.clasesList = [...state.clasesList, response.data]
            }
            resolve(response)
          })
          .catch(err => {

            resolve(err.message)
          })
      })
      return deferred
    },
    [CREATE_FİLES] ({ commit, state, dispatch }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/files', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {

            if (response.status === 200) {
              //  state.clasesList = [...state.clasesList, response.data]
            }
            resolve(response)
          })
          .catch(err => {

            resolve(err.message)
          })
      })
      return deferred
    },
    async [FETCH_ALL_FİLES] ({ commit, state, dipathc }) {
    },
    [FETCH_FİLES] ({ commit, state, dispatch }, data) {
    }
  },
  getters: {
    [GET_FİLES] (state) {
      return state.fileList
    },
    [GET_FİLES_HEADER] (state) {
      return state.fileHeader
    }
  }
}
export default files
