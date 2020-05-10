<template>
  <ACard>
    <div class="text-center">
        Faaliyet Hafta Yönetimi
    </div>
    <br><br>
    <a-relation-table
      :fields="[{
            text: 'Faaliyet Adı',
            value: 'activity'
          }, {
            text: 'Takvim',
            value: 'period'
          },
          {
            text: 'İşlemler',
            value: 'action'
          }
          ]"
      :items="aplists" :actions="actions" @action="getAction"></a-relation-table>
  </ACard>
</template>

<script>
  import axios from "axios";
  import BasicTable from "@/components/atable/BasicTable";
  import appPlugin from '../../Providers/appPlugins'
  import {mapGetters} from "vuex";
  export default {
    name: 'activityperiodlist',
    computed: {
      ...mapGetters({aplists: "activityperiodlist"})
    },

    components: {
      BasicTable
    },
    methods: {
      async getAction(item, action){
        console.log(action);
        console.log(item);
        switch (action.action) {
          case "delete":
            appPlugin.showConfirm("Bu işlemi onaylarsanız. Bu faaliyet-takvim ilişkisini kaybedeceksiniz. Yine de onaylıyor musunuz ?").then(async res=>{
              if(res.value){
                await this.$store.dispatch("deleteActivityPeriod", item.pivot);
              }
            })
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
    data(){
      return {
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
          },
          {
            class: "danger",
            size: "sm",
            action: "delete",
            text: "Sil"
          }
        ],
      }
    },
    async created () {
      let result = await this.$store.dispatch("fetchActivityPeriodList");
      if(!result){
        appPlugin.showalert(
          "Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
          "",
          "error",
          "Tamam"
        );
      }
    }
  }
</script>
