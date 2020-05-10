<template>
   <card>
     <tabs fill class="flex-column flex-xs-row" :value="'Yeni Atama'">
       <br>
      <card shadow>
            <tab-pane title="Yeni Atama">
             <period-add></period-add>
        </tab-pane>
           <tab-pane v-for="(period, i) in aperiodsFilter" :key="i">
            <span slot="title">
              {{aselected.code + ' ' + period.name}}
            </span>
                 <basic-table :i="i" :items="[period]" :actions="actions" @details="getDetails"></basic-table>
        </tab-pane>

      </card>
     </tabs>
     </card>
</template>
<script>
import Tabs from "@/components/atabs/Tabs";
import TabPane from "@/components/atabs/Tab";
import PeriodAdd from "./periodadd";
import Card from "@/components/acard/Card";
import { mapGetters } from 'vuex';
import BasicTable from "@/components/atable/BasicTable";
import {assignOpt} from "@/store/model/filterModel";
import appPlugin from '../../../Providers/appPlugins'
export default {
    computed: {
        ...mapGetters({aperiods: "aperiods",
          aselected: "aselected",
          appivotmodel:  "appivotmodel"}),
        aperiodsFilter(){
            return this.aperiods.map(ap=>({
                 name: ap.pName,
                 id: ap.id,
                 code: ap.pCode,
                 pivot: ap.pivot
            }))
        }
    },
    data(){
        return {
           assignOpt: assignOpt,
            links: [
              {
                class: "danger",
                size: "sm",
                action: "delete",
                text: "Sil"
              }
            ],
            actions: [
            {
              class: "info",
              size: "sm",
              action: "students",
              text: "Öğrenciler"
            },
              {
              class: "info",
              size: "sm",
              action: "parents",
              text: "Veliler"
            },
            {
           class: "info",
           size: "sm",
           action: "grades",
           text: "Gruplar"
         },{
           class: "info",
           size: "sm",
           action: "users",
           text: "Personeller"
         },
         {
           class: "info",
           size: "sm",
           action: "lessons",
           text: "Dersler"
         }
            ],
        }
    },
    methods: {
        async getDetails(item, action){
          console.log(action);
          console.log(item);
            switch (action.action) {
              case "details":
                this.$router.push({
                  name: 'activityperiodlist'
                });
                break;
              case "grades":
                this.$router.push({
                 name: 'agrades',
                 params: { item: item}
                });
                break;
              case "lessons":
                 this.$router.push({
                 name: 'aplessons',
                 params: { item: item}
                });
                break;
              case "students":
                this.assignOpt = {
                  ...this.assignOpt,
                  activity_id: item.pivot.activity_id,
                  period_id: item.pivot.period_id,
                  type: 2,
                  detailSearch: 1,
                  status: 1
                };
                await this.$store.commit("setAssignOptModel", this.assignOpt);
                this.$router.push({
                  name: "activitystudents"
                })
                break;
                case "parents":
                this.assignOpt = {
                  ...this.assignOpt,
                  activity_id: item.pivot.activity_id,
                  period_id: item.pivot.period_id,
                  type: 2,
                  detailSearch: 1,
                  status: 1
                };
                await this.$store.commit("setAssignOptModel", this.assignOpt);
                this.$router.push({
                  name: "activityparents"
                })
                break;
                case "users":
                this.assignOpt = {
                  ...this.assignOpt,
                  activity_id: item.pivot.activity_id,
                  period_id: item.pivot.period_id,
                  type: 2,
                  detailSearch: 1,
                  status: 1
                };
                await this.$store.commit("setAssignOptModel", this.assignOpt);
                this.$router.push({
                     name: "activityemployees"
                })
                break;
              default:
                break;
            }
        }
    },
    components: {
        Tabs, TabPane, PeriodAdd, Card, BasicTable
    }
}
</script>



