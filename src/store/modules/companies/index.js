import axios from 'axios'
import {
  FETCH_COMPANIES,
  GET_COMPANIES,
  SET_COMPANIES,
  CREATE_COMPANIES,
  DELETE_COMPANOIES,
  UPDATE_COMPANIES,
  GET_COMPANIES_HEADER,
  FETCH_ALL_COMPANIES
} from './moduleNames'

const companies = {
  state: {

    companiesList: [],
    companiesHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'cName',
        title: '<i class="far fa-file-alt"></i> Şirket Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    [SET_COMPANIES] (state, data) {
      state.companiesList = data
    },

  },
  actions: {
    [UPDATE_COMPANIES] ({ commit, state }, updatedData) {
      let deferred = new Promise(((resolve, reject) => {
        axios.put('/companies/' + updatedData.id, updatedData).then((response) => {
          if (response.status === 200) {
            state.companiesList.forEach(((item, i) => {
              if (item.id === response.data.id) {
                state.companiesList[i] = response.data
              }
            }))
          }
          resolve(response)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    [DELETE_COMPANOIES] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.delete('/companies/' + data.deleted.id).then((response) => {
          if (response.status === 200) {
            state.companiesList.splice(data.index, 1)
          }
          resolve(response)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    [CREATE_COMPANIES] ({ commit, state, dispatch }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/companies', {
          name: data.created.name,
          urlparse: data.urlparse
        }).then((response) => {
          if (response.status === 200) {
            state.companiesList = [...state.companiesList, response.data]
          }
          resolve(response)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    async [FETCH_ALL_COMPANIES] ({ commit, state, dipathc }) {
      let response = await axios.get('/getAllCompanies')
      if (response.status === 200) {
        commit(SET_COMPANIES, response.data)
      }
      return response
    },
    [FETCH_COMPANIES] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          '/getCompanies',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getCompanies', {}, data.httpOpt)
      }
    }

  },
  getters: {
    [GET_COMPANIES] (state) {
      return state.companiesList
    },
    [GET_COMPANIES_HEADER] (state) {
      return state.companiesHeader
    }
  }
}
export default companies
