<template>
    
    <div>
        <button :style="{'margin-left': '15px'}" class="btn btn-primary btn-sm float-right" @click="openModal">Otomatik Atama</button>
          <a-relation-table
       @action="getAction"
      :items="mainlessons.filter(l=>l.lesson_type === 0)"
      :fields="[{
            text: 'Faaliyet Adı',
            value: 'activity'
          }, {
            text: 'Takvim',
            value: 'period'
          },
          {
            text: 'Ders',
            value: 'lesson'
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
      <h6 slot="header" class="modal-title" id="modal-title-notification">Öğrenciye Ders Ataması</h6>
      <div class="py-3 text-center">
         {{activityperiod.title ? `${activityperiod.title} Ana Dersleri`:'Faaliyet ders ataması henüz yapılmamıştır'}} 
         <multiselect v-model="selectedaplessons" track-by="lName" label="lName" :multiple="true" :options="activityperiod.lessons" :searchable="false" :allow-empty="false"></multiselect>
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
   props: {
      mainlessons: {
          type: [Array, Object],
          default: ()=>([])
      }
   },
    components: {
      Modal, Multiselect
    },
    computed: {
        ...mapGetters({studentmodel: "studentmodel", activityperiod: "activityperiod"})
    },
    data(){
        return {
              selectedaplessons: [],
               modals: {
               modal:false
            },
            datas: [],
        }
    },
   methods: {
        async openModal(){
             if(this.studentmodel.activity_id != 0 && this.studentmodel.period_id != 0){
             let payload = {
               "lessonType": 0,
	         "student_id": this.studentmodel.id,
	        "activity_id": this.studentmodel.activity_id,
	        "period_id": this.studentmodel.period_id
        };
         await this.$store.dispatch("fetchAPdifflessons", payload);
         this.selectedaplessons = this.activityperiod.lessons;
              this.modals.modal = true;
             } else {
                    appPlugin.showalert(
          "Uyarı",
          "Henüz öğrenciyi bir faaliyete eklememişsiniz.",
          "warning",
          "Tamam"
        );
             }
            
         
        },
        async save(){
           this.modals.modal = false;
           const data = [];
           this.selectedaplessons.map(sapl => sapl.id).forEach(id => {
              let p = {
                student_id: this.studentmodel.id,
                activity_id: this.studentmodel.activity_id,
                period_id: this.studentmodel.period_id,
                lessons_id: id
              }
              data.push(p);
           });
           const payload = {
             type: "ap",
             data: data
           }
           let result = await this.$store.dispatch("createStudentLessons", payload);
            if (result) {
            appPlugin.showalert("Öğrenciye ana ders ataması işlemi başarılıdır", "", "success", "Tamam");
            this.$store.dispatch("fetchAssignLessons",{where:"student_id", id: this.studentmodel.id})
        } else {
            console.log(this.errmessage);
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
        },
       getAction(item, action) {
      appPlugin
        .showConfirm(
          "Öğrenci ders ilişkisini sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(res => {
          if (res.value) {
            const payload = {
              type: "ap",
              ...item
            };
            this.$emit("parentaction", payload, action);
          }
        });
    }
    }
}
</script>