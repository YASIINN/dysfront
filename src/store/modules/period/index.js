import axios from "axios";
import store from "@/store";
export default {
    state: {
       periods: [],
    },
    mutations: {
        setPeriods(state, data){
            state.periods = data;
        },
        editPeriods(state, data){
          let index = state.periods.findIndex(a=>a.id === data.id);
          state.periods[index] = data;
        },
        addPeriods(state, data){
            state.periods = [...state.periods, data];
        },
        deletePeriod(state, id){
           state.periods = state.periods.filter(a => a.id !== id)
        }
    },
    actions: {
        async fetchPeriods({commit}){
            let response = await axios.get("/period");
            if (response.status === 200) {
                console.log(response);
                commit("setPeriods", response.data);
              } else {
                console.log("hata");
              }
              return response;
        },
        async createPeriod({ commit}, data) {
          let result = 0;
          try {
            let response = await axios.post("/period", data);
            console.log(response);
            if(response.status === 201){
              commit("addPeriods", response.data);
              result = 1;
            } else if(response.status === 200){
              store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
          },
          
          async updatePeriod({ commit}, data) {
            let result = 0;
            try {
              let response = await axios.put("/period/"+ data.id, data);
              console.log(response);
              if(response.status === 201){
                commit("editPeriods", response.data);
                result = 1;
              } else if(response.status === 200){
                store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
            },
            async deletePeriod({commit}, id){
              let response = await axios.delete("/period/"+id);
              if(response.status  === 200){
                 commit("deletePeriod", id);
              }
            },
    },
    getters: {
       periods: (state)=>state.periods,
    }
}