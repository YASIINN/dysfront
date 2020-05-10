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
        <SearchBox @search="onUserActivityWeekSearch($event)" :placeHolderTxt="$t('search') "></SearchBox>
        <vuetable
          ref="vuetableaw"
          :append-params="moreParamsActivityWeek"
          :fields="$store.getters.getUserActivityWeekHeader"
          :http-fetch="onFetchUserActivityWeek"
          noDataTemplate="Kayıt Bulunamadı"
          pagination-path
          :per-page="5"
          @vuetable:load-success="onSuccessUserActivityWeek"
          @vuetable:load-error="onErrorUserActivityWeek"
          @vuetable:pagination-data="onPaginationDataUserActivityWeek"
          @vuetable:loading="onLoadingUserActivityWeek"
          @vuetable:loaded="onLoadedUserActivityWeek"
        >
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                :icon="'fas fa-trash'"
                :title="'Sil'"
                :btnColor="'red'"
                v-if="showDelete"
                @onClick="onDeleteUserActivityWeek(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
          </template>
        </vuetable>
        <vuetable-pagination-info ref="paginationInfoaw"></vuetable-pagination-info>
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <vuetable-pagination-bootstrap
            class="float-right"
            ref="paginationaw"
            @vuetable-pagination:change-page="onChangePageActivityWeek"
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
  name: "useractivityweektask",
  data() {
    return {
      moreParamsActivityWeek: {},
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
    user: {},
    showDelete: {},
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
      if (data.length < 1) {
        appPlugin.showalert(
          "Uyarı",
          "Excele Veri Aktarmak İçin Tabloda Verileriniz Olması Gerekmektedir",
          "info",
          "Tamam"
        );
      } else {
        let keys = ["aCode", "aName", "pCode", "pName"];
        const header = [
          "Faaliyet Kodu",
          "Faaliyet Adı",
          "Dönem Kodu",
          "Dönem Adı"
        ];
        appPlugin.exportExcelTable(
          data,
          this.user[0].uName.toUpperCase() +
            " " +
            this.user[0].uSurname.toUpperCase() +
            " " +
            " Görevli Olduğu Haftalar",
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
      this.$refs.vuetableaw.reload();
    },
    onDeleteUserActivityWeek(item) {
      Swal.fire({
        title:
          this.$t("personname") +
          this.user[0].uName.toUpperCase() +
          " " +
          this.user[0].uSurname.toUpperCase() +
          "\n" +
          "Hafta  :" +
          item.pName +
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
            .dispatch("deleteUserActivityWeek", {
              userid: this.user[0].id,
              activityid: item.activity_id,
              periodid: item.period_id
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
              this.$refs.vuetableaw.reload();
              this.loading = false;
            });
        }
      });
    },
    onFetchUserActivityWeek(apiUrl, httpOptions) {
      if (this.onreset) {
        let data;
        if (this.txt.trim() != "") {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("fetchUserActivityWeek", {
              id: this.$route.params.id,
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                "pName%" + this.txt + "& user_id=" + this.$route.params.id
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
            data = this.$store.dispatch("fetchUserActivityWeek", {
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
    onLoadedUserActivityWeek() {
      this.loading = false;
    },
    onChangePageActivityWeek(page) {
      this.$refs.vuetableaw.changePage(page);
    },
    onPaginationDataUserActivityWeek(paginationData) {
      this.$refs.paginationaw.setPaginationData(paginationData);
      this.$refs.paginationInfoaw.setPaginationData(paginationData);
    },
    onLoadingUserActivityWeek() {
      this.loading = true;
    },
    onErrorUserActivityWeek(err) {
      this.loading = false;
      appPlugin.showalert(
        "Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
        "",
        "error",
        "Tamam"
      );
    },
    onSuccessUserActivityWeek() {},
    onUserActivityWeekSearch(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetableaw.refresh();
      });
    }
  }
};
</script>

<style scoped>
</style>
