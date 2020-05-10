<template>
   <card v-if="view">
     <tabs fill class="flex-column flex-xs-row" :value="'Atanan Sınıflar'">
       <br>
      <card shadow>
            <tab-pane title="Havuzdaki Sınıflar">
            <basic-table :items="noOthersF.map(o=>({id:o.id,name: o.gName, code: o.gCode}))" :links="linksNo" :fields="fields" :actions="[]" @details="getDetails"></basic-table>
        </tab-pane>
           <tab-pane title="Atanan Sınıflar">
             <br/>
            <basic-table :items="inOthersF.map(o=>({id:o.id,name: o.gName, code: o.gCode}))" :links="linksIn" :fields="fields" :actions="[]" @details="getDetails"></basic-table>
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
        ...mapGetters({aperiods: "aperiods", apdatas: "apdatas", errmessage: "errmessage", smessage: "successmessage"}),
       inOthersF(){
            return this.apdatas.actperInOthers;
        },
        noOthersF(){
           return this.apdatas.actperNoOthers;
        },
    },
    async mounted(){
        if(_.isEmpty(this.$route.params)){
        this.$router.go(-1);
      } else {
         let payload = {
	       activity_id: this.$route.params.item.pivot.activity_id,
	       period_id: this.$route.params.item.pivot.period_id,
	       other_where: "grade_id",
	       other_id: "NULL",
	       type: "grade"
       };
       await this.$store.dispatch("fetchAPdatas", payload);
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
              text: 'Sınıf Adı',
            value: 'gName'
             },
               {
              text: 'Sınıf Kodu',
            value: 'gCode'
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
           let payload = {
	           "data": [
            {
	          activity_id: this.$route.params.item.pivot.activity_id,
	          period_id: this.$route.params.item.pivot.period_id,
	          other_where: "grade_id",
	          other_id: item.id,
	          type: "grade"
           }
           ]
           }
          if(action.action === 'addassign'){
            let result = await this.$store.dispatch("createActPerOther", payload);
            if (result) {
              await this.$store.dispatch("fetchAPdatas", this.payload);
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
             let result = await this.$store.dispatch("delActPerOther", payload.data[0]);
              if (result) {
              await this.$store.dispatch("fetchAPdatas", this.payload);
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