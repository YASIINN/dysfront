import axios from "axios";
import store from "@/store";
export default {
    state: {
        clubpdays: []
    },
    mutations: {
      setClubPDays(state, data){
          state.clubpdays = data;
      },
      updateClubPDays(state, data){
        var index = state.clubpdays.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.clubpdays.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchClubPDays({commit}, payload){
          let result = 0;
          let response = await axios.post("/getclubpdays", payload);
          console.log(response);
          if (response.status == 200) {
              result = 1;
              commit("setClubPDays", response.data);
            } else {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
       },
       async createClubPDays({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createclubpdays", payload);
          console.log(response);
          if(response.status === 201){
            store.commit("setSucMessage", response.data.message);
            result = 1;
          } else if(response.status === 200){
            store.commit("setErrMessage", response.data.message);
          }
        } catch (e) {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
        return result;
      },
      async deleteClubPDays({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteclubpdays/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateClubPDays", payload)
            result = 1;
          } else {
            store.commit("setErrMessage", response.data.message);
          }
        } catch (e) {
          store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
        }
        return result;
      },
    },
    getters: {
        clubpdays: (state)=>state.clubpdays,
    }
}
