<template>
<div>
    <div class="row"> 
      <div class="col-lg-12">
        <div class="card-wrapper">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">Faaliyet Haftaları</h3>
            </div>
            <a-add :selectedData="selectedData"></a-add>
          </div>
        </div>
      </div>
    </div>
    <card>
          <basic-table :items = "periodsFilter" :links="[]" @details="getDetails"></basic-table>
    </card>  
</div>
</template>
<script>
import VButton from "@/components/button";
import DPicker from "@/components/activity/DPicker";
import Tabs from "@/components/atabs/Tabs";
import TabPane from "@/components/atabs/Tab";
import BasicTable from "@/components/atable/BasicTable";
import Card from "@/components/acard/Card";
import AAdd from "./partial/add";
import { mapGetters } from 'vuex';
import appPlugin from "@/Providers/appPlugins";
export default {
    computed: {
        ...mapGetters({periods:"periods"}),
        periodsFilter(){
          return this.periods.map(a=>({
            id: a.id,
            name: a.pName,
            code: a.pCode
          }))
        }
    },
    components: {
      VButton, DPicker,Tabs, TabPane, BasicTable, Card, AAdd,
    },
    async mounted(){
        this.$store.dispatch("fetchPeriods");
    },
    data(){
        return {
            period: false,
            selectedData: {},
        }
    },
    methods: {
        async getDetails(item, action){
          this.period = false;
          switch (action.action) {
            case "edit":
              this.selectedData = {};
              setTimeout(() => {
                this.selectedData = item;
              }, 100);
              
              break;
            case "delete":
              appPlugin.showConfirm("Bu işlemi onaylarsanız. Bu faaliyetle ilişkili tüm verileri kaybedeceksiniz. Yine de onaylıyor musunuz ?").then(async res=>{
                if(res.value){
                  await this.$store.dispatch("deletePeriod", item.id);
                }
              })
              break;
            case "details":
               await this.$store.dispatch("fetchAperiods", item.id);
               this.$store.commit("setAcitivtySelected", item);
               this.period = true;
              break;
            default:
              break;
          }
        }
    }
}
</script>