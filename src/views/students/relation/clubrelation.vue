<template>
  <div>
    <Loading v-if="loading"></Loading>
    <button
      class="btn btn-primary btn-sm float-right"
      @click="openModal"
    >{{ parent ? 'Kulüp Seçimi':'Yeni Kayıt'}}</button>
    <a-relation-table
      v-if="!parent"
      @action="getAction"
      :items="stsclubs"
      :fields="[{
            text: 'Kulüp Adı',
            value: 'club'
          }, {
            text: 'Takım',
            value: 'team'
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
      <h6 slot="header" class="modal-title" id="modal-title-notification">Öğrenci Kulübe Ekleme</h6>

      <div class="py-3 text-center">
        <bts-select :options="getClubs" :type="'club'" @selected="getSelected"></bts-select>
      </div>

      <div class="py-3 text-center">
        <bts-select
          v-if="teambranches.length > 0"
          :options="teambranches"
          :type="'teambranch'"
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
  </div>
</template>
<script>
import Modal from "@/components/amodal/Modal";
import axios from "axios";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
import {
  Loading
} from '@/Providers/defaultImports'
import _ from "lodash";
export default {
  props: {
    parent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      studentmodel: "studentmodel",
      aclubs: "assigningclubs",
      stsclubs: "studentclubs",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    getClubs() {
      return _.uniqBy(this.clubs, "id");
    }
  },
  components: {
    Modal, Loading
  },
  watch: {
    "modals.modal"() {
      this.pivot = false;
      this.teambranches = [];
      this.clubs = [];
    }
  },
  async created() {
   await this.$store.dispatch("fetchStdClub", {
      where: "student_id",
      id: this.studentmodel.id
    });
   this.loading = !this.loading;
  },
  methods: {
    getAction(item, action) {
      console.log(item);
      console.log(action);
      appPlugin
        .showConfirm(
          "Öğrenci kulüp/takım/şube ilişkisini sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(async res => {
          if (res.value) {
            let result = await this.$store.dispatch("delStdClub", item);
            if (result) {
              let payload = {
                type: "ct",
                ...item
              };
              // if (this.stsclubs.length === 0) {
              //   let p = {
              //     ...this.studentmodel.s_status,
              //     sporclub: false
              //   };
              //   let statusData = {
              //     s_status: p,
              //     id: this.studentmodel.id
              //   };
              //   this.$store.dispatch("updatestudentstatus", statusData);
              // }
              this.studentmodel.club_id = 0;
              this.studentmodel.team_id = 0;
              this.studentmodel.cbranch_id = 0;
            }
          }
        });
      //   axios.post("/delstudentactivity", item).then(res=>{
      //          console.log(res);
      //  })
    },
    async openModal() {
      this.modals.modal = true;
      let payload = {
        type: "ALL"
      };
      let result = await this.$store.dispatch("fetchAssigninClubs", payload);
      if (result) {
        this.clubs = await this.aclubs.map(sc => ({
          id: sc.id,
          name: sc.name,
          code: sc.code
        }));
        console.log(this.clubs);
      }
    },
    async getSelected(item, type) {
      if (type === "club" && item) {
        this.pivot = false;
        this.teambranches = [];
        let clubbranches = await this.aclubs.map(sc => ({
          club_id: sc.teambranch.club_id,
          name: sc.teambranch.teambranch,
          team_id: sc.teambranch.team_id,
          branch_id: sc.teambranch.branch_id
        }));
        this.teambranches = await clubbranches.filter(
          sc => sc.club_id == item.id
        );
      } else if (type === "teambranch") {
        this.pivot = true;
        console.log(item);
        this.club = item;
      } else {
        this.teambranches = [];
        this.pivot = false;
      }
    },
    async save() {
      if(!this.club || !this.club.branch_id){
        this.modals.modal = false;
        appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
        return;
      }
      let payload = {
        club_id: this.club.club_id,
        team_id: this.club.team_id,
        branch_id: this.club.branch_id,
        student_id: this.studentmodel.id
      };
      this.modals.modal = false;
      if (this.parent) {
        this.$emit("toParent", 3, payload);
      } else {
        let result = await this.$store.dispatch("createStdClub", payload);
        if (result) {
          this.studentmodel.club_id = payload.club_id;
          this.studentmodel.team_id = payload.team_id;
          this.studentmodel.cbranch_id = payload.cbranch_id;
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
          this.$store.dispatch("fetchStdClub", {
            where: "student_id",
            id: this.studentmodel.id
          });
        } else {
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
      clubs: [],
      teambranches: [],
      pivot: false,
      club: {}
    };
  }
};
</script>
