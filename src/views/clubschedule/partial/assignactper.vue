<template>
  <div>
    <button
      class="btn btn-primary btn-sm float-right"
      @click="openModal"
    >{{ 'Faaliyet Seçin'}}</button>

    <a-relation-table
      @action="getAction"
      :actions="actions"
      :items="getActPTypes"
      :fields="[{
            text: 'Faaliyet Adı',
            value: 'activity'
          }, {
            text: 'Takvim',
            value: 'period'
          },
          {
            text: 'Program',
            value: 'p_type'
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
      <h6 slot="header" class="modal-title" id="modal-title-notification">Faaliyet Seçme</h6>

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
import _ from "lodash";
export default {
  props: {
    parent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
    activityptypes: "activityptypes",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    getActPTypes(){
         return this.activityptypes.filter(ap=>ap.p_type_id === this.parent);
    },
    getPeriods() {
      return _.uniqBy(this.periods, "id");
    }
  },
  components: {
    Modal
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
      await this.$store.dispatch("fetchActivityPTypes", {type:"ALL"});
  },
  methods: {
    getAction(item, action) {
        console.log(item);
        if(action.action == 'detail'){
              this.$router.push({
              name: "ascheduledetail",
              params: { id: item.id }
            });
            this.$store.commit("setActivityPType", item);
        } else if(action.action == 'delete'){
                appPlugin
        .showConfirm(
          "Ders programını ve buna bağlı verileri sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(async res => {
          if (res.value) {
            await this.$store.dispatch("deleteActivityPType", item);
          }
        });
        }

    },
    openModal() {
      this.modals.modal = true;
      axios.post("/uniqaperiods").then(res => {
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
          if (activity.uniqaperiods.length > 0) {
            this.periods = activity.uniqaperiods.map(ap => ({
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
        };
        this.pivot = true;
        this.item = item;
      }
      else {
        this.periods = [];
        this.pivots = [];
        this.pivot = false;
      }
    },
    async save() {
       this.modals.modal = false;
        let payload ={
            activity_id: this.item.activity_id,
            period_id: this.item.period_id,
            p_type_id: this.parent
        };
          const result = await this.$store.dispatch("createActivityPType", payload)
          if (result) {
            await this.$store.dispatch("fetchActivityPTypes", {type:"ALL"});
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
          } else {
            console.log(this.errmessage);
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }
    }
  },
  data() {
    return {
      modals: {
        modal: false
      },
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
      pivots: [],
      pivot: false,
      item: {},
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
