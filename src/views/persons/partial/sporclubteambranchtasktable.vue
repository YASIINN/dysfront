<template>
  <v-tab-content :title="title" :tabKey="tabKey" :icon="icon">
    <Loading v-if="loading"></Loading>

    <div class="row">
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
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="headerData"
            :http-fetch="onFetchApi"
            noDataTemplate="Kayıt Bulunamadı"
            pagination-path
            :per-page="5"
            @vuetable:load-success="onSuccess"
            @vuetable:load-error="onError"
            @vuetable:pagination-data="onPaginationData"
            @vuetable:loading="onLoading"
            @vuetable:loaded="onLoaded"
          >
            <template slot="actions" scope="props">
              <div class="custom-actions">
                <v-tooltip-button
                  v-if="showDelete"
                  :icon="'fas fa-trash'"
                  :title="'Sil'"
                  :btnColor="'red'"
                  @onClick="onDeleteUserSporClubTeam(props.rowData, props.rowIndex)"
                ></v-tooltip-button>
              </div>
            </template>
          </vuetable>
          <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
          <div class="dataTables_paginate paging_simple_numbers float-right">
            <vuetable-pagination-bootstrap
              class="float-right"
              ref="pagination"
              @vuetable-pagination:change-page="onChangePage"
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
  watch: {
    onreset: function(val) {
      if (val == true) {
        this.onRefresh();
      }
    },
    currentData: function(val) {
      if (val.data.data.length < 1) {
        this.user[0].uStatus.school = false;
        this.$store
          .dispatch("updatePersonStatus", {
            id: this.user[0].id,
            status: this.user[0].uStatus
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
              }
            } else {
            }
          })
          .catch(err => {});
      }
    }
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
  name: "sporclubteambranhtasktable",
  props: {
    showDelete: {},
    user: {},
    tabKey: {},
    icon: {},
    title: {},
    loadSchoolTask: {},
    onreset: {}
  },
  data() {
    return {
      headerData: [
        {
          name: "__sequence",
          title: "#",
          titleClass: "center aligned",
          dataClass: "right aligned"
        },
        {
          name: "scCode",
          title: '<i class="fas fa-lightbulb"></i>Spor Kulübü Kodu'
        },
        {
          name: "scName",
          title: '<i class="far fa-file-alt"></i> Spor Kulübü Adı'
        },
        {
          name: "stCode",
          title: '<i class="fas fa-lightbulb"></i>Takım Kodu'
        },
        {
          name: "stName",
          title: '<i class="far fa-file-alt"></i> Takım Adı'
        },
        {
          name: "sbCode",
          title: '<i class="fas fa-lightbulb"></i>Şube Kodu'
        },
        {
          name: "sbName",
          title: '<i class="far fa-file-alt"></i> Şube Adı'
        },
        {
          name: "__slot:actions",
          title: '<i class="fas fa-pen-fancy"></i>İşlemler'
        }
      ],
      moreParams: {},
      txt: "",
      currentData: [],
      loading: false
    };
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
        let keys = ["scCode", "scName", "stCode", "stName", "sbCode", "sbName"];
        const header = [
          "Spor Kulübü Kodu",
          "Spor Kulübü Adı",
          "Takım Kodu",
          "Takım Adı",
          "Şube Kodu",
          "Şube Adı"
        ];
        appPlugin.exportExcelTable(
          data,
          this.user[0].uName.toUpperCase() +
            " " +
            this.user[0].uSurname.toUpperCase() +
            " " +
            " Görevli Olduğu Takımlar",
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
      this.$refs.vuetable.reload();
    },
    onDeleteUserSporClubTeam(item, i) {
      Swal.fire({
        title:
          this.$t("personname") +
          this.user[0].uName.toUpperCase() +
          " " +
          this.user[0].uSurname.toUpperCase() +
          "\n" +
          "Spor Kulübü Adı :" +
          item.scName +
          "\n" +
          "Takım Adı :" +
          item.stName +
          "\n" +
          "Şube Adı :" +
          item.sbName +
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
            .dispatch("deleteUserSporClubTeam", {
              deleted: item,
              index: i,
              userid: item.user_id,
              sporclubid: item.spor_club_id,
              teamid: item.team_id,
              branchid: item.spor_club_team_branch_id
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  this.$refs.vuetable.reload();
                  //TODO güncelleme okuldan status
                  /*   this.user[0].uStatus.school = true
                      this.$store.dispatch('updatePersonStatus', {
                        id: userID,
                        status: this.user[0].uStatus
                      }).then((res)=>{
                        if (res.status) {
                          if (res.status === 200) {

                          }
                        }else{

                        }
                      }).catch((err)=>{

                      })*/

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

              this.loading = false;
            });
        }
      });
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onSuccess() {},
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onFetchApi(apiUrl, httpOptions) {
      if (this.onreset) {
        var data;
        if (this.txt.trim() != "") {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch("fetchPersonClubTeam", {
              id: this.$route.params.id,
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                "stName%" + this.txt + "& user_id=" + this.$route.params.id
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
            data = this.$store.dispatch("fetchPersonClubTeam", {
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
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    }
  }
};
</script>

<style scoped>
</style>
