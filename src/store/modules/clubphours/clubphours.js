import axios from "axios";
import store from "@/store";
import appPlugin from "@/Providers/appPlugins";
export default {
    state: {
        clubphours: []
    },
    mutations: {
      setClubPHours(state, data){
          state.clubphours = data;
      },
      updateClubPHours(state, data){
        var index = state.clubphours.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.clubphours.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchClubPHours({commit}, payload){
          let result = 0;
          let response = await axios.post("/getclubphours", payload);
          console.log(response);
          if (response.status == 200) {
              result = 1;
              const sorted = appPlugin.sortclubtime(response.data);
              commit("setClubPHours", sorted);
            } else {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
       },
       async createClubPHours({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createclubphours", payload);
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
      async deleteClubPHours({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteclubphours/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateClubPHours", payload)
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
        clubphours: (state)=>state.clubphours,
    }
}
