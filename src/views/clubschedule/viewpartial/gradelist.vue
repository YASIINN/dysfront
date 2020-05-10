<template>
    <div v-if="view">
          <label> Lütfen takım seçimi yapınız</label>
        <multiselect v-model="selectedgrade" track-by="name" label="name" :multiple="false" :options="clubpgrades" :searchable="true" :allow-empty="false"></multiselect>
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
        ...mapGetters({clubptype: "clubptype",
                      clubpgrades: "clubpgrades",
                       filtermodel:"filtermodel"})
    },
    components: {
       Multiselect, TableGrade
    },
    watch: {
       async "selectedgrade.id"(){
         let payload = {
           c_p_type_id: this.clubptype.id,
           ...this.selectedgrade
         }
         await this.$store.dispatch("fetchClubPContents", payload);
      }
    },
    async created(){
        let payload = {
          spor_club_id: this.clubptype.club_id,
        }
        await this.$store.dispatch("fetchClubPGrades", payload);
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
