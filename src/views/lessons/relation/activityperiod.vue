<template>
   <card v-if="view">
     <tabs fill class="flex-column flex-xs-row" :value="'Atanan Dersler'">
       <br>
      <card shadow>
            <tab-pane title="Havuzdaki Dersler">
            <basic-table :items="noLessonsF.map(o=>({id:o.id,name: o.lName, code: o.lCode}))" :links="linksNo" :fields="fields" :actions="[]" @details="getDetails"></basic-table>
        </tab-pane>
           <tab-pane title="Atanan Dersler">
             <br/>
            <basic-table :items="inLessonsF.map(o=>({id:o.id,name: o.lName, code: o.lCode}))" :links="linksIn" :fields="fields" :actions="[]" @details="getDetails"></basic-table>
        </tab-pane>
      </card>
     </tabs>
     </card>
</template>
<script>
import Tabs from "@/components/atabs/Tabs";
import TabPane from "@/components/atabs/Tab";

import Card from "@/components/acard/Card";
import { mapGetters } from 'vuex';
import BasicTable from "@/components/atable/BasicTable";
import _ from "lodash";
import appPlugin from "@/Providers/appPlugins";
export default {
    computed: {
        ...mapGetters({aperiods: "aperiods", aplessons: "aplessons", errmessage: "errmessage", smessage: "successmessage"}),
       inLessonsF(){
            return this.aplessons.actperInLessons;
        },
        noLessonsF(){
           return this.aplessons.actperNoLessons;
        },
    },
    async mounted(){
        if(_.isEmpty(this.$route.params)){
        this.$router.go(-1);
      } else {
         let payload = {
	       activity_id: this.$route.params.item.pivot.activity_id,
	       period_id: this.$route.params.item.pivot.period_id,
       };
       await this.$store.dispatch("fetchAPlessons", payload);
       this.view = true;
       this.payload = payload;
      }
    },
    data(){
        return {
            payload: {},
            view: false,
            actper: "Zafer Yaz Okulu 1. Hafta",
            fields: [
              {
              text: 'Ders Adı',
            value: 'lName'
             },
               {
              text: 'Ders Kodu',
            value: 'lCode'
             },
              {
            text: 'İşlemler',
            value: 'ogrname'
          }
            ],
            linksNo: [{text: "Atama Yap",   class: "success", size: "sm", action: "addassign"}],
             linksIn: [{text: "Atamayı Kaldır",   class: "danger", size: "sm", action: "delassign"}]
        }
    },
    methods: {
        a(){
            alert("selan")
        },
        async getDetails(item, action){
           let payload = 
            {
	          activity_id: this.$route.params.item.pivot.activity_id,
	          period_id: this.$route.params.item.pivot.period_id,
	          lessons_id: item.id,
           }
          if(action.action === 'addassign'){
            let result = await this.$store.dispatch("createActPerLesson", payload);
            if (result) {
              await this.$store.dispatch("fetchAPlessons", this.payload);
              appPlugin.showalert(this.smessage, "", "success", "Tamam");
              
        } else {
            console.log(this.errmessage);
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
          } else {
             let result = await this.$store.dispatch("deleteActPerLesson", payload);
              if (result) {
              await this.$store.dispatch("fetchAPlessons", this.payload);
              appPlugin.showalert(this.smessage, "", "success", "Tamam");
              
        } else {
            console.log(this.errmessage);
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
          }
        }
    },
    components: {
        Tabs, TabPane, Card, BasicTable
    }
}
</script>