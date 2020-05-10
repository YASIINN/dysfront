import axios from 'axios'
import {
  CREATE_SCHOOL_P_TYPE,
  DELETE_SCHOOL_P_TYPE,
  FETCH_SCHOOL_P_TYPE,
  GET_SCHOOL_P_TYPE,
  GET_SCHOOL_P_TYPE_HEADER,
  SET_SCHOOL_P_TYPE,
  SHOW_SCHOOL_P_TYPE
} from './moduleNames'

const schoolprogramtype = {
  state: {

    SchoolProgramTypeHeader: [
      {
        name: 'Program  Adı',
        display: 'programtypename'
      },
      {
        name: 'Okul Adı',
        display: 'schoolname'
      },
      {
        name: '',
        display: ''
      }
    ],
    SchoolProgramTypeList: [],
  },
  mutations: {
    [SET_SCHOOL_P_TYPE] (state, data) {
      state.SchoolProgramTypeList = data
    }
  },
  actions: {
    [DELETE_SCHOOL_P_TYPE] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.delete('/deleteSchoolProgramType/' + data.id).then((response) => {
          if (response.status === 200) {
            state.SchoolProgramTypeList.splice(data.index, 1)
          }
          resolve(response)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },

    [CREATE_SCHOOL_P_TYPE] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/addSchoolProgramType', data).then((res) => {
          //TODO 204 Bakılacak
          resolve(res)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    [SHOW_SCHOOL_P_TYPE] ({ commit }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.get('/showSchoolProgramType/' + data.id).then((res) => {
          commit(SET_SCHOOL_P_TYPE, res.data)
          resolve(res.data)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_SCHOOL_P_TYPE] ({ commit }) {
      let deferred = new Promise(((resolve, reject) => {
        axios.get('getAllSchoolProgramTypes').then((res) => {
          commit(SET_SCHOOL_P_TYPE, res.data)
          resolve(res.data)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred

    },
  },
  getters: {
    [GET_SCHOOL_P_TYPE] (state) {
      return state.SchoolProgramTypeList
    },
    [GET_SCHOOL_P_TYPE_HEADER] (state) {
      return state.SchoolProgramTypeHeader
    }
  }
}
export default schoolprogramtype
