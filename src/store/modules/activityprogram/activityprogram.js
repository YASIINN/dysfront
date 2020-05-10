import axios from "axios";
import store from "@/store";
export default {
    state: {
        activitypgrades: [],
        activityplessons: [],
        activitypteachers: [],
    },
    mutations: {
      setActivityPGrades(state, data){
          state.activitypgrades = data;
      },
      setActivityPLessons(state, data){
        state.activityplessons = data;
    },
    setActivityPTeachers(state, data){
      state.activitypteachers = data;
    },
      updateActivityPGrades(state, data){
        var index = state.activitypgrades.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.activitypgrades.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchActivityPGrades({commit}, payload){
          let response = await axios.post("/getactivitypgrades", payload);
          if (response.status === 200) {
            commit("setActivityPGrades", response.data)
          } else {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
       },
       async fetchActivityPLessons({commit}, payload){
        let response = await axios.post("/getactivityplessons", payload);
        if (response.status === 200) {
          commit("setActivityPLessons", response.data)
        } else {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
       },
       async fetchActivityPTeachers({commit}, payload){
        let response = await axios.post("/getactivitypteachers", payload);
        if (response.status === 200) {
          commit("setActivityPTeachers", response.data)
        } else {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
       },
    },
    getters: {
        activitypgrades: (state)=>state.activitypgrades,
        activityplessons: (state)=>state.activityplessons,
        activitypteachers: (state)=>state.activitypteachers,
    }
}