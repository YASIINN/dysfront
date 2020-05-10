<template>
    <div v-if="view">
          <label> Lütfen öğretmen seçimi yapınız</label>
        <multiselect v-model="steacher" track-by="uFullName" label="uFullName" :multiple="false" :options="apscheduleteachers" :searchable="true" :allow-empty="false"></multiselect>
         <table-teacher v-if="steacher && steacher.id"></table-teacher>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import axios from "axios";
import Multiselect from 'vue-multiselect'
import TableTeacher from "./tableteacher";
export default {
    computed: {
        ...mapGetters({activityptype: "activityptype", 
                       apscheduleteachers: "apscheduleteachers",
                       filtermodel:"filtermodel"})
    },
    components: {
       Multiselect, TableTeacher
    },
    watch: {
        async "steacher.id"(teacher){
                let payload = {
                    id: teacher
                }
                await this.$store.dispatch("fetchActivityPTeacherContents", payload);
        }
    },
    async created(){
         this.view = true
        let payload = {
            activity_id: this.activityptype.activity_id,
            period_id: this.activityptype.period_id
        }
        console.log(payload);
        await this.$store.dispatch("fetchAPScheduleTeachers", payload);
        
    },
     data(){
       return {
           steacher: {}
       }
   },
   methods: {
   }
}
</script>