import axios from 'axios'
const customgroup = {
  state: {

    customgroups: [],
    customGroupHeader: [
      {
        name: '__sequence',
        title: '#',
        titleClass: 'center aligned',
        dataClass: 'right aligned'
      },
      {
        name: 'name',
        title: '<i class="far fa-file-alt"></i> Grup Adı'
      },
      {
        name: '__slot:actions',
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ]
  },
  mutations: {
    setCustomGroups (state, data) {
      state.customgroups = data
    },

  },
  actions: {
      updateCustomGroup ({ commit, state }, updatedData) {
      let deferred = new Promise(((resolve, reject) => {
        axios.put('/customgroups/' + updatedData.id, updatedData).then((response) => {
          if (response.status === 200) {
            state.customgroups.forEach(((item, i) => {
              if (item.id === response.data.id) {
                state.customgroups[i] = response.data
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
    deleteCustomGroup ({ commit, state }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.delete('/customgroups/' + data.deleted.groupable_id).then((response) => {
          if (response.status === 200) {
            state.customgroups.splice(data.index, 1)
          }
          resolve(response)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    createCustomGroup ({ commit, state, dispatch }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/customgroups', data).then((response) => {
          if (response.status === 201) {
            state.customgroups = [...state.customgroups, response.data]
          }
          resolve(response)
        }).catch((err) => {
          resolve(err.message)
        })
      }))
      return deferred
    },
    async fetchCustomGroup({commit}, payload){
      let response = await axios.post("/customgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },

  },
  getters: {
    customgroups (state) {
      return state.customgroups
    },
    customgroupheader (state) {
      return state.customGroupHeader
    }
  }
}
export default customgroup
