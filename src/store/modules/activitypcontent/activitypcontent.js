import axios from "axios";
import store from "@/store";
import Vue from "vue";
export default {
  state: {
    activitypcontents: [],
    schoolpcontents: [],
    apteachercontents: [],
    apscheduleteachers: [],

  },
  mutations: {
    setActivityPContents(state, data) {
      state.activitypcontents = data;
    },
    setSchoolPContents(state, data) {
      state.schoolpcontents = data;
    },
    setActivityPTeacherContents(state, data) {
      state.apteachercontents = data;
    },
    setAPScheduleTeachers(state, data) {
      state.apscheduleteachers = data;
    },
    addActivityPContents(state, data) {
      // Vue.set(state.activitypcontents, state.activitypcontents.length - 1, data);
      state.activitypcontents = [...state.activitypcontents, data];
    },
    async updateActivityPContents(state, data) {
      var index = state.activitypcontents.findIndex(ac=>ac.id === data.id);
      console.log(index);
      if (index > -1) {
        state.activitypcontents.splice(index, 1);
      }
    },
  },
  actions: {
    async fetchActivityPContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getactivitypcontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setActivityPContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async fetchSchoolPContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getschoolpcontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setSchoolPContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },

    //faaliyetin ders programında görevli hocaların listesi
    async fetchAPScheduleTeachers({commit}, payload){
      let response = await axios.post("/getapscheduleteachers", payload);
      console.log(response);
      if (response.status === 200) {
        commit("setAPScheduleTeachers", response.data)
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
     },
    async fetchActivityPTeacherContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getapteachercontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setActivityPTeacherContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async createActivityPContents({ commit, state }, payload) {
      console.log(payload);
      let result = 0;
      try {
        let response = await axios.post("/createactivitypcontents", payload);
        console.log(response);
        //tytpe kontrole et
        if (response.status === 201) {
          let data = {
            id: response.data.ap_content_id,
            activity_program_id: response.data.activity_program_id,
            activity_hour_id: payload.activity_hour_id,
            activity_day_id: payload.activity_day_id,
            lesson_id: payload.lesson_id,
            slesson: payload.slesson,
            steachers: payload.steachers,
          }
          if(payload.type === 1){
            commit("updateActivityPContents", data)
          }
           commit("addActivityPContents", data);
          store.commit("setSucMessage", response.data.message);
          result = 1;
        } else if (response.status === 200) {
          store.commit("setErrMessage", response.data.message);
        } else if(response.status === 202){
          result = 2;
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async updateActivityPContents({ commit, state }, payload) {
      console.log(payload);
      let result = 0;
      try {
        let response = await axios.post("/createactivitypcontents", payload);
        if (response.status === 201) {
          await commit("updateActivityPContents", payload)
          let data = {
            id: response.data.ap_content_id,
            activity_program_id: response.data.activity_program_id,
            activity_hour_id: payload.activity_hour_id,
            activity_day_id: payload.activity_day_id,
            lesson_id: payload.lesson_id,
            slesson: payload.slesson,
            steachers: payload.steachers,
          }
           commit("addActivityPContents", data);
          store.commit("setSucMessage", response.data.message);
          result = 1;
        } else if (response.status === 200) {
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async deleteActivityPContents({ commit, state }, payload) {
      let result = 0;
      try {
        let response = await axios.delete("/deleteactivitypcontent/" + payload.id);
        console.log(response);
        if (response.status === 200) {
          commit("updateActivityPContents", payload)
          result = 1;
        } else {
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
  },
  getters: {
    activitypcontents: (state) => state.activitypcontents,
    apteachercontents: (state)=>state.apteachercontents,
    apscheduleteachers: (state)=>state.apscheduleteachers,
    schoolpcontents: (state)=>state.schoolpcontents,
  }
}
