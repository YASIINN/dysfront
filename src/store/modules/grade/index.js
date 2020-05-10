import axios from "axios";
import store from "@/store";
export default {
    state: {
       grades: [],
    },
    mutations: {
        setGrades(state, data){
            state.grades = data;
        },
        editGrades(state, data){
          let index = state.grades.findIndex(a=>a.id === data.id);
          state.grades[index] = data;
        },
        addGrade(state, data){
            state.grades = [...state.grades, data];
        },
        deleteGrade(state, id){
           state.grades = state.grades.filter(a => a.id !== id)
        }
    },
    actions: {
        async fetchGrades({commit}){
            let response = await axios.get("/grade");
            if (response.status === 200) {
                console.log(response);
                commit("setGrades", response.data);
              } else {
                console.log("hata");
              }
              return response;
        },
        async createGrade({ commit}, data) {
          let result = 0;
          try {
            let response = await axios.post("/grade", data);
            console.log(response);
            if(response.status === 201){
              commit("addGrade", response.data);
              result = 1;
            } else if(response.status === 200){
              store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
          },
          
          async updateGrade({ commit}, data) {
            let result = 0;
            try {
              let response = await axios.put("/grade/"+ data.id, data);
              console.log(response);
              if(response.status === 201){
                commit("editGrades", response.data);
                result = 1;
              } else if(response.status === 200){
                store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
            },
            async deleteGrade({commit}, id){
              let response = await axios.delete("/grade/"+id);
              if(response.status  === 200){
                 commit("deleteGrade", id);
              }
            },
    },
    getters: {
       grades: (state)=>state.grades,
    }
}