import axios from "axios";
import store from "@/store";
export default {
    state: {
        clubptypes: [],
        clubptype: {},
    },
    mutations: {
      setClubPTypes(state, data){
          state.clubptypes = data;
      },
      setClubPType(state, data){
        state.clubptype = data;
      },
      updateClubPTypes(state, data){
        var index = state.clubptypes.indexOf(data);
        console.log(index);
        if (index > -1) {
            state.clubptypes.splice(index, 1);
        }
    },
    },
    actions: {
      async fetchClubPTypes({commit}, payload){
          let response = await axios.post("/getclubptype", payload);
          if (response.status === 200) {
            commit("setClubPTypes", response.data)
          } else {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
       },
       async createClubPType({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/createclubptype", payload);
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
      async deleteClubPType({commit}, payload){
        let result = 0;
        try {
          let response = await axios.delete("/deleteclubptype/"+payload.id);
          console.log(response);
          if(response.status === 200){
            commit("updateClubPTypes", payload)
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
        clubptypes: (state)=>state.clubptypes,
        clubptype: (state)=>state.clubptype,
    }
}
