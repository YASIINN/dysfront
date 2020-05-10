import axios from 'axios'
import {
  FETCH_ALL_BRANCHES,
  FETCH_BRANCHES,
  GET_BRANCHES,
  GET_BRANCHES_HEADER,
  CREATE_BRANCHES,
  DELETE_BRANCHES,
  SET_BRANCHES,
  UPDATE_BRANCHES
} from './moduleNames'

const branches = {
  state: {

    brancsList: [],
    brancsHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'bCode',
        title: '<i class="fas fa-lightbulb"></i>Şube Kodu'
      },
      {
        name: 'bName',
        title: '<i class="far fa-file-alt"></i> Şube Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_BRANCHES] (state, data) {
      state.brancsList = data
    },

  },
  actions: {

    async [UPDATE_BRANCHES] ({ commit, state }, updatedData) {
      
      let deferred = new Promise(((resolve, reject) => {
        axios.put('/branches/' + updatedData.id, updatedData).then((res) => {
          
          resolve(res)
          if (res.status === 200) {
            state.brancsList.forEach(((item, i) => {
              if (item.id === res.data.id) {
                state.brancsList[i] = res.data
              }
            }))
          }
        }).catch((err) => {
          
          resolve(err.message)
        })
      }))
      // let response = await axios.put('/lesson/' + updatedData.id, updatedData)

      return deferred
    },
    [DELETE_BRANCHES] ({ commit, state }, data) {
      
      let deferred = new Promise(((resolve, reject) => {
        axios.delete('/branches/' + data.deleted.id).then((response) => {
          if (response.status === 200) {
            resolve(response)
            state.brancsList.splice(data.index, 1)
          }
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    [CREATE_BRANCHES] ({ commit, state, dispatch }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/branches', {
          name: data.created.name,
          code: data.created.code,
          urlparse: data.urlparse
        }).then((res) => {
          if (res.status === 200) {
            
            state.brancsList = [...state.brancsList, res.data]
            resolve(res)
          } else if (res.status === 204) {
            resolve(res)
          }
        }).catch((err) => {
          
          resolve(err.message)
        })
      }))
      return deferred
    },
    async [FETCH_ALL_BRANCHES] ({ commit, state, dipathc }) {
      let response = await axios.get('/getAllBranches')
      if (response.status === 200) {
        commit(SET_BRANCHES, response.data)
      } else {

      }
      return response
    },
    [FETCH_BRANCHES] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          '/getBranches',
          { urlparse: data.query },
          data.httpOpt
        )

      } else {
        return axios.post('/getBranches', {}, data.httpOpt)
      }

    }

  },
  getters: {
    [GET_BRANCHES] (state) {
      return state.brancsList
    },
    [GET_BRANCHES_HEADER] (state) {
      return state.brancsHeader
    }
  }
}
export default branches
