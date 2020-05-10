<template>
  <div>
      <label> Lütfen sınıf ya da grup seçimi yapınız</label>
        <multiselect v-model="selectedgrade" track-by="name" label="name" :multiple="false" :options="activitypgrades" :searchable="true" :allow-empty="false"></multiselect>
        <br>
        <my-table v-if="selectedgrade && selectedgrade.id" @handleHour="newSchedule" @handleUpdate="updateSchedule" @handlePaste="copySchedule"></my-table>
         <modal
      v-if="modals.modal"
      :show.sync="modals.modal"
      gradient="danger"
      modal-classes="modal-danger modal-dialog-centered"
    >
      <h6 slot="header" class="modal-title" id="modal-title-notification">Ders ve Öğretmen Seç</h6>
    <div class="py-3 text-center">
          <multiselect v-model="slesson" track-by="name" label="name" :multiple="false" :options="activityplessons" :searchable="true" :allow-empty="false"></multiselect>
      </div>
      <div class="py-3 text-center">
        <multiselect v-if="slesson && slesson.id" v-model="steachers" track-by="name" label="name" :multiple="true" :options="activitypteachers" :searchable="true" :allow-empty="false"></multiselect>
      </div>

      <template slot="footer">
        <button
          text-color="white"
          class="btn btn-primary ml-auto"
          @click="save"
        >Ekle</button>
      </template>
        </modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'
import Modal from "@/components/amodal/Modal";
import {scheduleModel} from "@/store/model/activityscheduleModel";
import MyTable from "./table";
import { some, isEmpty } from 'lodash'
import Toast from "@/components/toast";
import appPlugin from "@/Providers/appPlugins";
export default {
    computed: {
       ...mapGetters({activityptype: "activityptype",
                    activityplessons: "activityplessons",
                    activitypteachers: "activitypteachers",
                    errmessage: "errmessage",
                    smessage: "successmessage",
                    activitypgrades: "activitypgrades"}),

    },
    components: {
        Multiselect,  Modal, MyTable, Toast
    },

     watch: {
      "modals.modal"() {
          if(this.modals.modal === false){
        this.$store.commit("setActivityPTeachers", []);
        this.slesson = {name: "Ders Seçin"};
        this.steachers = [];
        this.reset = 0;
        }
      },
      async slesson(item){
         if(some(item, isEmpty)){
              if(!this.type || this.reset){
                this.steachers = [];
              } else if(this.type == 1){
                 this.reset = 1;
              }
              setTimeout(async () => {
                  let payload = {
                  activity_id: this.activityptype.activity_id,
                  period_id: this.activityptype.period_id,
                  lesson_id: item.id
             }
              await this.$store.dispatch("fetchActivityPTeachers", payload);

              }, 100);
         }

      },
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
        await this.$store.dispatch("fetchActivityPLessons", payload)
    },
    data(){
        return {
            reset: 0,
            title: "",
            type: 0, //ekleme sıfır güncelleme 1
            slesson: {name: "Ders Seçin"},
            steachers: [],
            modals: {
                modal: false,
                },
            selectedgrade: {}
        }
    },
    methods: {
         async updateSchedule(schedule){
           this.type = 1;
           this.modals.modal = true;
           scheduleModel.activity_day_id = schedule.activity_day_id;
           scheduleModel.activity_hour_id = schedule.activity_hour_id;
           this.slesson = schedule.slesson;
             this.steachers = schedule.steachers;
                 let payload = {
                  activity_id: this.activityptype.activity_id,
                  period_id: this.activityptype.period_id,
                  lesson_id: schedule.lesson_id
             }
              await this.$store.dispatch("fetchActivityPTeachers", payload);
        },
        async copySchedule(data, day, hour){
          console.log(data);
          console.log(day, hour);
          data = {
              ...data,
              activity_day_id: day.id,
              activity_hour_id: hour.id,
              activity_p_type_id:this.activityptype.id,
              grade_id: this.selectedgrade.id
          }
          let result = await this.$store.dispatch("createActivityPContents", data)
          if (result === 2) {
                appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
            }
        },
        async save(){

          if(this.steachers.length === 0){
            this.modals.modal = false;
            appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
            return;
          }
            this.modals.modal = false;
            scheduleModel.activity_p_type_id = this.activityptype.id;
            scheduleModel.grade_id = this.selectedgrade.id;
            scheduleModel.steachers = this.steachers;
            scheduleModel.slesson = { name: this.slesson.name, id: this.slesson.id};
            scheduleModel.lesson_id = this.slesson.id;
            scheduleModel.type = this.type;
            let result = await this.$store.dispatch("createActivityPContents", scheduleModel);
              if (result === 2) {
                appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
            }

        },
        newSchedule(day, hour){
           this.type = 0;
           this.title = day.adname + ' ' + hour.ahname;
           scheduleModel.activity_day_id = day.id;
           scheduleModel.activity_hour_id = hour.id;
           this.modals.modal = true;
        }
    },

}
</script>
