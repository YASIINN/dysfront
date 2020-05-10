<template>
    
    <div>
      {{getTitle}}
        <button :style="{'margin-left': '15px'}" class="btn btn-primary btn-sm float-right" @click="openModal">Otomatik Atama</button>
          <a-relation-table
       @action="getAction"
      :items="activitypdays"
      :fields="[{
            text: 'Gün',
            value: 'adname'
          },
          {
            text: 'İşlemler',
            value: 'action'
          }
          ]"
    ></a-relation-table>
     <modal
      v-if="modals.modal"
      :show.sync="modals.modal"
      gradient="danger"
      modal-classes="modal-danger modal-dialog-centered"
    >
      <h6 slot="header" class="modal-title" id="modal-title-notification">Gün Atama</h6>
      <div class="py-3 text-center">
         <multiselect v-model="selecteddays" track-by="name" label="name" :multiple="true" :options="days" :searchable="false" :allow-empty="false"></multiselect>
      </div>
      <template slot="footer">
        <button text-color="white" class="btn btn-primary ml-auto" @click="save">Ekle</button>
      </template>
    </modal>
    </div>
</template>
<script>
import Modal from "@/components/amodal/Modal";
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex';
import appPlugin from "@/Providers/appPlugins";
import axios from "axios";
export default {
      computed: {
         ...mapGetters({
      activitypdays: "activitypdays",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    getTitle(){
      return this.activitypdays.length > 0 ? this.activitypdays[0].title + ' Programı' : '';
    }
    },
    components: {
      Modal, Multiselect
    },
    async created(){
        const atp_id = this.$route.params.id;
         if (atp_id && atp_id > 0) {
            
            let result = await this.$store.dispatch("fetchActivityPDays", {where: "activity_p_type_id", id: atp_id});
            if(!result){
              this.$router.go(-1);
            }
            this.atp_id = atp_id;
         } else {
            this.$router.go(-1);
         }
    },
    data(){
        return {
            atp_id:0,
            days:[
                {name: "Pazartesi"},
                {name: "Salı"},
                {name: "Çarşamba"},
                {name: "Perşembe"},
                {name: "Cuma"},
                {name: "Cumartesi"},
                {name: "Pazar"},
                ],
               selecteddays: [],
               modals: {
               modal:false
            },
        }
    },
   methods: {
        async openModal(){
            this.selecteddays =  await this.days;
             this.modals.modal = true;

        },
        async save(){
          this.modals.modal = false;
                let datas = [];
                this.selecteddays.forEach(day => {
                    let d = {
                        a_p_type_id: this.atp_id,
                        name: day.name
                    }
                    datas.push(d);
                });
                let payload = {
                  data: datas
                }
          const result = await this.$store.dispatch("createActivityPDays", payload)
          if (result) {
            await this.$store.dispatch("fetchActivityPDays", {where: "activity_p_type_id", id: this.atp_id});
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
          } else {
            console.log(this.errmessage);
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }

        },
       getAction(item, action) {
      appPlugin
        .showConfirm(
          "Veriyi sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(res => {
          if (res.value) {
            this.$store.dispatch("deleteActivityPDays", item);
          }
        });
    }
    }
}
</script>