import axios from "axios";
import store from "@/store";
export default {
    state: {
        clubpgrades: [],
        clubplessons: [],
        clubpteachers: [],
    },
    mutations: {
      setClubPGrades(state, data){
          state.clubpgrades = data;
      },
      setClubPLessons(state, data){
        state.clubplessons = data;
    },
    setClubPTeachers(state, data){
      state.clubpteachers = data;
    },
      updateClubPGrades(state, data){
        var index = state.clubpgrades.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.clubpgrades.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchClubPGrades({commit}, payload){
          let response = await axios.post("/getclubpgrades", payload);
          if (response.status === 200) {
            commit("setClubPGrades", response.data)
          } else {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
       },
       async fetchClubPLessons({commit}, payload){
        let response = await axios.post("/getclubplessons", payload);
        if (response.status === 200) {
          commit("setClubPLessons", response.data)
        } else {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
       },
       async fetchClubPTeachers({commit}, payload){
        let response = await axios.post("/getclubpteachers", payload);
        if (response.status === 200) {
          commit("setClubPTeachers", response.data)
        } else {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
       },
    },
    getters: {
        clubpgrades: (state)=>state.clubpgrades,
        clubplessons: (state)=>state.clubplessons,
        clubpteachers: (state)=>state.clubpteachers,
    }
}
