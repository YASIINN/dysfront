<template>
  <v-tab-content tabKey="schoolclasbranch" :title="$t('persontaskbranches')" icon="fa fa-user">
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <a
        href="#"
        @click="exportExcel"
        class="btn btn-sm btn-primary btn-round btn-icon float-right mb-2"
        data-toggle="tooltip"
        data-original-title="Edit product"
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
      <Loading v-if="loading"></Loading>
      <div class="table-responsive">
        <!--TODO-->

        <SearchBox
          @search="onUserSchoolClasesBranchesSearch($event)"
          :placeHolderTxt="$t('search') "
        ></SearchBox>
        <vuetable
          ref="vuetable4"
          :append-params="uscbmoreParams"
          :fields="$store.getters.getUserSchoolClasesBranchesHeader"
          :http-fetch="onFetchUserSchoolClasesBranches"
          noDataTemplate="Kayıt Bulunamadı"
          pagination-path
          :per-page="5"
          @vuetable:load-success="onUserSchoolClasesBranchesSucces"
          @vuetable:load-error="onUserSchoolClasesBranchesError"
          @vuetable:pagination-data="onUserSchoolClasesBranchesPaginationData"
          @vuetable:loading="onUserSchoolClasesBranchesLoading"
          @vuetable:loaded="onUserSchoolClasesBranchesLoaded"
        >
          <template slot="mainteacher" scope="props">{{props.rowData.type==0?'-':'Sınıf Öğretmeni'}}</template>
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                v-if="showDelete"
                :icon="'fas fa-trash'"
                :title="$t('delete')"
                :btnColor="'red'"
                @onClick="onDeleteUserSchoolClasesBranches(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
          </template>
        </vuetable>
        <vuetable-pagination-info ref="paginationInfo4"></vuetable-pagination-info>
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <vuetable-pagination-bootstrap
            class="float-right"
            ref="pagination4"
            @vuetable-pagination:change-page="onUserSchoolClasesBranchesChangePage"
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
  data() {
    return {
      uscbmoreParams: {},
      txt: "",
      currentData: [],
      loading: false
    };
  },
  props: {
    showDelete: {},
    user: {},
    tabKey: {},
    icon: {},
    title: {},
    onUserSchoolClasesBranchRefreshTableContent: {
      type: Function
    },
    loadSchoolTask: {},
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
        let keys = ["sCode", "sName", "cCode", "cName", "bCode", "bName"];
        const header = [
          "Okul Kodu",
          "Okul Adı",
          "Sınıf Kodu",
          "Sınıf Adı",
          "Şube Kodu",
          "Şube Adı"
        ];
        appPlugin.exportExcelTable(
          data,
          this.user[0].uName.toUpperCase() +
            " " +
            this.user[0].uSurname.toUpperCase() +
            " " +
            " Görevli Olduğu Şubeler",
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
      this.$refs.vuetable4.reload();
    },
    onUserSchoolClasesBranchesSucces() {},
    onUserSchoolClasesBranchesError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onUserSchoolClasesBranchesLoading() {
      this.loading = true;
    },
    onUserSchoolClasesBranchesLoaded() {
      this.loading = false;
    },
    onDeleteUserSchoolClasesBranches(item, i) {
      Swal.fire({
        title:
          this.$t("personname") +
          this.user[0].uName.toUpperCase() +
          " " +
          " " +
          this.user[0].uSurname.toUpperCase() +
          "\n " +
          this.$t("branchname") +
          item.bName +
          " \n" +
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
            .dispatch("deleteUserSchoolClasesBranches", {
              deleted: item,
              index: i
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
              this.$refs.vuetable4.reload();
              this.loading = false;
            });
        }
      });
    },
    onUserSchoolClasesBranchesChangePage(page) {
      this.$refs.vuetable4.changePage(page);
    },
    onUserSchoolClasesBranchesPaginationData(paginationData) {
      this.$refs.pagination4.setPaginationData(paginationData);
      this.$refs.paginationInfo4.setPaginationData(paginationData);
    },
    onFetchUserSchoolClasesBranches(apiUrl, httpOptions) {
      if (this.onreset) {
        var data;
        if (this.txt.trim() != "") {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("getUserSchoolClasesBranchesU", {
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                "bName%" + this.txt + "& user_id=" + this.$route.params.id
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
            data = this.$store.dispatch("getUserSchoolClasesBranchesU", {
              httpOpt: httpOptions,
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
    onUserSchoolClasesBranchesSearch(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable4.refresh();
      });
    }
  }
};
</script>

<style scoped>
</style>
