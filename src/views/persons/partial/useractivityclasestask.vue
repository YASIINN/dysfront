<template>
  <v-tab-content :title="title" :tabKey="tabKey" icon="fa fa-user">
    <Loading v-if="loading"></Loading>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <a
        href="#"
        class="btn btn-sm btn-primary btn-round btn-icon float-right mb-2"
        data-toggle="tooltip"
        data-original-title="Edit product"
        @click="exportExcel"
      >
        <span class="btn-inner&#45;&#45;icon">
          <i class="fas fa-file-excel"></i>
        </span>
        <span class="btn-inner&#45;&#45;text">{{ $t('exportExcel') }}</span>
      </a>
      <a
        href="#"
        class="btn btn-sm btn-primary btn-round btn-icon float-right mb-2"
        data-toggle="tooltip"
        data-original-title="Edit product"
      >
        <span class="btn-inner&#45;&#45;icon">
          <i class="fas fa-file-excel"></i>
        </span>
        <span class="btn-inner&#45;&#45;text">{{ $t('allexportexcel') }}</span>
      </a>
      <div class="table-responsive">
        <SearchBox @search="onUserActivityWeekClasesSearch($event)" :placeHolderTxt="$t('search') "></SearchBox>
        <vuetable
          ref="vuetableawc"
          :append-params="moreParamsActivityWeekClases"
          :fields="$store.getters.getUserActivityWeekClasesHeader"
          :http-fetch="onFetchUserActivityWeekClases"
          noDataTemplate="Kayıt Bulunamadı"
          pagination-path
          :per-page="5"
          @vuetable:load-success="onSuccessUserActivityWeekClases"
          @vuetable:load-error="onErrorUserActivityWeekClases"
          @vuetable:pagination-data="onPaginationDataUserActivityWeekClases"
          @vuetable:loading="onLoadingUserActivityWeekClases"
          @vuetable:loaded="onLoadedUserActivityWeekClases"
        >
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                :icon="'fas fa-trash'"
                :title="'Sil'"
                v-if="showDelete"
                :btnColor="'red'"
                @onClick="onDeleteUserActivityClass(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
          </template>
        </vuetable>
        <vuetable-pagination-info ref="paginationInfoawc"></vuetable-pagination-info>
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <vuetable-pagination-bootstrap
            class="float-right"
            ref="paginationawc"
            @vuetable-pagination:change-page="onChangePageActivityWeekClases"
          ></vuetable-pagination-bootstrap>
        </div>
      </div>
    </flex>
  </v-tab-content>
</template>

<script>
import SearchBox from "@/components/searchBox";
import Loading from "@/components/loading";
import VTooltipButton from "@/components/tooltipButton";
import VTabContent from "@/components/tabbarcontent";
import appPlugin from "@/Providers/appPlugins";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "@/components/datatable/VuetablePaginationBootstrap";
import VuetablePaginationInfo from "@/components/datatable/VuetablePaginationInfo";
import Flex from "@/components/layout";
import tooltip from "@/components/tooltip";
import FlexCard from "@/components/flexwithcard";
import Swal from "sweetalert2";

export default {
  name: "useractivityclasestask",
  data() {
    return {
      moreParamsActivityWeekClases: {},
      txt: "",
      currentData: [],
      loading: false
    };
  },
  components: {
    Flex,
    FlexCard,
    tooltip,
    VTabContent,
    SearchBox,
    Loading,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  },
  props: {
    showDelete: {},
    user: {},
    tabKey: {},
    icon: {},
    title: {},
    loadActivityTask: {},
    onreset: {}
  },
  watch: {
    onreset: function(val) {
      if (val == true) {
        this.onRefresh();
      }
    }
  },

  methods: {
    exportExcel() {
      let data = this.currentData.data.data;
      console.log("excel", data);
      if (data.length < 1) {
        appPlugin.showalert(
          "Uyarı",
          "Excele Veri Aktarmak İçin Tabloda Verileriniz Olması Gerekmektedir",
          "info",
          "Tamam"
        );
      } else {
        let keys = ["aCode", "aName", "pCode", "pName", "gCode", "gName"];
        const header = [
          "Faaliyet Kodu",
          "Faaliyet Adı",
          "Dönem Kodu",
          "Dönem Adı",
          "Sınıf Adı",
          "Sınıf Kodu"
        ];
        appPlugin.exportExcelTable(
          data,
          this.user[0].uName.toUpperCase() +
            " " +
            this.user[0].uSurname.toUpperCase() +
            " " +
            " Görevli Olduğu Sınıflar",
          14,
          keys,
          header
        );
      }
    },
    allExportExcel() {
      //TODO
    },
    onRefresh() {
      this.$refs.vuetableawc.reload();
    },
    onDeleteUserActivityClass(item) {
      Swal.fire({
        title:
          this.$t("personname") +
          this.user[0].uName.toUpperCase() +
          " " +
          this.user[0].uSurname.toUpperCase() +
          "\n" +
          "Sınıf Adı :" +
          item.gName +
          "\n" +
          this.$t("sureDelete"),
        confirmButtonText: this.$t("yes"),
        confirmButtonColor: "red",
        cancelButtonText: this.$t("cancel"),
        icon: "warning",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;
          this.$store
            .dispatch("deleteUserActivityWeekClases", {
              query: appPlugin.urlParse(
                "user_id=" +
                  this.user[0].id +
                  "& activity_id=" +
                  item.activity_id +
                  "& grade_id=" +
                  item.grade_id +
                  "& period_id=" +
                  item.period_id
              )
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  appPlugin.showalert(
                    this.$t("deleteRecordMsg"),
                    "",
                    "success",
                    this.$t("ok")
                  );
                }
              } else {
                appPlugin.showalert(
                  this.$t("deleteRecordErrMsg"),
                  "",
                  "error",
                  this.$t("ok")
                );
              }
              this.$refs.vuetableawc.reload();
              this.loading = false;
            });
        }
      });
    },
    onErrorUserActivityWeekClases(err) {
      this.loading = false;
      appPlugin.showalert(
        "Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
        "",
        "error",
        "Tamam"
      );
    },
    onChangePageActivityWeekClases(page) {
      this.$refs.vuetableawc.changePage(page);
    },

    onLoadedUserActivityWeekClases() {
      this.loading = false;
    },

    onLoadingUserActivityWeekClases() {
      this.loading = true;
    },

    onPaginationDataUserActivityWeekClases(paginationData) {
      this.$refs.paginationawc.setPaginationData(paginationData);
      this.$refs.paginationInfoawc.setPaginationData(paginationData);
    },
    onSuccessUserActivityWeekClases() {},
    onFetchUserActivityWeekClases(apiUrl, httpOptions) {
      if (this.onreset) {
        let data;
        if (this.txt.trim() != "") {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("fetchUserActivityWeekClases", {
              id: this.$route.params.id,
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                "gName%" + this.txt + "& user_id=" + this.$route.params.id
              )
            });
            data.then(res => {
              console.log("lalal", res);
              this.currentData = res;
            });
            return data;
          }
        } else {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("fetchUserActivityWeekClases", {
              httpOpt: httpOptions,
              id: this.$route.params.id,
              query: appPlugin.urlParse("user_id=" + this.$route.params.id)
            });
            data.then(res => {
              this.currentData = res;
            });
            return data;
          }
        }
      }
    },
    onUserActivityWeekClasesSearch(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetableawc.refresh();
      });
    }
  }
};
</script>

<style scoped>
</style>
