<template>
  <div>
    <Loading v-if="loading"></Loading>
    <button
      class="btn btn-primary btn-sm float-right"
      @click="openModal"
    >Kulüp Seçin</button>
    <a-relation-table
      :actions="actions"
      @action="getAction"
      :items="getClubPTypes"
      :fields="[{
            text: 'Kulüp Adı',
            value: 'club'
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
        <multiselect v-model="selectedClub" track-by="name" label="name" :multiple="false" :options="getClubs" :searchable="false" :allow-empty="false"></multiselect>
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
  import Modal from "@/components/amodal/Modal";
  import axios from "axios";
  import Multiselect from 'vue-multiselect'
  import { mapGetters } from "vuex";
  import _ from "lodash";
  import {
    Loading,
    appPlugin
  } from '@/Providers/defaultImports'
  export default {
    props: {
      parent: {
        type: [Boolean, Number],
        default: false
      }
    },
    computed: {
      ...mapGetters({
        clubptypes: "clubptypes",
        aclubs: "assigningclubs",
        errmessage: "errmessage",
        smessage: "successmessage"
      }),
      getClubPTypes(){
        return this.clubptypes.filter(c=>c.p_type_id === this.parent);
      },
      getClubs() {
        return _.uniqBy(this.clubs, "id");
      }
    },
    async created() {
      await this.$store.dispatch("fetchClubPTypes", {type:"ALL"});
      this.loading = false;
    },
    components: {
      Modal, Multiselect, Loading
    },
    watch: {
      "modals.modal"() {
        this.pivot = false;
        this.clubs = [];
      }
    },
    methods: {
      getAction(item, action) {
        console.log(item);
        if(action.action == 'detail'){
          this.$router.push({
            name: "cscheduledetail",
            params: { id: item.id }
          });
          this.$store.commit("setClubPType", item);
        } else if(action.action == 'delete'){
          appPlugin
            .showConfirm(
              "Ders programını ve buna bağlı verileri sileceksiniz. Onaylıyor musunuz ?"
            )
            .then(async res => {
              if (res.value) {
                this.loading = !this.loading;
                await this.$store.dispatch("deleteClubPType", item);
                this.loading = !this.loading;
              }
            });
        }
      },
      async openModal() {
        this.loading = true;
        let payload = {
          type: "ALL"
        };
        let result = await this.$store.dispatch("fetchAssigninClubs", payload);
        if (result) {
          this.modals.modal = true;
          this.clubs = await this.aclubs.map(sc => ({
            id: sc.id,
            name: sc.name,
            code: sc.code
          }));
          this.loading = false;
        }
     },
      async save() {
        this.loading = !this.loading;
        if(!this.selectedClub.id){
          this.modals.modal = false;
          appPlugin.showalert("Uyarı", "Eksik seçim işlemi yapıldı.", "warning", "Tamam");
          return;
        }
        this.modals.modal = false;
        let payload ={
          club_id: this.selectedClub.id,
          p_type_id: this.parent
        };
        const result = await this.$store.dispatch("createClubPType", payload)
        this.loading = !this.loading;
        if (result) {
          await this.$store.dispatch("fetchClubPTypes", {type:"ALL"});
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
        } else {
          console.log(this.errmessage);
          appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
        }
      }
    },
    data() {
      return {
        loading: true,
        actions: [{
          class: "danger",
          size: "sm",
          action: "delete",
          text: "Sil"
        },
          {
            class: "primary",
            size: "sm",
            action: "detail",
            text: "Detay"
          }
        ],
        selectedClub: { name: "Lütfen Kulüp Seçin"},
        modals: {
          modal: false
        },
        clubs: [],
        pivot: false,
        club: {}
      };
    }
  };
</script>
