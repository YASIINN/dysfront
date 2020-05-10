import Vue from 'vue'
import axios from 'axios'
import {
  FETCH_ACTDIS_STUDENT,
  FETCH_ACTIVITY_GRADES_D,
  GET_ACTIVITIY_GRADES_D,
  SET_ACTIVITIY_GRADES_D,
  FETCH_STUDENT_DISCONT_STATUS,
  FETCH_STUDENT_FOR_D,
  FETCH_STUDENTS_D,
  GET_STUDENT_FOR_D,
  SET_STUDENT_FOR_D,
  GET_DISCONT_STUDENTS,
  CREATE_DISCONT,
  DELETE_DISCONT,
  FETCH_ALL_DISCONT,
  SET_DISCONT,
  FETCH_DISCONT,
  FETCH_ASELECTEDPROGRAM_STUDENTS,
  FETCH_GETSTUDENT_DISCONT,
  GET_DISCONT,
  GET_DISCONT_HEADER,
  UPDATE_DISCONT,
  FETCH_SELECTEDPROGRAM_STUDENTS,
  SET_SELECTEDPROGRAM_STUDENTS,
  GET_SELECTEDPROGRAM_STUDENTS,
  SET_DISCONT_STUDENTS_LISTS,
  FETCH_ACTIVITY_GRADES_DP,
  GET_ACTIVITY_GRADES_DP, SET_ACTIVITY_GRADERS_DP,
  FETCH_GETSTUDENTS_DISCONTS_GP,
  GET_ACTIVITY_STUDENTS_GB,
  SET_ACTIVITIY_STUDENT_DP,
  SET_STUDENT_ACTIVITY_FORA,
  FETCH_STUDENTFOR_DISCONT_A,
  GET_STUDENTFOR_DA
} from './moduleNames'

const discontinuity = {
  state: {
    discontStudentsList: [],
    discontinuityList: [],
    selectedProgramStudentList: [],
    studentlistford: [],
    activityperiodsd: [],
    activityperiodsclass: [],
    studentlistfora: []
  },
  mutations: {
    [SET_STUDENT_ACTIVITY_FORA] (state, data) {
      state.studentlistfora = data
    },
    [SET_ACTIVITY_GRADERS_DP] (state, data) {
      state.activityperiodsclass = data
    },
    [SET_DISCONT] (state, data) {
      state.discontinuityList = data
    },
    [SET_SELECTEDPROGRAM_STUDENTS] (state, data) {
      state.selectedProgramStudentList = data
    },
    [SET_ACTIVITIY_GRADES_D] (state, data) {
      state.activityperiodsd = data
    },
    [SET_DISCONT_STUDENTS_LISTS] (state, data) {
      debugger
      state.discontStudentsList = data
    },
    [SET_STUDENT_FOR_D] (state, data) {
      debugger
      state.studentlistford = data
    }
  },
  actions: {
    [UPDATE_DISCONT] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/updateDiscont', updatedData)
          .then(response => {
            debugger
            if (response.status === 200) {
            }
            resolve(response)
          })
          .catch(err => {
            debugger
            resolve(err.message)
          })
      })

      return deferred
    },
    //getactivityWithClass

    [FETCH_ACTDIS_STUDENT] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/schooldastatusstudent', data).then((res) => {
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_STUDENTFOR_DISCONT_A] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/studentDiscontA', data).then((res) => {
          commit(SET_STUDENT_ACTIVITY_FORA, res.data)
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_ACTIVITY_GRADES_D] ({ commit, state }, data) {
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.get('/activityWithPeriods/' + data.id).then((res) => {
          commit(SET_ACTIVITIY_GRADES_D, res.data)
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },

    [FETCH_GETSTUDENTS_DISCONTS_GP] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/getAStudentsDiscont', data).then((res) => {
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_STUDENT_DISCONT_STATUS] ({ commit, state }, data) {
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/schooldstatusstudent', data).then((res) => {
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_STUDENTS_D] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/getAllStudents', data).then((res) => {
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_ACTIVITY_GRADES_DP] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/getActivityPerCls', data).then((res) => {
          debugger
          commit(SET_ACTIVITY_GRADERS_DP, res.data)
          resolve(res)
        }).catch((err) => {
          debugger
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_STUDENT_FOR_D] ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/studentDiscont', data).then((res) => {
          debugger
          commit(SET_STUDENT_FOR_D, res.data)
          resolve(res)
        }).catch((err) => {
          debugger
          resolve(err)
        })
      }))
      return deferred
    },
    /* */
    [DELETE_DISCONT] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/deleteDiscont', data)
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

    [FETCH_GETSTUDENT_DISCONT] ({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('getStudentsDiscont', data)
          .then(res => {
            console.log(res)
            debugger
            /*            let keys = Object.keys(res.data)
                        for (let i = 0; i < keys.length; i++) {
                          res.data[keys[i]].dtypefilter = { id: 0, dtName: 'Tümü' }
                        }*/
            debugger
            commit(SET_DISCONT_STUDENTS_LISTS, res.data)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            debugger
            resolve(err)
          })
      })
      return deferred
    },
    [FETCH_ASELECTEDPROGRAM_STUDENTS] ({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('getActivitySchoolClassBranchStudent', data)
          .then(res => {
            debugger

            res.data.forEach(item => {
              if (item.filter != undefined) {
                item.selectedDType = item.filter.d_type_id
              } else {
                item.selectedDType = 2

              }
            })
            commit(SET_SELECTEDPROGRAM_STUDENTS, res.data)
            resolve(res)
          })
          .catch(err => {
            debugger
            resolve(err)
          })
      })
      return deferred
    },

    [FETCH_SELECTEDPROGRAM_STUDENTS] ({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('getSchoolClassBranchStudent', data)
          .then(res => {
            debugger

            res.data.forEach(item => {
              if (item.filter != undefined) {
                item.selectedDType = item.filter.d_type_id
              } else {
                item.selectedDType = 2

              }
            })
            commit(SET_SELECTEDPROGRAM_STUDENTS, res.data)
            resolve(res)
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },

    [CREATE_DISCONT] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/createDiscont', data)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    async [FETCH_ALL_DISCONT] ({ commit, state, dipathc }) {
      let response = await axios.get('/getAllClases')
      if (response.status === 200) {
        commit(SET_CLASES, response.data)
      }
      return response
    },
    [FETCH_DISCONT] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post('/getClases', { urlparse: data.query }, data.httpOpt)
      } else {
        return axios.post('/getClases', {}, data.httpOpt)
      }
    }
  },
  getters: {
    [GET_DISCONT] (state) {
      return state.discontinuityList
    },
    [GET_SELECTEDPROGRAM_STUDENTS] (state) {
      return state.selectedProgramStudentList
    },
    [GET_DISCONT_STUDENTS] (state) {
      return state.discontStudentsList
    },
    [GET_STUDENT_FOR_D] (state) {
      return state.studentlistford
    },
    [GET_ACTIVITIY_GRADES_D] (state) {
      return state.activityperiodsd
    },
    [GET_ACTIVITY_GRADES_DP] (state) {
      return state.activityperiodsclass
    },
    [GET_STUDENTFOR_DA] (state) {
      return state.studentlistfora
    }

  }
}
export default discontinuity
