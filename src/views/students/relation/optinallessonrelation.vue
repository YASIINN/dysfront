<template>
  <div>
    <div>
      <ATabs fill class="flex-column flex-xs-row" :value="'Okul Seçmeli Dersleri'">
        <br />
        <ATabPane v-for="(tabItem, i) in tabList" :key="i" :title="tabItem.name">
          <s-c-lesson-opt v-if="tabItem.id ==='schoollessonopt'" :openModal="openModal" :mainlessons="studentmainlessons.schoollessons" @parentaction="parentAction"></s-c-lesson-opt>
          <a-p-lesson-opt v-if="tabItem.id ==='activitylessonopt'" :openModal="openModal" :mainlessons="studentmainlessons.activitylessons" @parentaction="parentAction"></a-p-lesson-opt>
        </ATabPane>
      </ATabs>
    </div>
    <modal
      v-if="modals.modal"
      :show.sync="modals.modal"
      gradient="danger"
      modal-classes="modal-danger modal-dialog-centered"
    >
      <h6
        slot="header"
        class="modal-title"
        id="modal-title-notification"
      >Öğrenciye Seçmeli Ders Ataması</h6>

      <div v-if="type === 'sc'" class="py-3 text-center">
        {{schoolclassopt.title ? `${schoolclassopt.title} Seçmeli Dersleri`:'Okul ders ataması henüz yapılmamıştır'}}
        <multiselect
          :options="schoolclassopt.lessons"
          v-model="selectedsclessonsopt"
          group-values="optinalLessons"
          group-label="mainlesson"
          :group-select="true"
          track-by="lName"
          label="lName"
          :multiple="true"
          :searchable="false"
          :allow-empty="true"
        ></multiselect>
      </div>
      <div v-if="type === 'ap'" class="py-3 text-center">
        {{activityperiodopt.title ? `${activityperiodopt.title} Seçmeli Dersleri`:'Faaliyet ders ataması henüz yapılmamıştır'}}
        <multiselect
          :options="activityperiodopt.lessons"
          v-model="selectedaplessonsopt"
          group-values="optinalLessons"
          group-label="mainlesson"
          :group-select="true"
          track-by="lName"
          label="lName"
          :multiple="true"
          :searchable="false"
          :allow-empty="true"
        ></multiselect>
      </div>

      <template slot="footer">
        <button
          :disabled="!pivot"
          text-color="white"
          class="btn btn-primary ml-auto"
          @click="save"
        >Ekle</button>
      </template>
    </modal>
  </div>
</template>
<script>
import Modal from "@/components/amodal/Modal";
import Multiselect from "vue-multiselect";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
import APLessonOpt from "./partial/optinallesson/activityperiodlesson";
import SCLessonOpt from "./partial/optinallesson/schoolclasslesson";
import axios from "axios";
export default {
  computed: {
    ...mapGetters({
      studentmodel: "studentmodel",
      activityperiodopt: "activityperiodopt",
      schoolclassopt: "schoolclassopt",
      studentmainlessons: "studentmainlessons",
      errmessage: "errmessage", 
      smessage: "successmessage"
    })
  },
  components: {
    Modal,
    Multiselect,
    APLessonOpt,
    SCLessonOpt
  },
  data() {
    return {
      selectedaplessonsopt: [],
      selectedsclessonsopt: [],
      modals: {
        modal: false
      },
      type: "",
      tabList: [
        { name: "Okul Seçmeli Dersleri", id: "schoollessonopt" },
        { name: "Faaliyet Seçmeli Dersleri", id: "activitylessonopt" }
      ],
      pivot: true
    };
  },
  methods: {
    async openModal(type) {
      this.type = type;

      console.log(this.studentmodel);

      let payload = {
        lessonType: 1,
        school_id: this.studentmodel.school_id,
        clases_id: this.studentmodel.class_id,
        activity_id: this.studentmodel.activity_id,
        period_id: this.studentmodel.period_id
      };
      let result = await this.$store.dispatch("fetchAssignLessonsOpt", payload);
      this.modals.modal = true;
    },
    async parentAction(payload, action) {
          if(action.action === "delete"){
          let result = await this.$store.dispatch("deleteStudentLessons", payload);
         if (result) {
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
            if(payload.type === 'ap'){
               let lessons = this.studentmainlessons.activitylessons.filter(l=>l.lesson_id != payload.lesson_id);
                this.studentmainlessons.activitylessons = lessons;
            }else {
              let lessons = this.studentmainlessons.schoollessons.filter(l=>l.lesson_id != payload.lesson_id);
              this.studentmainlessons.schoollessons = lessons;
            }
        } else {
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
          }
    },
    async save() {
      this.modals.modal = false;
      if (this.type === "sc") {
        if (this.selectedsclessonsopt.length > 0) {
          let result = await this.saveSClessons();
          if (result) {
            appPlugin.showalert(
              "Öğrencinin okula ait seçmeli ders ataması gerçekleştirildi.",
              "",
              "success",
              "Tamam"
            );
            this.$store.dispatch("fetchAssignLessons",{where:"student_id", id: this.studentmodel.id})
          } else {
            console.log(this.errmessage);
            appPlugin.showalert(
              "Uyarı",
              "Öğrencinin okula ait seçmeli ders ataması başarısız oldu. Lütfen bilgiişlemle iletişime geçiniz.",
              "warning",
              "Tamam"
            );
          }
        }
        else {
               appPlugin.showalert(
              "Uyarı",
              "Herhangi bir seçim yapmadınız.",
              "warning",
              "Tamam"
            );
        }
      } else {
        if (this.selectedaplessonsopt.length > 0) {
          let result = await this.saveAPlessons();
          if (result) {
            appPlugin.showalert(
              "Öğrencinin faaliyete ait seçmeli ders ataması gerçekleştirildi.",
              "",
              "success",
              "Tamam"
            );
            this.$store.dispatch("fetchAssignLessons",{where:"student_id", id: this.studentmodel.id})
          } else {
            appPlugin.showalert(
              "Uyarı",
              "Öğrencinin faaliyete ait seçmeli ders ataması başarısız oldu. Lütfen bilgiişlemle iletişime geçiniz.",
              "warning",
              "Tamam"
            );
          }
        } else {
               appPlugin.showalert(
              "Uyarı",
              "Herhangi bir seçim yapmadınız.",
              "warning",
              "Tamam"
            );
        }
      }
    },
    async saveAPlessons() {
      const data = [];
      this.selectedaplessonsopt
        .map(sapl => sapl.id)
        .forEach(id => {
          let p = {
            student_id: this.studentmodel.id,
            activity_id: this.studentmodel.activity_id,
            period_id: this.studentmodel.period_id,
            lessons_id: id
          };
          data.push(p);
        });
      const payload = {
        type: "ap",
        data: data
      };
      let result = await this.$store.dispatch("createStudentLessons", payload);
      return result;
    },
    async saveSClessons() {
      const data = [];
      this.selectedsclessonsopt
        .map(sscl => sscl.id)
        .forEach(id => {
          let p = {
            student_id: this.studentmodel.id,
            school_id: this.studentmodel.school_id,
            clases_id: this.studentmodel.class_id,
            lessons_id: id
          };
          data.push(p);
        });
      const payload = {
        type: "sc",
        data: data
      };
      console.log(payload);
      let result = await this.$store.dispatch("createStudentLessons", payload);
      return result;
    }
  }
};
</script>