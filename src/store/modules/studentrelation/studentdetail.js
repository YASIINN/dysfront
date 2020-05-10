import axios from "axios";
import store from "@/store";
import studentDetailModel from "@/store/model/studentDetailModel";
export default {
    state: {
       studentdetailmodel: studentDetailModel,
       studentdetail: [],
    },
    mutations: {
        setStudentDetailModelKey(state, payload){
            state.studentdetail[payload.key] = payload.value;
        },
        setStudentDetailModel(state, data){
          state.studentdetailmodel = data;
        },
        setStudentDetail(state, data){
           state.studentdetail = data;
        },
    },
    actions: {
        async getStudentDetail({commit}){
            let result = 0;
            try {
              let response = await axios.get("/getstudentdetails");
              if(response.status === 200){
                commit("setStudentDetail", response.data);
                result = 1;
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
        },
        async createStudentDetail({commit}, payload){
            let result = 0;
            try {
              let response = await axios.post("/createstudentdetails", payload);
              console.log(response);
              if(response.status === 201){
                store.commit("setSucMessage", "Öğrenci detay bilgileri başarıyla kaydedildi.");
                result = 1;
              } else if(response.status === 200){
                store.commit("setErrMessage", "Öğrenci detay kan grubu, boy ve kilo zorunlu alanlardır.");
              }
            } catch (e) {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
          },
    },
    getters: {
      studentdetail: (state)=>state.studentdetail,
      studentdetailmodel: (state)=>state.studentdetailmodel,
    }
}