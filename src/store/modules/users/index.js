import axios from 'axios'
import {
  FETCH_SCLUB_PROGRAM_D,
  FETCH_USER_SPORCLUB_PROGRAM,
  GET_USER_SPORCLUB_PROGRAM,
  SET_USER_SPORCLUB_PROGRAM,
  FETCH_ALL_USER_AND_STUDENT,
  FETCH_USER_WITH_LESSON,
  FETCH_USER_PROGRAM_TODAY,
  FETCH_ALL_USERS,
  FETCH_ALL_SCHOOL_PERSON,
  FETCH_ALL_USER_APROGRAM,
  GET_USER_PROGRAM,
  FETCH_ALL_USER_APROGRAM_TODAY,
  SET_USER_ACT_PROGRAMS,
  GET_ACTIVITY_USER_PROGRAM,
  UPDATE_USERS,
  CREATE_USERS,
  DELETE_USERS,
  FETCH_USERS,
  GET_USERS,
  GET_USERS_HEADER,
  FETCH_PERSONS_CLUB,
  SET_USERS,
  SHOW_USER,
  FETCH_USER_SCHOOL,
  FETCH_USER_LESSON,
  FETCH_USER_CLASES_SCHOOL,
  FETCH_USER_CLASES_BRANCHES,
  FETCH_PERSON_CLUB_TEAM,
  FETCH_PERSONS,
  DELETE_PERSONS,
  UPDATE_PERSONS,
  UPDATE_PERSON_IMAGE,
  FETCH_ALL_PERSONS_EXPORT_EXCEL,
  FETCH_USER_PROGRAM,
  FETCH_PERSONEL_STUDENTS,
  FETCH_ALL_USER_PROGRAM,
  SET_USER_PROGRAMS_ALL,
  UPDATE_PERSON_STATUS,
  FETCH_ACTIVITY_PROGRAM,
  SET_USER_SPORCLUB_PROGRAM_D,
  GET_USER_SPORCLUB_PROGRAM_D,
  FETCH_ALL_USERSSEARCH,
  FETCH_USER_STUDENTS,
  GET_USER_STUDENTS,
  SET_USER_STUDENTS
} from './moduleNames'
import appPlugin from '@/Providers/appPlugins'
import { SET_USER_SCHOOL_PROGRAM } from '../schoolprogram/moduleNames'

const users = {
  state: {
    userStudentList: [],
    userListHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'uCode',
        title: '<i class="fas fa-lightbulb"></i>Birim Kodu'
      },
      {
        name: 'uName',
        title: '<i class="far fa-file-alt"></i> Birim Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
    userList: [],
    userprogramslist: [],
    useractivityprogramlist: [],
    sporclubprogramd: []
  },
  mutations: {
    [SET_USER_STUDENTS] (state, data) {
      state.userStudentList = data
    },
    [SET_USERS] (state, data) {
      state.userList = data
    },
    [SET_USER_PROGRAMS_ALL] (state, data) {
      debugger;
      state.userprogramslist = data
    },
    [SET_USER_ACT_PROGRAMS] (state, data) {
      debugger;
      state.useractivityprogramlist = data
    },
    [SET_USER_SPORCLUB_PROGRAM_D] (state, data) {
      state.sporclubprogramd = data
    }
  },
  actions: {
    [DELETE_PERSONS] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/users/' + data.deleted.id)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [DELETE_USERS] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/units/' + data.deleted.id)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [SHOW_USER] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/user/' + data.id)
          .then(res => {
            if (res.status == 200) {
              res.data.forEach(item => {
                if (item.uBirthDay != '') {
                  item.age = appPlugin.getAge(new Date(item.uBirthDay))
                }
                item.age = ''
              })
              commit(SET_USERS, res.data)
            }
            resolve(res)
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },

    [FETCH_USER_WITH_LESSON] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getuserwithlesson', data)
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
    [UPDATE_PERSON_STATUS] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/updatePersonStatus/' + updatedData.id, updatedData)
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
    [UPDATE_PERSON_IMAGE] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/updateUserImage/' + updatedData.id, updatedData)
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
    [UPDATE_PERSONS] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/updatePersons/' + updatedData.id, updatedData)
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
      //
    },
    [UPDATE_USERS] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/units/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.unitsList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.unitsList[i] = response.data
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
    [CREATE_USERS] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/users', data)
          .then(response => {
            if (response.status === 200) {
              state.userList = [...state.userList, response.data]
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_SCLUB_PROGRAM_D] ({ commit, state }, data) {
      debugger;
      //TODO
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getSporClubUserProgram', data)
          .then(response => {
            commit(SET_USER_SPORCLUB_PROGRAM_D, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_USER_SPORCLUB_PROGRAM] ({ commit, state }, data) {
      debugger;
      //TODO
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/getSporClubUserProgram/' + data.id)
          .then(response => {
            commit(SET_USER_PROGRAMS_ALL, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_ALL_USER_APROGRAM] ({ commit, state }, data) {
      debugger;
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/getactivityUserProgram/' + data.id)
          .then(response => {
            commit(SET_USER_PROGRAMS_ALL, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_ALL_USER_PROGRAM] ({ commit, state }, data) {
      debugger;
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/getUserProgram/' + data.id)
          .then(response => {
            commit(SET_USER_PROGRAMS_ALL, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_ALL_USER_APROGRAM_TODAY] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getTodayActivityUserProgram', data)
          .then(response => {
            debugger;
            //dayname
            commit(SET_USER_ACT_PROGRAMS, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_ACTIVITY_PROGRAM] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getAcitivityUserProgram', data)
          .then(response => {
            commit(SET_USER_ACT_PROGRAMS, response.data)
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_USER_PROGRAM] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getUserProgram', data)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_PERSONEL_STUDENTS] ({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getPersonStudents', { userid: data.id })
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_ALL_USER_AND_STUDENT] ({}, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getAllStudentAndUsers', data)
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
    [FETCH_ALL_USERSSEARCH] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getAllUsers', data)
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

    [FETCH_PERSON_CLUB_TEAM] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          '/getUserSporClubTeam',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getUserSporClubTeam', {}, data.httpOpt)
      }
    },
    [FETCH_PERSONS_CLUB] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          '/getUserSporClub/' + data.id,
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getUserSporClub/' + data.id, {}, data.httpOpt)
      }
    },
    [FETCH_ALL_SCHOOL_PERSON] ({ commit }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getAllSchoolUser/' + data.id, { urlparse: data.query })
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            resolve([])
          })
      })
      return deferred
    },
    [FETCH_USER_SCHOOL] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post(
          '/getuserschool/' + data.id,
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getuserschool/' + data.id, {}, data.httpOpt)
      }
    },
    [FETCH_USER_CLASES_BRANCHES] ({ commit, state }, data) {
      if (data.query) {
        return axios.post(
          '/getuserschoolclasesbranches',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getuserschoolclasesbranches', {}, data.httpOpt)
      }
    },
    [FETCH_USER_STUDENTS] ({ commit, state }, data) {
      debugger;
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getPersonStudents', data)
          .then(response => {
            commit(SET_USER_STUDENTS, response.data)
            resolve(response)
          })
          .catch(err => {
            reject(err.message)
          })
      })
      return deferred
    },
    [FETCH_USER_PROGRAM_TODAY] ({ commit, state }, data) {
      debugger;
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/getUserSchoolProgramToday', data)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })
      return deferred
    },
    [FETCH_USER_CLASES_SCHOOL] ({ commit, state }, data) {
      if (data.query) {
        return axios.post(
          '/getuserschoolclases',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getuserlesson', {}, data.httpOpt)
      }
    },
    [FETCH_USER_LESSON] ({ commit, state }, data) {
      if (data.query) {
        return axios.post(
          '/getUserSchoolLessons',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getuserlesson/' + data.id, {}, data.httpOpt)
      }
    },
    [FETCH_ALL_PERSONS_EXPORT_EXCEL] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        if (data && data.query) {
          axios
            .post(
              '/getAllPersonsExportExcel',
              { urlparse: data.query },
              data.httpOpt
            )
            .then(res => {
              resolve(res.data)
            })
        } else {
          if (data && data.httpOpt) {
            axios
              .post('/getAllPersonsExportExcel', {}, data.httpOpt)
              .then(res => {
                resolve(res.data)
              })
          } else {
            axios.post('/getAllPersonsExportExcel', {}).then(res => {
              resolve(res)
            })
          }
        }
      })
      return deferred
    },
    [FETCH_PERSONS] ({ commit, state }, data) {
      if (data.query) {
        return axios.post(
          '/getPersons',
          { urlparse: data.query },
          data.httpOpt
        )
      } else {
        return axios.post('/getPersons', {}, data.httpOpt)
      }
    },
    [FETCH_USERS] ({ commit, state, dispatch }, data) {
      if (data.query) {
        return axios.post('/getUnits', { urlparse: data.query }, data.httpOpt)
      } else {
        return axios.post('/getUnits', {}, data.httpOpt)
      }
    }
  },
  getters: {
    [GET_USERS] (state) {
      return state.userList
    },
    [GET_USER_PROGRAM] (state) {
      return state.userprogramslist
    },
    [GET_USERS_HEADER] (state) {
      return state.unitsListHeader
    },
    [GET_ACTIVITY_USER_PROGRAM] (state) {
      return state.useractivityprogramlist
    },
    [GET_USER_SPORCLUB_PROGRAM_D] (state) {
      return state.sporclubprogramd
    },
    [GET_USER_STUDENTS] (state) {
      return state.userStudentList
    }
  }
}
export default users
