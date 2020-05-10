<template>
    <div v-if="view">
          <label> Lütfen sınıf ya da grup seçimi yapınız</label>
        <multiselect v-model="selectedgrade" track-by="name" label="name" :multiple="false" :options="activitypgrades" :searchable="true" :allow-empty="false"></multiselect>
        <br>
        <table-grade v-if="selectedgrade && selectedgrade.id"></table-grade>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import axios from "axios";
import Multiselect from 'vue-multiselect'
import TableGrade from "./tablegrade";
export default {
    computed: {
        ...mapGetters({activityptype: "activityptype",
                      activitypgrades: "activitypgrades",
                       filtermodel:"filtermodel"})
    },
    components: {
       Multiselect, TableGrade
    },
    watch: {
       async "selectedgrade.id"(){
          let payload = {
              a_p_type_id: this.activityptype.id,
              grade_id: this.selectedgrade.id
          }
        await this.$store.dispatch("fetchActivityPContents", payload);
      }
    },
    async created(){
        let payload = {
            activity_id: this.activityptype.activity_id,
            period_id: this.activityptype.period_id
        }
        await this.$store.dispatch("fetchActivityPGrades", payload);
         this.view = true
    },
     data(){
       return {
             view: false,
             selectedgrade: {}
       }
   },
   methods: {
   }
}
</script>