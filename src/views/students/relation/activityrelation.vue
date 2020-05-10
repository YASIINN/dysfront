<template>
  <div>
    <Loading v-if="loading"></Loading>
    <button
      class="btn btn-primary btn-sm float-right"
      @click="openModal"
    >{{ parent ? 'Faaliyet Seçimi':'Yeni Kayıt'}}</button>
    <a-relation-table
      v-if="!parent"
      :actions = "getActions"
      @action="getAction"
      :items="studentactivities"
      :fields="[{
            text: 'Faaliyet Adı',
            value: 'activity'
          }, {
            text: 'Takvim',
            value: 'period'
          },
          {
            text: 'Sınıf',
            value: 'grade'
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
      <h6 slot="header" class="modal-title" id="modal-title-notification">Öğrenci Faaliyete Ekleme</h6>

      <div class="py-3 text-center">
        <bts-select :options="activities" :type="'activity'" @selected="getSelected"></bts-select>
      </div>

      <div class="py-3 text-center">
        <bts-select
          v-if="getPeriods.length > 0"
          :options="getPeriods"
          :type="'period'"
          @selected="getSelected"
        ></bts-select>
      </div>

      <div class="py-3 text-center">
        <bts-select
          v-if="grades.length > 0"
          :options="grades"
          :type="'grade'"
          @selected="getSelected"
        ></bts-select>
      </div>

      <template slot="footer">
        <p v-if="!pivot">Faaliyet, takvime bağlı sınıf seçimi</p>
        <button
          :disabled="!pivot"
          text-color="white"
          class="btn btn-primary ml-auto"
          @click="save"
        >Ekle</button>
      </template>
    </modal>

    <div>
      <br><br>
      <div>
        <table-grade v-if="view"></table-grade>
      </div>
    </div>

  </div>
</template>
<script>
import Modal from "@/components/amodal/Modal";
import axios from "axios";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
import _ from "lodash";
import TableGrade from "@/views/activityschedule/viewpartial/tablegrade";
import {
  Loading
} from '@/Providers/defaultImports'
export default {
  props: {
    parent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      ptypes: "ptypes",
      activityptypes: "activityptypes",
      studentmodel: "studentmodel",
      apdatas: "apdatas",
      studentactivities: "studentactivities",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    getActivities() {
      let d = [];
      return this.activitiesOrginal.map(ao => ({
        activity: ao.aName,
        period: ao.periods.map(ap => ({
          period: ap.pName
        }))
      }));
    },
    getPeriods() {
      return _.uniqBy(this.periods, "id");
    },
    getActions(){
      let action = this.ptypes.map(typ=>({
        class: "primary",
        size: "sm",
        action: "schedule",
        text: typ.ptName + " P.",
        id: typ.id,
      }))
      let delAction=  {
        class: "danger",
        size: "sm",
        action: "delete",
        text: "Sil"
      };
      let actions = [
        delAction,
        ...action
      ];
      return actions;
    },
  },
  components: {
    Modal, TableGrade, Loading
  },
  watch: {
    "modals.modal"() {
      this.pivots = [];
      this.periods = [];
      this.grades = [];
      this.pivot = false;
    }
  },
  async mounted() {
    //  await this.$store.dispatch("fetchStdActivities", {type:"ALL"});
  },
  async created(){
    await this.$store.dispatch("fetchPTypes");
    await this.$store.dispatch("fetchStdActivities", {
      where: "student_id",
      id: this.studentmodel.id
    });
    if (this.studentactivities.length > 0) {
      //      let a = this.studentactivities.find(sa=>sa.isActive === true);
      this.studentmodel.activity_id = this.studentactivities[0].activity_id;
      this.studentmodel.period_id = this.studentactivities[0].period_id;
    }
    this.loading = !this.loading;
  },
  methods: {
   async getAction(item, action) {
      console.log(item);
      console.log(action);
      if(action.action === 'schedule'){
        debugger
        let payloadPType = {
          activity_id: item.activity_id,
          period_id: item.period_id,
          p_type_id: action.id
        }
        await this.$store.dispatch("fetchActivityPTypes", payloadPType);
        if(this.activityptypes.length > 0){
          let payload = {
            a_p_type_id: this.activityptypes[0].id,
            grade_id: item.grade_id
          }
          await this.$store.dispatch("fetchActivityPDays", {where: "activity_p_type_id", id: payload.a_p_type_id});
          await this.$store.dispatch("fetchActivityPHours", {where: "activity_p_type_id", id: payload.a_p_type_id});
          await this.$store.dispatch("fetchActivityPContents", payload);
          this.view = true;
        } else {
          this.view = false;
        }

      } else {
        appPlugin
          .showConfirm(
            "Öğrenci faliyet ilişkisini sileceksiniz.Bununla birlikte seçilen derslerde silinecektir. Onaylıyor musunuz ?"
          )
          .then(async res => {
            if (res.value) {
              let result = await this.$store.dispatch("delStdActivity", item);
              if (result) {
                let payload = {
                  type: "ap",
                  ...item
                };
                this.$store.dispatch("deleteStudentMultiLessons", payload);
                // if (this.studentactivities.length === 0) {
                this.studentmodel.activity_id = 0;
                this.studentmodel.period_id = 0;
                this.studentmodel.grade_id = 0;
                // }
              }
            }
          });
      }

    },
    openModal() {
      this.modals.modal = true;
      axios.get("/actwithperiods").then(res => {
        this.activitiesOrginal = res.data;
        this.activities = res.data.map((a, key) => ({
          name: a.aName,
          code: a.aCode,
          id: a.id,
          key: key
        }));
      });
    },
    async getSelected(item, type) {
      if (type === "activity" && item) {
        this.pivots = [];
        this.pivot = false;
        this.periods = [];
        this.grades = [];
        setTimeout(() => {
          let activity = this.activitiesOrginal[item.key];
          if (activity.periods.length > 0) {
            this.periods = activity.periods.map(ap => ({
              name: ap.pName,
              code: ap.pCode,
              id: ap.id,
              activity_id: ap.pivot.activity_id,
              period_id: ap.pivot.period_id
            }));
          }
        }, 100);
      } else if (type === "period") {
        this.pivot = false;
        this.grades = [];
        let payload = {
          activity_id: item.activity_id,
          period_id: item.period_id,
          other_where: "grade_id",
          other_id: "NULL",
          type: "grade"
        };
        await this.$store.dispatch("fetchAPdatas", payload);
        if (this.apdatas.actperInOthers.length > 0) {
          this.grades = this.apdatas.actperInOthers.map(apo => ({
            activity_id: item.activity_id,
            period_id: item.period_id,
            id: apo.id,
            name: apo.gName,
            code: apo.gCode
          }));
        }
      } else if (type === "grade") {
        this.pivot = true;
        console.log(item);
        this.grade = item;
      } else {
        this.periods = [];
        this.pivots = [];
        this.grades = [];
        this.pivot = false;
      }
    },
    check(){
    },
    async save() {
      if(!this.grade || !this.grade.id){
        this.modals.modal = false;
        appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
        return;
      }
      let payload = {
        activity_id: this.grade.activity_id,
        period_id: this.grade.period_id,
        grade_id: this.grade.id,
        student_id: this.studentmodel.id
      };
      this.modals.modal = false;
      if (this.parent) {
        this.$emit("toParent", 2, payload);
      } else {
        let result = await this.$store.dispatch("createStdActivity", payload);
        if (result) {
          this.studentmodel.activity_id = payload.activity_id;
          this.studentmodel.period_id = payload.period_id;
          this.studentmodel.grade_id = payload.grade_id;
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
          this.$store.dispatch("fetchStdActivities", {
            where: "student_id",
            id: this.studentmodel.id
          });
        } else {
          console.log(this.errmessage);
          appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
        }
      }
    }
  },
  data() {
    return {
      modals: {
        modal: false
      },
      loading: true,
      view: false,
      pivots: [],
      pivot: false,
      grade: {},
      swappivot: [],
      selectedActPeriod: [],
      activities: [],
      activitiesOrginal: [],
      periods: [],
      grades: []
    };
  }
};
</script>
