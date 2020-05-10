import axios from "axios";
import store from "@/store";
export default {
    state: {
        activityptypes: [],
        activityptype: {},
    },
    mutations: {
      setActivityPTypes(state, data){
          state.activityptypes = data;
      },
      setActivityPType(state, data){
        state.activityptype = data;
      },
      updateActivityPTypes(state, data){
        var index = state.activityptypes.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.activityptypes.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchActivityPTypes({commit}, payload){
          let response = await axios.post("/getactivityptype", payload);
          if (response.status === 200) {
            commit("setActivityPTypes", response.data)
          } else {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
       },
       async createActivityPType({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createactivityptype", payload);
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
      async deleteActivityPType({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteactivityptype/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateActivityPTypes", payload)
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
        activityptypes: (state)=>state.activityptypes,
        activityptype: (state)=>state.activityptype,
    }
}