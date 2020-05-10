import axios from 'axios'
import {
  CREATE_HOME_WORK_CATEGORY,
  DELETE_HOME_WORK_CATEGORY,
  FETCH_ALL_HOME_WORK_CATEGORY,
  FETCH_HOME_WORK_CATEGORY,
  GET_HOME_WORK_CATEGORY,
  GET_HOME_WORK_CATEGORY_HEADER, SET_HOME_WORK_CATEGORY, UPDATE_HOME_WORK_CATEGORY
} from './moduleNames'

const homeworkcategory = {
  state: {
    homeworkcatList: [],
    homeworkcatHeader: [
      {
        name: 'Ödev Türü Adı',
        display: 'hCatName'
      },
      {
        name: '',
        display: ''
      }
    ]
  },
  mutations: {
    [SET_HOME_WORK_CATEGORY] (state, data) {
      state.homeworkcatList = data
    }
  },
  actions: {
    [UPDATE_HOME_WORK_CATEGORY] ({ commit, state,dispatch }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/homeworkcategory/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.homeworkcatList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.homeworkcatList[i] = response.data
                }
              })
              dispatch(FETCH_HOME_WORK_CATEGORY)
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [DELETE_HOME_WORK_CATEGORY] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/homeworkcategory/' + data.id)
          .then(response => {
            if (response.status === 200) {
              state.homeworkcatList.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            resolve()
          })
      })

      return deferred
    },
    [CREATE_HOME_WORK_CATEGORY] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/homeworkcategory', data)
          .then(res => {
            if (res.status === 200) {
              state.homeworkcatList = [...state.homeworkcatList, res.data]
            }
            resolve(res)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_ALL_HOME_WORK_CATEGORY] ({ commit, state, dispatch }) {
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
    [FETCH_HOME_WORK_CATEGORY] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/homeworkcategory')
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_HOME_WORK_CATEGORY, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    }
  },
  getters: {
    [GET_HOME_WORK_CATEGORY] (state) {
      return state.homeworkcatList
    },
    [GET_HOME_WORK_CATEGORY_HEADER] (state) {
      return state.homeworkcatHeader
    },

  }
}
export default homeworkcategory
