<template>
    <div>
          <ATabs fill class="flex-column flex-xs-row" :value="'Okul Dersleri'">
            <br />
              <ATabPane
                v-for="(tabItem, i) in tabList"
                :key="i"
                :title="tabItem.name"
              >
                <a-p-lesson v-if="tabItem.id ==='activitylesson'" :mainlessons="studentmainlessons.activitylessons" @parentaction="parentAction"></a-p-lesson>
                <s-c-lesson v-if="tabItem.id ==='schoollesson'" :mainlessons="studentmainlessons.schoollessons" @parentaction="parentAction"></s-c-lesson>
              </ATabPane>
          </ATabs>
    </div>
</template>
<script>
import Modal from "@/components/amodal/Modal";
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex';
import axios from "axios";
import APLesson from "./partial/mainlesson/activityperiodlesson";
import SCLesson from "./partial/mainlesson/schoolclasslesson";
import appPlugin from "@/Providers/appPlugins";
export default {
    computed: {
        ...mapGetters({studentmodel: "studentmodel", 
             errmessage: "errmessage", 
      smessage: "successmessage",
        studentmainlessons: "studentmainlessons"}), 
    },
    components: {
        Modal, Multiselect, APLesson, SCLesson
    },
    data(){
       return {
           modals: {
               modal:false
           },
           selectedaplessons: [],
           selectedsclessons: [],
            tabList: [
        { name: "Okul Dersleri", id: "schoollesson" },
        { name: "Faaliyet Dersleri", id: "activitylesson" }
      ]
       }
    },
    methods: {
        async openModal(){
            this.modals.modal = true;
        },
        async parentAction(payload, action) {
          if(action.action === "delete"){
          let result = await this.$store.dispatch("deleteStudentLessons", payload);
         if (result) {
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
            if(payload.type === 'ap'){
               let lessons = this.studentmainlessons.activitylessons.filter(l=>l.lesson_id != payload.lesson_id);
                this.studentmainlessons.activitylessons = lessons;
            }else {
              let lessons = this.studentmainlessons.schoollessons.filter(l=>l.lesson_id != payload.lesson_id);
              this.studentmainlessons.schoollessons = lessons;
            }
        } else {
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
          }
    },
    }
}
</script>