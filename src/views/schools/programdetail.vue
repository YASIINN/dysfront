<template>
  <div>
    <Loading v-if="loading"></Loading>

    <flex-card
      column="col-md-12 col-sm-12 col-lg-12"
      v-if="$store.getters.getSchoolProgramType[0]"
      :headerTitle="
        $store.getters.getSchoolProgramType[0].schoolname +
          ' ' +
          $store.getters.getSchoolProgramType[0].programtypename
      "
    >
      <v-tabs style="padding: 20px" @onActiveTab="getActiveTabs($event)">
        <v-tab-content tabKey="schoolDay" :title="'Günler'" icon="fa fa-info">
          <createday
            v-if="$store.getters.getSchoolProgramType[0] && createdays "
            @onReset="onRefreshComplate($event)"
            :header="
              $store.getters.getSchoolProgramType[0].schoolname +
                ' ' +
                $store.getters.getSchoolProgramType[0].programtypename +
                ' ' +
                'Günlerini Oluştur'
            "
          ></createday>

          <schooldaylist :onreset="onresetschooldays"></schooldaylist>
        </v-tab-content>
        <v-tab-content tabKey="schoolHour" :title="'Saatler'" icon="fa fa-info">
          <createhour
            v-if="$store.getters.getSchoolProgramType[0] && createhours"
            :selectedData="showSelectedData"
            @onReset="onCreateHourComplate($event)"
            :header="
              $store.getters.getSchoolProgramType[0].schoolname +
                ' ' +
                $store.getters.getSchoolProgramType[0].programtypename +
                ' ' +
                'Saatlerini Oluştur'
            "
          ></createhour>
          <schoolhourlist
            v-if="createhours"
            @onSelected="onSelectedData($event)"
            :onreset="onresetschoolhours"
            :header="
              $store.getters.getSchoolProgramType[0].schoolname +
                ' ' +
                $store.getters.getSchoolProgramType[0].programtypename +
                ' ' +
                'Günlerini Oluştur'
            "
          ></schoolhourlist>
        </v-tab-content>

        <v-tab-content tabKey="schoolProgram" title="Oluştur" icon="fa fa-info">
          <createschoolprogram
            :onreset="refreshcontent"
            v-if="$store.getters.getSchoolProgramType[0] && createprogram"
            :school="$store.getters.getSchoolProgramType[0]"
            :header="
              $store.getters.getSchoolProgramType[0].schoolname +
                ' ' +
                $store.getters.getSchoolProgramType[0].programtypename +
                ' ' +
                'Oluştur'
            "
          ></createschoolprogram>
        </v-tab-content>
        <v-tab-content tabKey="showSchoolProgram" title="Görüntüle" icon="fa fa-info">
          <v-tabs style="padding: 20px" v-if="showprogram">
            <v-tab-content tabKey="showClassProgram" title="Sınıfa Göre" icon="fa fa-eye">
              <createschoolprogram
                :onreset="onresetshowcontent"
                :showVisible="false"
                :school="$store.getters.getSchoolProgramType[0]"
                :header="
                  $store.getters.getSchoolProgramType[0].schoolname +
                    ' ' +
                    $store.getters.getSchoolProgramType[0].programtypename +
                    ' ' +
                    'Listesi'
                "
              ></createschoolprogram>
            </v-tab-content>
            <v-tab-content tabKey="showClassProgram" title="Öğretmene Göre" icon="fa fa-eye">
              <school-person-program
                :onreset="onresetshowcontent"
                :school="$store.getters.getSchoolProgramType[0]"
                :header="
                  $store.getters.getSchoolProgramType[0].schoolname +
                    ' ' +
                    $store.getters.getSchoolProgramType[0].programtypename +
                    ' ' +
                    'Listesi'
                "
              />
            </v-tab-content>
          </v-tabs>
        </v-tab-content>
      </v-tabs>
    </flex-card>
  </div>
</template>

<script>
import {
  VTabs,
  VTabContent,
  SearchBox,
  Loading,
  FlexCard,
  Flex,
  VTooltipButton,
  Vuetable,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  appPlugin
} from "@/Providers/defaultImports";
import Createday from "./partial/createday";
import Schooldaylist from "./partial/schooldaylist";
import Createhour from "./partial/createhour";
import Schoolhourlist from "./partial/schoolhourlist";
import Createschoolprogram from "./partial/createschoolprogram";
import SchoolPersonProgram from "./partial/showpersonprogram";

export default {
  data() {
    return {
      createdays: true,
      createhours: true,
      createprogram: false,
      showprogram: false,
      getprogramtype: [],
      showSelectedData: {},
      onreset: false,
      onresetshowcontent: false,
      onresetschoolhours: false,
      onresetschooldays: false,
      refreshcontent: false,
      loading: false
    };
  },
  watch: {
    onresetschooldays: function(val) {}
  },
  name: "programdetail",
  created() {
    if (isNaN(+this.$route.params.id) == false) {
      this.showSchoolProgramData();
    } else {
      this.loading = false;
      appPlugin.showalert("Geçersiz Parametre", "", "error", "Tamam");
      this.$router.replace("/programs");
    }
  },
  methods: {
    onSelectedData(data) {
      this.showSelectedData = data;
    },
    getActiveTabs(data) {
      switch (data.componentOptions.propsData.tabKey) {
        case "schoolDay":
          this.createdays = true;
          this.createhours = true;
          this.createprogram = false;
          this.showprogram = false;
          this.refreshcontent = true;
          this.onresetshowcontent = true;
          return;
        case "schoolHour":
          this.createdays = false;
          this.createhours = true;
          this.createprogram = false;
          this.showprogram = false;
          this.refreshcontent = true;
          this.onresetshowcontent = true;
          return;
        case "schoolProgram":
          this.createdays = false;
          this.createhours = false;
          this.createprogram = true;
          this.showprogram = false;
          this.refreshcontent = false;
          this.onresetshowcontent = true;
          /*  this.showSchoolProgramData()*/
          return;
        case "showSchoolProgram":
          this.createdays = false;
          this.createhours = false;
          this.createprogram = false;
          this.showprogram = true;
          this.refreshcontent = true;
          this.onresetshowcontent = false;
          return;
      }
    },
    onCreateHourComplate($event) {
      this.onresetschoolhours = $event;
    },
    onRefreshComplate($event) {
      this.onresetschooldays = $event;
    },
    showSchoolProgramData() {
      this.loading = true;
      this.$store
        .dispatch("showSchoolProgramType", { id: this.$route.params.id })
        .then(res => {
          if (res[0] && res[0].id) {
            console.log(res);
            this.getprogramtype = res;
          } else {
            this.$router.replace("/programs");
          }
        });
      this.loading = false;
    }
  },
  components: {
    SchoolPersonProgram,
    Createschoolprogram,
    Schoolhourlist,
    Createhour,
    Schooldaylist,
    Createday,
    VTabs,
    VTabContent,
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  }
};
</script>

<style scoped></style>
