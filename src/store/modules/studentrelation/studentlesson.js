import axios from "axios";
import store from "@/store";
export default {
    state: {
       studentlessons: [],
       studentmainlessons: {},
       activityperiodopt: {},
       schoolclassopt: {},
       activityperiod: {},
       schoolclass: {}
    },
    mutations: {
        setStudentLessons(state, data){
           state.studentlessons = data;
        },
        setStudentMainLessons(state, data){
            state.studentmainlessons = data;
        },
        setActivityPeriod(state, data){
            state.activityperiod = data;
        },
        setSchoolClass(state, data){
            state.schoolclass = data;
        },
        setActivityPeriodOpt(state, data){
            state.activityperiodopt = data;
        },
        setSchoolClassOpt(state, data){
            state.schoolclassopt = data;
        }
    },
    actions: {
        async fetchAPdifflessons({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("activitystudentdifflessons", payload);
              console.log(response);
              if(response.status === 200){
                commit("setActivityPeriod", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async fetchSCdifflessons({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("schoolstudentdifflessons", payload);
            console.log(response);
            if(response.status === 200){
              commit("setSchoolClass", response.data);
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
      },
        async fetchAssignLessons({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/studentlessons", payload);
              console.log(response);
              if(response.status === 200){
                commit("setStudentMainLessons", response.data);
                // commit("setActivityPeriod", response.data.actper);
                // commit("setSchoolClass", response.data.schoolclass);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async fetchAssignLessonsOpt({commit}, payload){
            console.log(payload);
            let result = 0;
            try {
              let response = await axios.post("/optinallessons", payload);
              if(response.status === 200){
                  console.log(response.data);
                commit("setActivityPeriodOpt", response.data.actper);
                commit("setSchoolClassOpt", response.data.schoolclass);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async getStudentLessons({commit}){
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
        async createStudentLessons({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/createstudentlessons", payload);
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
          async deleteStudentLessons({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/deletestudentlessons", payload);
              console.log(response);
              if(response.status === 200){
                result = 1;
                store.commit("setSucMessage", response.data.message);
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
          },
          async deleteStudentMultiLessons({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/deletestudentmultilessons", payload);
              console.log(response);
              if(response.status === 200){
                result = 1;
                store.commit("setSucMessage", response.data);
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
          },
          
    },
    getters: {
      studentlessons: (state)=>state.studentlessons,
      studentmainlessons: (state)=>state.studentmainlessons,
      activityperiod: (state)=>state.activityperiod,
      schoolclass: (state)=>state.schoolclass,
      activityperiodopt: (state)=>state.activityperiodopt,
      schoolclassopt: (state)=>state.schoolclassopt,
    }
}