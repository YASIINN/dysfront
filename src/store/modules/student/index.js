import axios from "axios";
import store from "@/store";
import studentModel from "@/store/model/studentModel";
export default {
    state: {
       studentmodel: studentModel,
       students: [],
       student: {},
       filterdatas: []
    },
    mutations: {
        setStudentModelKey(state, payload){
            state.studentmodel[payload.key] = payload.value;
        },
        setFilterDatas(state, payload){
          state.filterdatas = payload;
        },
        setStudent(state, payload){
          state.student = payload;
        },
        setStudentModel(state, payload){
          state.studentmodel = payload;
        },
        setStudents(state, data){
            state.students = data;
        },
        editStudent(state, data){
          let index = state.students.findIndex(a=>a.id === data.id);
          state.students[index] = data;
        },
        addStudent(state, data){
            state.students = [...state.students, data];
        },
        deleteStudent(state, id){
           state.students = state.students.filter(a => a.id !== id)
        }
    },
    actions: {
      async fetchStudent({commit}, payload){
          let result = 0;
          let response = await axios.get("/student/"+payload.id);
          console.log(response);
          if (response.status == 200) {
              result = 1;
              commit("setStudent", response.data);
            } else {
              store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
            }
            return result;
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
        async fetchStudents({commit}, payload){
          let response = await axios.post("/test", payload, payload.httpOpt);
          return response;
        },
        async createStudent({ commit}, data) {
          let result = 0;
          try {
            let response = await axios.post("/student", data);
            console.log(response);
            if(response.status === 201){
              commit("setStudentModelKey",{key: "id", value: response.data.id})
              commit("addStudent", response.data);
              store.commit("setSucMessage", "Öğrenci başarıyla oluşturuldu");

              result = 1;
            } else if(response.status === 200){
              store.commit("setErrMessage", "Bu kayıt sistemde var.")
            }
          } catch (e) {
            store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
          }
          return result;
          },
          async updatestudentstatus({commit}, data){
           let response = await axios.put('/updatestudentstatus/' + data.id, data);
           if(response.status === 200){
               commit("setStudentModelKey",{key: "s_status", value: response.data.s_status})
           }
          },
          async updateStudent({ commit}, data) {
            let result = 0;
            try {
              let response = await axios.put("/student/"+ data.id, data);
              console.log(response);
              if(response.status === 201){
                store.commit("setSucMessage", "Öğrenci başarıyla güncellendi.")
                result = 1;
              } else if(response.status === 200){
                store.commit("setErrMessage", "Bu kayıt sistemde var. Lütfen isim ve kodu farklı bir faaliyet oluşturunuz.")
              }
            } catch (e) {
              store.commit("setErrMessage", e.message)
            }
            return result;
            },
            async deleteStudent({commit}, payload){
              let result = 0;
              let response = await axios.delete("/student/"+payload.id);
              if(response.status  === 200){
                result = 1;
              }
              return result;
            },
            async saveImage({commit}, formData){
              console.log(formData);
                try {
                  const response = await axios.post('/saveimage', formData, {headers: {'Content-Type': 'multipart/form-data'}});
                  if(response.status === 201){
                   commit("setStudentModelKey",{key: "file_id", value: response.data.id})
                   commit("setStudentModelKey",{key: "file_path", value: response.data.path})
                  }
                } catch (e) {
                  store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
                }
            },
            async fetchFilterDatas({commit}, payload){
              let response = await axios.post("/filterdetailsearch", payload);
              console.log(response)
              if(response.status === 200){
                let datas;
                if(payload.type === 1){
                   datas = response.data.map(s=>({
                     type: payload.type,
                     id: s.id,
                     name: s.sName,
                     code: s.sCode
                   }))
                } else if(payload.type === 2){
                  datas = response.data.map(f=>({
                    type: payload.type,
                     name: f.actper,
                     activity_id: f.activity_id,
                     period_id: f.period_id
                  }))
                } else {
                  datas = response.data.map(c=>({
                    type: payload.type,
                     name: c.scName,
                     id: c.id
                  }))
                }
                store.commit("setFilterDatas", datas)
              }
            }
    },
    getters: {
       students: (state)=>state.students,
       studentmodel: (state)=>state.studentmodel,
       student: (state)=>state.student,
       filterdatas: (state)=>state.filterdatas,
    }
}
