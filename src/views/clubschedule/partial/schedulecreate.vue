<template>
  <div>
      <label> Lütfen sınıf ya da grup seçimi yapınız</label>
        <multiselect v-model="selectedgrade" track-by="name" label="name" :multiple="false" :options="clubpgrades" :searchable="true" :allow-empty="false"></multiselect>
        <br>
        <my-table v-if="selectedgrade && selectedgrade.id" @handleHour="newSchedule" @handleUpdate="updateSchedule" @handlePaste="copySchedule"></my-table>
         <modal
      v-if="modals.modal"
      :show.sync="modals.modal"
      gradient="danger"
      modal-classes="modal-danger modal-dialog-centered"
    >
           {{title}}
      <h6 slot="header" class="modal-title" id="modal-title-notification">Öğretmen Seç ve İçerik Gir</h6>
           <div>
             <AInput v-model="$v.description.$model" label="İçerik" placeholder="içerik" />
             <div style="margin-top: -15px" class="error" v-if="!$v.description.required">İçerik alanı zorunldur.</div>
             <div style="margin-top: -15px" class="error" v-if="!$v.description.minLength">En az 5 karakter olmalıdır.</div>
           </div>
      <div class="py-3 text-center">
        <multiselect v-model="steachers" track-by="name" label="name" :multiple="true" :options="clubpteachers" :searchable="true" :allow-empty="false"></multiselect>
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
import {scheduleModel} from "@/store/model/clubscheduleModel";
import MyTable from "./table";
import { some, isEmpty } from 'lodash'
import Toast from "@/components/toast";
import appPlugin from "@/Providers/appPlugins";
import { minLength, required } from 'vuelidate/lib/validators'
export default {
    computed: {
       ...mapGetters({clubptype: "clubptype",
                    clubplessons: "clubplessons",
                    clubpteachers: "clubpteachers",
                    errmessage: "errmessage",
                    smessage: "successmessage",
                    clubpgrades: "clubpgrades"}),

    },
  validations: {
    description: {
        required,
        minLength: minLength(5)
      }
  },
    components: {
        Multiselect,  Modal, MyTable, Toast
    },

     watch: {
      async "modals.modal"() {
          if(this.modals.modal === false){
        this.$store.commit("setClubPTeachers", []);
        this.steachers = [];
        this.description = "";
        this.reset = 0;
        } else {
            await this.$store.dispatch("fetchClubPTeachers", {id: this.clubptype.club_id});
          }
      },
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
            description: "",
            selectedgrade: {}
        }
    },
    methods: {
         async updateSchedule(schedule){
           this.type = 1;
           this.modals.modal = true;
           scheduleModel.club_day_id = schedule.club_day_id;
           scheduleModel.club_hour_id = schedule.club_hour_id;
           this.description = schedule.description;
           this.steachers = schedule.steachers;
           await this.$store.dispatch("fetchClubPTeachers", {id: this.clubptype.club_id});
        },
        async copySchedule(data, day, hour){
          data = {
              ...data,
              club_day_id: day.id,
              club_hour_id: hour.id,
              club_p_type_id:this.clubptype.id,
              ...this.selectedgrade
          }
          let result = await this.$store.dispatch("createClubPContents", data)
          if (result === 2) {
                appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
            }
        },
        async save(){
          this.modals.modal = false;
          if(this.$v.$invalid || this.steachers.length === 0){
            appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
            return;
          }
            scheduleModel.club_p_type_id = this.clubptype.id;
            scheduleModel.spor_club_id = this.selectedgrade.spor_club_id;
            scheduleModel.team_id = this.selectedgrade.team_id;
            scheduleModel.sbranch_id = this.selectedgrade.sbranch_id;
            scheduleModel.steachers = this.steachers;
            scheduleModel.description = this.description;
            scheduleModel.type = this.type;
            console.log(scheduleModel);
            let result = await this.$store.dispatch("createClubPContents", scheduleModel);
              if (result === 2) {
                appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
            }
        },
        newSchedule(day, hour){
           this.type = 0;
           this.title = day.adname + ' ' + hour.chname;
           scheduleModel.club_day_id = day.id;
           scheduleModel.club_hour_id = hour.id;
           this.modals.modal = true;
        }
    },

}
</script>
