<template>
  <v-tab-content :title="title" :tabKey="tabKey" icon="fas fa-school">
    <div class="row">
      <Loading v-if="loading"></Loading>
      <div class="col-md-12 col-sm-12 col-lg-12">
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
          <SearchBox @search="onUserSchoolClasesSearch($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable3"
            :append-params="uscmoreParams"
            :fields="$store.getters.getUserSchoolClasesHeader"
            :http-fetch="onFetchUserSchoolClases"
            noDataTemplate="Kayıt Bulunamadı"
            pagination-path
            :per-page="5"
            @vuetable:load-success="onUserSchoolClasesSucces"
            @vuetable:load-error="onUserSchoolClasesError"
            @vuetable:pagination-data="onUserSchoolClasesPaginationData"
            @vuetable:loading="onUserSchoolClasesLoading"
            @vuetable:loaded="onUserSchoolClasesLoaded"
          >
            <template slot="actions" scope="props">
              <div class="custom-actions">
                <v-tooltip-button
                  :icon="'fas fa-trash'"
                  :title="'Sil'"
                  :btnColor="'red'"
                  v-if="showDelete"
                  @onClick="onDeleteonUserSchoolClases(props.rowData, props.rowIndex)"
                ></v-tooltip-button>
              </div>
            </template>
          </vuetable>
          <vuetable-pagination-info ref="paginationInfo3"></vuetable-pagination-info>
          <div class="dataTables_paginate paging_simple_numbers float-right">
            <vuetable-pagination-bootstrap
              class="float-right"
              ref="pagination3"
              @vuetable-pagination:change-page="onUserSchoolClasesChangePage"
            ></vuetable-pagination-bootstrap>
          </div>
        </div>
      </div>
    </div>
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
  name: "schoolclasestasktable",
  data() {
    return {
      uscmoreParams: {},
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
    onUserSchoolClasesRefreshTableContent: {
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
        let keys = ["sCode", "sName", "cCode", "cName"];
        const header = ["Okul Kodu", "Okul Adı", "Sınıf Kodu", "Sınıf Adı"];
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
      this.$refs.vuetable3.reload();
    },
    onUserSchoolClasesChangePage(page) {
      this.$refs.vuetable3.changePage(page);
    },
    onDeleteonUserSchoolClases(item, i) {
      Swal.fire({
        title:
          this.$t("personname") +
          this.user[0].uName.toUpperCase() +
          " " +
          this.user[0].uSurname.toUpperCase() +
          "\n" +
          this.$t("clasname") +
          item.cName +
          "\n " +
          this.$t("sureDelete"),
        confirmButtonText: this.$t("yes"),
        confirmButtonColor: "red",
        cancelButtonText: this.$t("cancel"),
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;
          console.log(item);
          this.$store
            .dispatch("deleteUserSchoolClases", {
              deleted: item,
              index: i,
              query: appPlugin.urlParse(
                "user_id=" +
                  item.users_id +
                  "& school_id=" +
                  item.school_id +
                  "& clases_id=" +
                  item.clases_id
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

              this.$refs.vuetable3.reload();
              this.loading = false;
            });
        }
      });
    },
    onUserSchoolClasesPaginationData(paginationData) {
      this.$refs.pagination3.setPaginationData(paginationData);
      this.$refs.paginationInfo3.setPaginationData(paginationData);
    },
    onUserSchoolClasesLoading() {
      this.loading = true;
    },
    onUserSchoolClasesLoaded() {
      this.loading = false;
    },
    onUserSchoolClasesError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onUserSchoolClasesSucces() {},
    onFetchUserSchoolClases(apiUrl, httpOptions) {
      //getuserschoolclases
      if (this.onreset) {
        var data;
        if (this.txt.trim() != "") {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("getUserSchoolClasesU", {
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                "cName%" + this.txt + "& user_id=" + this.$route.params.id
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
            data = this.$store.dispatch("getUserSchoolClasesU", {
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
    onUserSchoolClasesSearch(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable3.refresh();
      });
    }
  }
};
</script>

<style scoped>
</style>
