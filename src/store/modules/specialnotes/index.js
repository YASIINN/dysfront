import axios from 'axios'
import {
  CREATE_USER_NOTES,
  DELETE_USER_NOTES,
  FETCH_USER_NOTES,
  GET_USER_NOTES,
  SET_USER_NOTES,
  UPDATE_USER_NOTES,
  SHOW_USER_NOTE,
  FETCH_NEXT_CONTACTS,
  FETCH_USER_MSG_BOX,
  DELETE_USER_MSG_BOX
} from './moduleNames'

const usernotes = {
  state: {
    userNotesList: []
  },
  mutations: {
    [SET_USER_NOTES] (state, data) {
      state.userNotesList = data
    }
  },
  actions: {

    [DELETE_USER_MSG_BOX]({},data){
      return new Promise(((resolve, reject) => {
        axios.post("/deleteusermsgbox", data).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }))
    },
    [FETCH_USER_MSG_BOX]({},data){
      return new Promise(((resolve, reject) => {
        axios.post("/usermsgbox", data).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }))
    },
    [FETCH_NEXT_CONTACTS] ({ commit, state, dispatch }, data) {
      //değişecek TODO
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post(data.url, data).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }))
      return deferred

    },
    [SHOW_USER_NOTE] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/showusermessage', data)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
      return deferred
    },
    [UPDATE_USER_NOTES] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/updatemessage', data)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
      return deferred
    },
    [DELETE_USER_NOTES] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/deletemessage/' + data.id)
          .then(response => {
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
      return deferred
    },
    [CREATE_USER_NOTES] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/createmessage', data)
          .then(response => {
            debugger
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            debugger
            reject(err.message)
          })
      })
      return deferred
    },

    [FETCH_USER_NOTES] ({ commit, state, dispatch }, data) {

      let deferred = new Promise(((resolve, reject) => {
        axios.post('/contactlist', data).then((res) => {
          commit(SET_USER_NOTES, res.data)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }))
      return deferred
    },
  },
  getters: {
    [GET_USER_NOTES] (state) {
      return state.userNotesList
    },
  }
}
export default usernotes
