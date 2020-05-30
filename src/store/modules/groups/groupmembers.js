import axios from "axios";
import store from "@/store";
export default {
  state: {
    groupMemberHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "__slot:image",
        title: '<i class="fas fa-image"></i>'
      },
      {
        name: "fullname",
        title: '<i class="fas fa-graduation-cap"></i>Soyad'
      },
      {
        name: "email",
        title: '<i class="fas fa-building"></i>Mail Adresi'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
  },
  mutations: {
  },
  actions: {
    async fetchGroupDoesntMembers({commit}, payload){
      let response = await axios.post("/doesntmembers", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchGroupHasMembers({commit}, payload){
      console.log(payload);
      let response = await axios.post("/hasmembers", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async assignMemberToGroup({commit}, payload){
      let result = 0;
      try {
        let response = await axios.post("/assignmembergroup", payload);
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
    async removeMemberFromGroup({commit}, payload){
      let result = 0;
      try {
        let response = await axios.post("/removemembergroup", payload);
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
  },
  getters: {
    groupmemberheader: (state)=>state.groupMemberHeader,
  }
}
