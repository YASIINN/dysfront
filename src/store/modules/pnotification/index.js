import axios from 'axios'
import {
  FETCH_PNOTIFICATION,
  GET_PNOTIFICATION,
  SET_PNOTIFICATION,
  FETCH_ALL_NOTIFICATION,
  GET_PNOTIFICATION_HEADER,
  FETCH_NEXT_NOTIFICATION,
  SET_PNOTIFICATION_READ
} from './moduleNames'

const pnotification = {
  state: {
    pnotificationList: [],
  },
  mutations: {
    [SET_PNOTIFICATION] (state, data) {
      state.pnotificationList = data
    }
  },
  actions: {
    [SET_PNOTIFICATION_READ] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/setRead', data)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                debugger
                let index=0;
                let pdata = state.pnotificationList.filter((item,i) => {
                  if (item.id == data.id) {
                    index=i;
                    return item
                  }
                  debugger
                })
                state.pnotificationList.splice(index,1)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            debugger
            reject(err)
          })
      })
      return deferred
    },
    [FETCH_NEXT_NOTIFICATION] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .post(data.url, data)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            debugger
            reject(err)
          })
      })
      return deferred
    },
    [FETCH_ALL_NOTIFICATION] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        debugger
        axios
          .post('/getAllNotification', data)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            debugger
            reject(err)
          })
      })
      return deferred
    },
    [FETCH_PNOTIFICATION] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        debugger
        axios
          .post('/getNotification', data)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_PNOTIFICATION, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            debugger
            reject(err)
          })
      })
      return deferred
    },
  },
  getters: {
    [GET_PNOTIFICATION] (state) {
      return state.pnotificationList
    },
  }
}
export default pnotification
