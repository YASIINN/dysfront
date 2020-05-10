<template>
  <div class="card-body">
    hjdhjfdhjfd
    <div class="row">
      <div class="col-md-3">
        <bts-select :options="periodsFilter" @selected="getSelected"></bts-select>
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
export default {
  computed: {
    ...mapGetters({ periods: "periods", aselected: "aselected", aperiods: "aperiods"}),
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
          period_id: "",
          activity_id: 1,
          begin: "",
          end: "",
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
    save() {
      if(this.pivotData.period_id == '' || this.pdate==''){
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
        this.pivotData["begin"]=begin;
        this.pivotData["end"]=end;
        this.pivotData["activity_id"]=this.aselected.id;
        this.pivotData["type"]="date";
        this.$store.dispatch("createActPerPivot", this.pivotData).then(res=>{
            console.log(res);
        });
         console.log(this.pivotData)
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
    BtsSelect
  }
};
</script>