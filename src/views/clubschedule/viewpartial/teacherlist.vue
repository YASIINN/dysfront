<template>
    <div v-if="view">
          <label> Lütfen öğretmen seçimi yapınız</label>
        <multiselect v-model="steacher" track-by="uFullName" label="uFullName" :multiple="false" :options="cpscheduleteachers" :searchable="true" :allow-empty="false"></multiselect>
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
        ...mapGetters({clubptype: "clubptype",
                       cpscheduleteachers: "cpscheduleteachers",
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
                await this.$store.dispatch("fetchClubPTeacherContents", payload);
        }
    },
    async created(){
         this.view = true
      let payload = {
        spor_club_id: this.clubptype.club_id,
      }
        await this.$store.dispatch("fetchClubScheduleTeachers", payload);

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
