<template>
    
    <div>
        <button :style="{'margin-left': '15px'}" class="btn btn-primary btn-sm float-right" @click=openModal>Otomatik Atama</button>
          <a-relation-table
       @action="getAction"
      :items="mainlessons.filter(l=>l.lesson_type === 0)"
      :fields="[{
            text: 'Okul',
            value: 'school'
          }, {
            text: 'Sınıf',
            value: 'clases'
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
         {{schoolclass.title ? `${schoolclass.title} Ana Dersleri`:'Okul ders ataması henüz yapılmamıştır'}} 
         <multiselect v-model="selectedsclessons" track-by="lName" label="lName" :multiple="true" :options="schoolclass.lessons" :searchable="false" :allow-empty="false"></multiselect>
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
        ...mapGetters({studentmodel: "studentmodel", schoolclass: "schoolclass"})
    },
    data(){
        return {
              selectedsclessons: [],
               modals: {
               modal:false
            },
            datas: [],
        }
    },
   methods: {
        async openModal(){
          console.log(this.studentmodel);
             if(this.studentmodel.school_id != 0 && this.studentmodel.clases_id != 0){
             let payload = {
               "lessonType": 0,
	           "student_id": this.studentmodel.id,
	           "school_id": this.studentmodel.school_id,
	           "clases_id": this.studentmodel.class_id
        };
        console.log(payload);
         await this.$store.dispatch("fetchSCdifflessons", payload);
         this.selectedsclessons = this.schoolclass.lessons;
         this.modals.modal = true;
       console.log(this.schoolclass);
             } else {

               appPlugin.showalert(
          "Uyarı",
          "Henüz öğrenciyi bir okula eklememişsiniz.",
          "warning",
          "Tamam"
        );
             }
            
         
        },
        async save(){
            this.modals.modal = false;
           const data = [];
           this.selectedsclessons.map(sscl => sscl.id).forEach(id => {
              let p = {
                student_id: this.studentmodel.id,
                school_id: this.studentmodel.school_id,
                clases_id: this.studentmodel.class_id,
                lessons_id: id
              }
              data.push(p);
           });
           const payload = {
             type: "sc",
             data: data
           }
           let result = await this.$store.dispatch("createStudentLessons", payload);
            if (result) {
            appPlugin.showalert("Öğrenciye ana ders ataması işlemi başarılıdır.", "", "success", "Tamam");
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
              type: "sc",
              ...item
            };
            console.log(payload);
            this.$emit("parentaction", payload, action);
          }
        });
    }
    }
}
</script>