import axios from "axios";
import store from "@/store";
export default {
  state: {
    clubGroupHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "name",
        title: '<i class="fas fa-lightbulb"></i>Grup Adı'
      },
      {
        name: "code",
        title: '<i class="fas fa-lightbulb"></i>Grup Kodu'
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
    async fetchClubGroup({commit}, payload){
      let response = await axios.post("/clubgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchTeamGroup({commit}, payload){
      let response = await axios.post("/clubteamgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchTeamBranchGroup({commit}, payload){
      let response = await axios.post("/clubbranchgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
  },
  getters: {
    clubgroupheader: (state)=>state.clubGroupHeader,
  }
}
