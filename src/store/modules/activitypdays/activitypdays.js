import axios from "axios";
import store from "@/store";
export default {
    state: {
        activitypdays: []
    },
    mutations: {
      setActivityPDays(state, data){
          state.activitypdays = data;
      },
      updateActivityPDays(state, data){
        var index = state.activitypdays.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.activitypdays.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchActivityPDays({commit}, payload){
          let result = 0;
          let response = await axios.post("/getactivitypdays", payload);
          console.log(response);
          if (response.status == 200) {
              result = 1;
              commit("setActivityPDays", response.data);
            } else {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
       },
       async createActivityPDays({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createactivitypdays", payload);
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
      async deleteActivityPDays({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteactivitypdays/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateActivityPDays", payload)
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
        activitypdays: (state)=>state.activitypdays,
    }
}