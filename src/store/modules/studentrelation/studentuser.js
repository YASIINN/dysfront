import axios from "axios";
import store from "@/store";
import studentUserModel from "@/store/model/studentUserModel";
export default {
    state: {
       studentusermodel: studentUserModel,
       studentusers: [],
       proximities: [],
       users: [],
    },
    mutations: {
        setStudentUserModelKey(state, payload){
            state.studentusermodel[payload.key] = payload.value;
        },
        async setStudentUserModel(state, data){
           state.studentusermodel = await data
        },
        setUsers(state, data){
          state.users = data;
        },
        setStudentUsers(state, data){
           state.studentusers = data;
        },
        setProximities(state, data){
          state.proximities = data;
       },
    },
    actions: {
      async fetchAssigningUsers({commit}, payload){
          console.log(payload);
          let response = await axios.post("/searchusers", payload);
          console.log(response);
          return response;
       },
        async getStudentsOrUsers({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/getstudentsorusers", payload);
            if(response.status === 200){
              commit("setStudentUsers", response.data);
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
        },
        async assignStudentUser({}, payload){
          let result = 0;
          try {
            let response = await axios.post("/assignstudentuser", payload);
            if(response.status === 200){
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
        },
        async deleteStudentUser({}, payload){
          let result = 0;
          try {
            let response = await axios.post("/deletestudentuser", payload);
            if(response.status === 200){
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
        },
        async getStudentUser({commit}){
            let result = 0;
            try {
              let response = await axios.get("/getstudentusers");
              if(response.status === 200){
                commit("setStudentDetail", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async createStudentUsers({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/createstudentuser", payload);
              console.log(response);
              if(response.status === 201){
                commit("setStudentUserModelKey",{key: "id", value: response.data.id})
                store.commit("setSucMessage", "Kayıt başarıyla eklendi.");
                result = 1;
              }
              else if(response.status === 204){
                store.commit("setErrMessage", "Bu kayıt sistemde vardır. Tc, Email ve Tel alanları farklı olmalıdır");
              }
              else if(response.status === 200){
                store.commit("setErrMessage", response.data.message);
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
          },
          async updateStudentUsers({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/updatestudentuser", payload);
              console.log(response);
              if(response.status === 201){
                store.commit("setSucMessage", response.data.message);
                result = 1;
              }
              else if(response.status === 200){
                store.commit("setErrMessage", response.data.message);
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
          },
          async fetchProximities({commit}){
              let response = await axios.get("/proximities");
              commit("setProximities", response.data);
          },
          async saveUserImage({commit}, formData){
            console.log(formData);
            try {
              const response = await axios.post('/saveuserimage', formData, {headers: {'Content-Type': 'multipart/form-data'}});
              if(response.status === 201){
                console.log(response);
               commit("setStudentUserModelKey",{key: "file_id", value: response.data.id})
               commit("setStudentUserModelKey",{key: "file_path", value: response.data.path})
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
        }
    },
    getters: {
      studentusers: (state)=>state.studentusers,
      studentusermodel: (state)=>state.studentusermodel,
      proximities: (state)=>state.proximities,
      users: (state)=>state.users,
    }
}