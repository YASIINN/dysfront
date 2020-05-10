<template>
  <div class="card-body">
    <label > Hafta ve Tarih aralığı seçiniz</label>
    <div class="row">
      <div class="col-md-3">
        <multiselect v-model="pivotData" track-by="name" label="name" :multiple="false"
                     placeholder="Select one"
                     :options="periodsFilter" :searchable="true" :allow-empty="false"></multiselect>
      </div>
      <div class="col-md-5">
        <DPicker @picker="getPicker" :local="true"></DPicker>
      </div>
      <div class="col-md-3">
        <v-button
          :btnIcon="'fa-plus-circle'"
          :className="'btn-info'"
          :btnName="'Ekle'"
          @onClick="save()"
        ></v-button>
      </div>
    </div>
  </div>
</template>
<script>
import DPicker from "@/components/activity/DPicker";
import VButton from "@/components/button";
import { mapGetters } from "vuex";
import BtsSelect from "@/components/ainput/BtsSelect";
import appPlugin from "@/Providers/appPlugins";
import _ from "lodash";
import Multiselect from "vue-multiselect";
export default {
  computed: {
    ...mapGetters({ periods: "periods",
      errmessage: "errmessage",
      smessage: "successmessage",
      aselected: "aselected", aperiods: "aperiods"}),
    periodsFilter() {
      let aperiods = this.aperiods.map(ap=>ap.id);
      let periods = this.periods.map(p=>p.id);
     console.log(_.isEqual(aperiods.sort(), periods.sort()));


var dif = _.difference(periods, aperiods);
console.log(dif);
      return this.periods.map(p => ({
        name: p.pName,
        code: p.pCode,
        id: p.id
      }));
    }
  },
  async mounted() {
    await this.$store.dispatch("fetchPeriods");
  },
  data() {
    return {
      pdate: "",
      pivotData: {
      }
    };
  },
  methods: {
    getSelected(sdata) {
        console.log(sdata);
        this.pivotData.period_id = sdata.id;
    },
    getPicker(pdata) {
      console.log(pdata)
      this.pdate = pdata;
    },
    async save() {
      if(this.pivotData.id == '' || this.pdate==''){
           appPlugin.showalert(
          "Uyarı",
          "Lütfen boş alanları giriniz",
          "warning",
          "Tamam"
        );
        return;
      }
      let range = this.pdate.includes("to"); //true
      if (range) {
        let dates = this.pdate.split("to");
        let begin = dates[0].trim();
        let end = dates[1].trim();
        let pivotData = {};
        pivotData["begin"]=begin;
        pivotData["end"]=end;
        pivotData["activity_id"]=this.aselected.id;
        pivotData["period_id"]=this.pivotData.id;
        pivotData["type"]="date";
        let result = await this.$store.dispatch("createActPerPivot", pivotData);
        if(result){
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
        } else {
          appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
        }
      } else {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen takvim aralığını giriniz",
          "warning",
          "Tamam"
        );
      }

    }
  },
  components: {
    DPicker,
    VButton,
    BtsSelect,
    Multiselect
  }
};
</script>
