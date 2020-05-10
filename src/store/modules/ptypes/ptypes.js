import axios from "axios";
import store from "@/store";
export default {
    state: {
        ptypes: [],
        activityptypes: []
    },
    mutations: {
      setPTypes(state, data){
          state.ptypes = data;
      }
    },
    actions: {
      async fetchPTypes({commit}){
          let response = await axios.get("/ptypes");
          if (response.status === 200) {
            commit("setPTypes", response.data)
          }
       },
    },
    getters: {
        ptypes: (state)=>state.ptypes,
    }
}