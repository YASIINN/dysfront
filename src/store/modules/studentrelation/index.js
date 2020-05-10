import axios from "axios";
import store from "@/store";
export default {
    state: {
       studentschool: [],
       studentactivities: [],
       studentclubs: [],
       schoolothers: [],
       assigningclubs: [],
       students: [],
    },
    mutations: {
        setStudentDetailModelKey(state, payload){
            state.studentdetail[payload.key] = payload.value;
        },
        setStudentDetail(state, data){
           state.studentdetail = data;
        },
        setSchoolOthers(state, data){
            state.schoolothers = data;
         },
         setAssigningClubs(state, data){
          state.assigningclubs = data;
       },
         setStudents(state, data){
             state.students = data;
         },
        setStudentSchool(state, data){
            state.studentschool = data;
        },
        updateStudentSchool(state, data){
            var index = state.studentschool.indexOf(data);
            console.log(index);
            if (index > -1) {
                state.studentschool.splice(index, 1);
            }
        },
        setStudentActivities(state, data){
            state.studentactivities = data;
        },
        setStudentClubs(state, data){
          state.studentclubs = data;
       },
        updateStudentActivities(state, data){
            var index = state.studentactivities.indexOf(data);
            console.log(index);
            if (index > -1) {
                state.studentactivities.splice(index, 1);
            }
        },
        updateStudentClubs(state, data){
          var index = state.studentclubs.indexOf(data);
          console.log(index);
          if (index > -1) {
              state.studentclubs.splice(index, 1);
          }
      }
    },
    actions: {
        fetchStudentss({commit}){
            return axios.get("student");
        },
        async fetchSchoolOthers({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/schoolothers", payload);
              if(response.status === 200){
                commit("setSchoolOthers", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async fetchAssigninClubs({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/getclubs", payload);
            if(response.status === 200){
              commit("setAssigningClubs", response.data);
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
      },
        async fetchStdActivities({commit}, payload){
          debugger
            let result = 0;
            try {
              let response = await axios.post("/getstudentactivities", payload);
              if(response.status === 200){
                debugger
                console.log(response.data);
                commit("setStudentActivities", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async createStdActivity({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/createstudentactivity", payload);
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
        async delStdActivity({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/delstudentactivity", payload);
              console.log(response);
              if(response.status === 200){
                store.commit("updateStudentActivities", payload);
                store.commit("setSucMessage", response.data.message);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async fetchStdSchool({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/getstudentschool", payload);
              if(response.status === 200){
                console.log(response.data);
                commit("setStudentSchool", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async createStdSchool({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/createstudentschool", payload);
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
          async delStdSchool({commit}, payload){
              let result = 0;
              try {
                let response = await axios.post("/delstudentschool", payload);
                console.log(response);
                if(response.status === 200){
                  store.commit("updateStudentSchool", payload);
                  store.commit("setSucMessage", response.data.message);
                  result = 1;
                }
              } catch (e) {
                store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
              }
              return result;
          },
          async createStdClub({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/createstudentclub", payload);
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
          async fetchStdClub({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/getstudentclubs", payload);
              if(response.status === 200){
                console.log(response.data);
                commit("setStudentClubs", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async delStdClub({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/delstudentclub", payload);
            console.log(response);
            if(response.status === 200){
              store.commit("updateStudentClubs", payload);
              store.commit("setSucMessage", response.data.message);
              result = 1;
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
      },
        async delActPerOther({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/actperdelother", payload);
            console.log(response);
            if(response.status === 200){
              store.commit("setSucMessage", response.data.message);
              result = 1;
            } else if(response.status === 202){
              store.commit("setErrMessage", response.data.message);
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
        }
    },
    getters: {
      studentschool: (state)=>state.studentschool,
      studentactivities: (state)=>state.studentactivities,
      studentclubs: (state)=>state.studentclubs,
      schoolothers: (state)=>state.schoolothers,
      assigningclubs: (state)=>state.assigningclubs,

    }
}
