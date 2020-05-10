import axios from "axios";
import store from "@/store";
export default {
    state: {
       activities: [],
       aperiods: [],
       aselected: "",
       actwithperiods: [],
    },
    mutations: {
        setActivities(state, data){
            state.activities = data;
        },
        setAperiods(state, data){
          state.aperiods = data;
        },
        setAcitivtySelected(state, data){
          state.aselected = data;
        },
        editActivities(state, data){
          let index = state.activities.findIndex(a=>a.id === data.id);
          state.activities[index] = data;
        },
        addActivities(state, data){
            state.activities = [...state.activities, data];
        },
        deleteActivity(state, id){
           state.activities = state.activities.filter(a => a.id !== id)
        }
    },
    actions: {
        async fetchActWithPeriods({commit}){
          let response = await axios.get("/actwithperiods");
          console.log(response);
        },
        async fetchAperiods({commit}, id){
          let response = await axios.get("/activity/"+id);
          if (response.status === 200) {
              commit("setAperiods", response.data);
            } else {
              console.log("hata");
            }
            return response;
        },
        async fetchActivities({commit}){
            let response = await axios.get("/activity");
            if (response.status === 200) {
                commit("setActivities", response.data);
              } else {

              }
              return response;
        },
        async createActPerPivot({ commit}, payload) {
          let result = 0;
          let response = await axios.post("/actperpivot", payload);
          console.log(response);
          if (response.status == 201) {
            result = 1;
            store.commit("setSucMessage", response.data.message);
            store.dispatch("fetchAperiods", payload.activity_id);
          } else {
            store.commit("setErrMessage", response.data.message)
          }
          return result;
        },
        async createActivity({ commit}, data) {
          let result = 0;
          try {
            let response = await axios.post("/activity", data);
            console.log(response);
            if(response.status === 201){
              commit("addActivities", response.data);
              result = 1;
            } else if(response.status === 200){
              store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
          },

          async updateActivity({ commit}, data) {
            let result = 0;
            try {
              let response = await axios.put("/activity/"+ data.id, data);
              console.log(response);
              if(response.status === 201){
                commit("editActivities", response.data);
                result = 1;
              } else if(response.status === 200){
                store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
            },
            async deleteActivity({commit}, id){
              let response = await axios.delete("/activity/"+id);
              if(response.status  === 200){
                 commit("deleteActivity", id);
              }
            },
          async deleteActivityPeriod({commit}, payload){
          console.log(payload);
           let response = await axios.post("/deleteactivityperiod", payload);
           let result = 0;
           console.log(response);
           if(response.status  === 200){
             result = 1;
             store.dispatch("fetchActivityPeriodList");
           }
           return result;
      },
    },
    getters: {
       activities: (state)=>state.activities,
       aperiods: (state)=>state.aperiods,
       aselected: (state)=>state.aselected
    }
}
