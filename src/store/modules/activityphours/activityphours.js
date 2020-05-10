import axios from "axios";
import store from "@/store";
import appPlugin from "@/Providers/appPlugins";
export default {
    state: {
        activityphours: []
    },
    mutations: {
      setActivityPHours(state, data){
          state.activityphours = data;
      },
      updateActivityPHours(state, data){
        var index = state.activityphours.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.activityphours.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchActivityPHours({commit}, payload){
          let result = 0;
          let response = await axios.post("/getactivityphours", payload);
          console.log(response);
          if (response.status == 200) {
              result = 1;
              const sorted = appPlugin.sortactivitytime(response.data);
              commit("setActivityPHours", sorted);
            } else {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
       },
       async createActivityPHours({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createactivityphours", payload);
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
      async deleteActivityPHours({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteactivityphours/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateActivityPHours", payload)
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
        activityphours: (state)=>state.activityphours,
    }
}
