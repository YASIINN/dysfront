import axios from 'axios'
import {
  GET_POST_TAG_P,
  CREATE_POST_TAG,
  DELETE_POST_TAG,
  FETCH_ALL_POST_TAG,
  FETCH_POST_TAG,
  GET_POST_TAG,
  GET_POST_TAG_HEADER,
  SET_POST_TAG,
  UPDATE_POST_TAG
} from './moduleNames'

const posttag = {
  state: {
    postTagList: [],
    postTagHeader: [
      {
        name: 'Etiket Rengi',
        display: 'color'
      },
      {
        name: 'Etiket Adı',
        display: 'tagName'
      },
      {
        name: '',
        display: ''
      }
    ]
  },
  mutations: {
    [SET_POST_TAG] (state, data) {
      state.postTagList = data
    }
  },
  actions: {
    [UPDATE_POST_TAG] ({ commit, state }, updatedData) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/posttag/' + updatedData.id, updatedData)
          .then(response => {
            debugger
            if (response.status === 200) {
              state.postTagList.forEach((item, i) => {
                if (updatedData.id === response.data.id) {
                  state.postTagList[i] = response.data
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
    [DELETE_POST_TAG] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/posttag/' + data.id)
          .then(response => {
            if (response.status === 200) {
              state.postTagList.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            resolve()
          })
      })

      return deferred
    },
    [CREATE_POST_TAG] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/posttag', data)
          .then(res => {
            if (res.status === 200) {
              state.postTagList = [...state.postTagList, res.data]
            }
            resolve(res)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_ALL_POST_TAG] ({ commit, state, dispatch }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/posttag')
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_POST_TAG, res.data)
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
    [FETCH_POST_TAG] ({ commit, state, dispatch }, data) {
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
    [GET_POST_TAG] (state) {
      return state.postTagList
    },
    [GET_POST_TAG_HEADER] (state) {
      return state.postTagHeader
    },
    [GET_POST_TAG_P] (state) {
      state.postTagList.unshift({
        id: 0,
        tagName: 'Seçiniz'
      })
      return state.postTagList
    }
  }
}
export default posttag
