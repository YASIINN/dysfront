import axios from "axios";
import store from "@/store";
export default {
    state: {
    },
    mutations: {

    },
    actions: {
      async fetchStudentList({commit}, payload){
            console.log(payload);
          let response = await axios.post("/studentlist", payload, payload.httpOpt);
          return response;
       },
       async createAssignStudent({commit}, payload){
        let result = 0;
        try {
          let response = await axios.post("/assignstudent", payload);
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
        async fetchAssignStudentList({commit}, payload){
          console.log(payload);
        let response = await axios.post("/assignstudentlist", payload, payload.httpOpt);
        return response;
      },
      async fetchEmployeeList({commit}, payload){
          let response = await axios.post("/employeelist", payload, payload.httpOpt);
          return response;
        },
        async fetchParentList({commit}, payload){
          console.log(payload);
          let response = await axios.post("/parentlist", payload, payload.httpOpt);
          console.log(response);
          return response;
        },
    },
    getters: {
    }
}