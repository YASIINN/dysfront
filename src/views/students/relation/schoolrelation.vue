<template>
  <div>
    <Loading v-if="loading"></Loading>
    <button
      class="btn btn-primary btn-sm float-right"
      @click="openModal"
    >{{ parent ? 'Okul Seçimi':'Yeni Kayıt'}}</button>

    <a-relation-table
      v-if="!parent"
      @action="getAction"
      :actions = "getActions"
      :items="stschool"
      :fields="[{
            text: 'Okul Adı',
            value: 'school'
          }, {
            text: 'Sınıf',
            value: 'class'
          },
          {
            text: 'Şube',
            value: 'branch'
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
      <h6 slot="header" class="modal-title" id="modal-title-notification">Öğrenci Okula Ekleme</h6>

      <div class="py-3 text-center">
        <bts-select :options="getSchools" :type="'school'" @selected="getSelected"></bts-select>
      </div>

      <div class="py-3 text-center">
        <bts-select
          v-if="schoolbranches.length > 0"
          :options="schoolbranches"
          :type="'classbranch'"
          @selected="getSelected"
        ></bts-select>
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


    <div>
      <br><br>
      <div>
        <table-school v-if="view" :title="title"></table-school>
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
import {
  FETCH_SCHOOL_P_TYPE,
  GET_SCHOOL_P_TYPE
} from '@/store/modules/schoolprogramtypepivot/moduleNames';
import TableSchool from "@/views/activityschedule/viewpartial/tableschool";
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
      studentmodel: "studentmodel",
      schoolothers: "schoolothers",
      stschool: "studentschool",
      errmessage: "errmessage",
      smessage: "successmessage",
      schoolptypes: GET_SCHOOL_P_TYPE,
    }),
    getSchools() {
      return _.uniqBy(this.schools, "id");
    },
    getActions(){
      let action = this.ptypes.map(typ=>({
        class: "primary",
        size: "sm",
        action: "schedule",
        text: typ.ptName,
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
  async created(){
    await this.$store.dispatch("fetchPTypes");
    await this.$store.dispatch("fetchStdSchool", {
      where: "student_id",
      id: this.studentmodel.id
    });
    this.loading = !this.loading;
  },
  components: {
    Modal, TableSchool, Loading
  },
  watch: {
    "modals.modal"() {
      this.pivot = false;
      this.schoolbranches = [];
      this.schools = [];
    },
    stschool(val){
      if(val.length > 0){
        this.studentmodel.school_id = val[0].school_id;
        this.studentmodel.class_id = val[0].class_id;
        this.studentmodel.branch_id = val[0].branch_id;
      }
    }
  },
  methods: {
    async getAction(item, action) {
      debugger
      if(action.action === 'schedule') {
        await this.$store.dispatch(FETCH_SCHOOL_P_TYPE);
        let ptype = this.schoolptypes.find(sp=>sp.programtypeid ===action.id);
        if (ptype) {
          console.log(ptype);
          let payload = {
            s_p_type_id: ptype.pivotid,
            school_id: item.school_id,
            class_id: item.class_id,
            branch_id: item.branch_id
          }
          console.log(payload);
          await this.$store.dispatch("fetchSchoolDays", {
            urlparse: appPlugin.urlParse(
              "school_p_type_id=" + payload.s_p_type_id
            )
          });


          await this.$store.dispatch('fetchSchoolHours', {
            urlparse: appPlugin.urlParse(
              'school_p_type_id=' + payload.s_p_type_id
            )
          })
          await this.$store.dispatch("fetchSchoolPContents", payload);
          console.log(item);
          this.title = item.school + " " + item.class + " " + item.branch + " " + ptype.programtypename;
          this.view = true;
        } else {
          this.view = false;
        }
      } else {

        appPlugin
          .showConfirm(
            "Öğrenci okul/sınıf/şube ilişkisini sileceksiniz. Bununla birlikte bu okuldan almış olduğu derslerde silinecektir. Onaylıyor musunuz ?"
          )
          .then(async res => {
            if (res.value) {
              let result = await this.$store.dispatch("delStdSchool", item);
              if (result) {
                let payload = {
                  type: "sc",
                  ...item
                };
                this.$store.dispatch("deleteStudentMultiLessons", payload);
                this.studentmodel.school_id = 0;
                this.studentmodel.class_id = 0;
                this.studentmodel.branch_id = 0;
              }
            }
          });
      }
    },
    async openModal() {
      this.modals.modal = true;
      let payload = {
        type: "ALL"
      };
      let result = await this.$store.dispatch("fetchSchoolOthers", payload);
      if (result) {
        this.schools = await this.schoolothers.map(sc => ({
          id: sc.id,
          name: sc.name,
          code: sc.code
        }));
        console.log(this.schools);
      }
    },
    async getSelected(item, type) {
      if (type === "school" && item) {
        this.pivot = false;
        this.schoolbranches = [];
        let schoolbranches = await this.schoolothers.map(sc => ({
          school_id: sc.classbranch.school_id,
          name: sc.classbranch.classbranch,
          class_id: sc.classbranch.class_id,
          branch_id: sc.classbranch.branch_id
        }));
        this.schoolbranches = await schoolbranches.filter(
          sc => sc.school_id == item.id
        );
      } else if (type === "classbranch") {
        this.pivot = true;
        this.school = item;
      } else {
        this.schoolbranches = [];
        this.pivot = false;
      }
    },
    async save() {
      if(!this.school || !this.school.branch_id){
        this.modals.modal = false;
        appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
        return;
      }
      let payload = {
        school_id: this.school.school_id,
        class_id: this.school.class_id,
        branch_id: this.school.branch_id,
        student_id: this.studentmodel.id
      };
      this.modals.modal = false;
      if (this.parent) {
        this.$emit("toParent", 1, payload);
      } else {
        let result = await this.$store.dispatch("createStdSchool", payload);
        if (result) {
          this.studentmodel.school_id = payload.school_id;
          this.studentmodel.class_id = payload.class_id;
          this.studentmodel.branch_id = payload.branch_id;
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
          this.$store.dispatch("fetchStdSchool", {
            where: "student_id",
            id: this.studentmodel.id
          });
          // let p = {
          //   ...this.studentmodel.s_status,
          //   school: true
          // };
          // let statusData = {
          //   s_status: p,
          //   id: this.studentmodel.id
          // };
          // this.$store.dispatch("updatestudentstatus", statusData);
        } else {
          console.log(this.errmessage);
          appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
        }
      }
    }
  },
  data() {
    return {
      view: false,
      modals: {
        modal: false
      },
      loading: true,
      title: "",
      schools: [],
      schoolbranches: [],
      pivot: false,
      school: {}
    };
  }
};
</script>
