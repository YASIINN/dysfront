import axios from 'axios'
import {
  GET_DTYPE_HEADER,
  CREATE_DTYPE,
  DELETE_DTYPE,
  FETCH_DTYPE,
  GET_DTYPE,
  SET_DTYPE,
  UPDATE_DTYPE,
  FETCH_PDTYPE
} from './moduleNames'

const dType = {
  state: {
    dTypeList: [],
    dtypeHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'dtName',
        title: '<i class="fas fa-lightbulb"></i>Devamsızlık Türü '
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_DTYPE] (state, data) {
      state.dTypeList = data
    }
  },
  actions: {
    [UPDATE_DTYPE] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/updateDType/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [DELETE_DTYPE] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/deleteDType/' + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_PDTYPE] ({ commit }, data) {
      if (data.query) {
        return axios.post('/getAllDtypePagination', { urlparse: data.query }, data.httpOpt)
      } else {
        return axios.post('/getAllDtypePagination', {}, data.httpOpt)
      }
    },
    [FETCH_DTYPE] ({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('getDtype')
          .then(res => {
            commit(SET_DTYPE, res.data)
            resolve(res)
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },

    [CREATE_DTYPE] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/createDType', {
            name: data.created.name,
          })
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    }
  },
  getters: {
    [GET_DTYPE] (state) {
      return state.dTypeList
    },
    [GET_DTYPE_HEADER] (state) {
      return state.dtypeHeader
    }

  }
}
export default dType
