import axios from "axios";
import actperpivotModel from "../../model/actperpivotModel";
import store from "@/store";
export default {
    state: {
       apdatas: [],
       apgrades: [],
       aplessons: [],
       appivotmodel: actperpivotModel,
      activityperiodlist: [],
    },
    mutations: {
         setActivityPeriodList(state, payload){
           state.activityperiodlist = payload;
         },
        setAPPivotModelKey(state, payload){
        state.appivotmodel[payload.key] = payload.value;
        },
        async setAPPivotModel(state, payload){
          state.appivotmodel = await payload;
        },
        setAPgrades(state, data){
          state.apgrades = data;
        },
        addAPgrades(state, data){
          state.apgrades = [...state.apgrades, data];
        },
        setAPlessons(state, data){
          state.aplessons = data;
      },
        setAPdatas(state, data){
            state.apdatas = data;
        },
        addAPdatas(state, data){
            state.apdatas = [...state.apdatas, data];
        }
    },
    actions: {
      async fetchActivityPeriodList({commit}){
        let result = 0;
        let response = await axios.get("/getaplist");
        if (response.status === 200) {
          commit("setActivityPeriodList", response.data);
          result = 1;
        } else {
          result = 0;
          store.commit("setErrMessage", "İşlem sırasında hata meydana geldi");
        }
        return result;
      },
        async fetchAPdatas({commit}, payload){
            let response = await axios.post("/actperothers", payload);
            if (response.status === 200) {
                console.log(response);
                commit("setAPdatas", response.data);
              } else {
                console.log("hata");
              }
              return response;
        },
        async fetchAPlessons({commit}, payload){
          let response = await axios.post("/actperlessons", payload);
          if (response.status === 200) {
              console.log(response);
              commit("setAPlessons", response.data);
            } else {
              console.log("hata");
            }
            return response;
      },
        async createActPerOther({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/actperstoremultiple", payload);
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
        },
        async createActPerLesson({commit}, payload){
          let result = 0;
          try {
            let response = await axios.post("/addactperlesson", payload);
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
        async deleteActPerLesson({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/deleteactperlesson", payload);
              console.log(response);
              if(response.status === 200){
                store.commit("setSucMessage", response.data.message);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
    },
    getters: {
      apdatas: (state)=>state.apdatas,
      appivotmodel: (state)=>state.appivotmodel,
      aplessons: (state)=>state.aplessons,
      activityperiodlist: (state)=>state.activityperiodlist,
    }
}
