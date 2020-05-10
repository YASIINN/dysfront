import axios from 'axios'
import {
  CREATE_HOMEWORK_TYPE,
  DELETE_HOMEWORK_TYPE,
  FETCH_ALL_HOMEWORK_TYPE,
  FETCH_HOMEWORK_TYPE,
  GET_HOMEWORK_TYPE,
  GET_HOMEWORK_TYPE_HEADER,
  SET_HOMEWORK_TYPE,
  UPDATE_HOMEWORK_TYPE,
  GET_HOME_WORK_TYPE_WSELECT
} from './moduleNames'

const homeworktype = {
  state: {
    homeworkTypeList: [],
    homeworkTypeHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'pCode',
        title: '<i class="fas fa-lightbulb"></i>Branş Kodu'
      },
      {
        name: 'pName',
        title: '<i class="far fa-file-alt"></i> Branş Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_HOMEWORK_TYPE] (state, data) {
      state.homeworkTypeList = data
    }
  },
  actions: {
    [UPDATE_HOMEWORK_TYPE] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/province/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.provinceList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.provinceList[i] = response.data
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
    [DELETE_HOMEWORK_TYPE] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/province/' + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.provinceList.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            resolve()
          })
      })

      return deferred
    },
    [CREATE_HOMEWORK_TYPE] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/province', {
            name: data.created.name,
            code: data.created.code,
            urlparse: data.urlparse,
            orqparse: data.orqparse
          })
          .then(res => {
            if (res.status === 200) {
              state.provinceList = [...state.provinceList, res.data]
            }
            resolve(res)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_ALL_HOMEWORK_TYPE] ({ commit, state, dispatch }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/homeworktype')
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_HOMEWORK_TYPE, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },
    [FETCH_HOMEWORK_TYPE] ({ commit, state, dispatch }, data) {
      if (data) {
        if (data.query != '') {
          return axios.post(
            '/getProvinces',
            { urlparse: data.query },
            data.httpOpt
          )
        } else {
          return (data = axios.post('/getProvinces', {}, data.httpOpt))
        }
      }
    }
  },
  getters: {
    [GET_HOMEWORK_TYPE] (state) {
      return state.homeworkTypeList
    },
    [GET_HOMEWORK_TYPE_HEADER] (state) {
      return state.homeworkTypeHeader
    },
    [GET_HOME_WORK_TYPE_WSELECT] (state) {
      state.homeworkTypeList.unshift({
        id: 0,
        hwtName: 'Seçiniz'
      })
      return state.homeworkTypeList
    }
  }
}
export default homeworktype
