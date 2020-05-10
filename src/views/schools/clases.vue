<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card
      column="col-md-12 col-sm-12 col-lg-12"
      :headerTitle="$store.getters.getSchools.sName+ ' '+ $t('addclas')"
    >
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <div class="input-group input-group-merge" :class="{ 'has-danger': isInvalid }">
                  <multiselect
                    v-model="selectedClass"
                    track-by="cName"
                    :hide-selected="false"
                    @close="onTouch"
                    :allow-empty="false"
                    label="cName"
                    :selectedLabel="$t('selected')"
                    :selectLabel="$t('select')"
                    deselectLabel
                    :options="$store.getters.getClases"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    :placeholder="$t('selectclass')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">{{$t('pleaseselectclass')}}</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <div class="input-group input-group-merge" :class="{ 'has-danger': isInvalid }">
                  <multiselect
                    v-model="selectedBranches"
                    track-by="bName"
                    :hide-selected="false"
                    :multiple="true"
                    @close="onTouch"
                    :allow-empty="false"
                    label="bName"
                    :selectedLabel="$t('selected')"
                    :selectLabel="$t('select')"
                    deselectLabel
                    :options="$store.getters.getBranches"
                    :searchable="true"
                    :close-on-select="false"
                    :show-labels="true"
                    :placeholder="$t('selectbranches')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">{{$t('pleaseselectbranch')}}</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <v-button
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="$t('add')"
                :disabled="!(selectedBranches.length!=0 && selectedClass.length!=0)"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
      <alert-box
        class="alert-secondary"
        iconName="fa fa-check-circle"
        v-if="showClasesAlert"
        @onClose="onCloseClasesAlert($event)"
      >
        Okula Ait Sınıf Ekleyebilmek İçin Sisteme Sınıf Kayıt Edilmelidir. Eklemek İçin
        <router-link tag="a" target="_blank" :to="'/clases'">Buraya Tıklayın.</router-link>
      </alert-box>
      <alert-box
        class="alert-secondary"
        iconName="fa fa-check-circle"
        v-if="showBranchesAlert"
        @onClose="onCloseBranchesAlert($event)"
      >
        Okula Ait Şube Ekleyebilmek İçin Sisteme Şube Kayıt Edilmelidir. Eklemek İçin
        <router-link tag="a" target="_blank" :to="'/branches'">Buraya Tıklayın.</router-link>
      </alert-box>
    </flex-card>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$store.getters.getSchools.sName+' '+ $t('lists')">
      <div class="card-body">
        <v-tabs @onActiveTab="getActiveTabs($event)">
          <v-tab-content :title="$t('classbranchlist')" icon="fas fa-code-branch">
            <flex column="col-md-12 col-sm-12 col-lg-12">
              <div class="card">
                <div class="card-header border-0">
                  <div class="row">
                    <div class="col-md-6 col-sm-6 col-lg-6">
                      <h3 class="mb-0">Okul Sınıf</h3>
                    </div>
                    <div class="col-md-6 col-sm-6 col-lg-6 text-right">
                      <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel(1)"/>

                    </div>
                  </div>
                </div>
                <div class="table-responsive">
                  <small class="text ml-3">{{$t('searchClass')}}</small>
                  <SearchBox @search="onSearchHandler($event)"></SearchBox>
                  <vuetable
                    ref="vuetable"
                    :append-params="moreParams"
                    :fields="$store.getters.getSchoolBranchesClasesHeader"
                    :http-fetch="onFetchApi"
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
                          :icon="'fas fa-trash'"
                          :title="'Sil'"
                          :btnColor="'red'"
                          @onClick="onDelete(props.rowData, props.rowIndex,0)"
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
            </flex>
          </v-tab-content>
          <v-tab-content :title="$t('classlistschool') " icon="fas fa-school">
            <flex column="col-md-12 col-sm-12 col-lg-12">
              <div class="card">
                <div class="card-header border-0">
                  <div class="row">
                    <div class="col-md-6 col-sm-6 col-lg-6">
                      <h3 class="mb-0">Okul Sınıf</h3>
                    </div>
                    <div class="col-md-6 col-sm-6 col-lg-6 text-right">
                      <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel(0)"/>
                    </div>
                  </div>
                </div>
                <div class="table-responsive">
                  <SearchBox @search="onSchoolClasesSearchHandler($event)"></SearchBox>
                  <vuetable
                    ref="vuetable2"
                    :append-params="schoolClasesMoreParams"
                    :fields="$store.getters.getSchoolClasesHeader"
                    :http-fetch="onFetchSchoolClasesApi"
                    pagination-path
                    noDataTemplate="Kayıt Bulunamadı"
                    :per-page="5"
                    @vuetable:load-success="onSuccessSchoolClases"
                    @vuetable:load-error="onErrorSchoolClases"
                    @vuetable:pagination-data="onPaginationDataSchoolClases"
                    @vuetable:loading="onSchoolClasesLoading"
                    @vuetable:loaded="onLoadedSchoolClases"
                  >
                    <template slot="actions" scope="props">
                      <div class="custom-actions">
                        <v-tooltip-button
                          :icon="'fas fa-trash'"
                          :title="'Sil'"
                          :btnColor="'red'"
                          @onClick="onDelete(props.rowData, props.rowIndex,1)"
                        ></v-tooltip-button>
                      </div>
                    </template>
                  </vuetable>
                  <vuetable-pagination-info ref="paginationInfo2"></vuetable-pagination-info>
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <vuetable-pagination-bootstrap
                      class="float-right"
                      ref="pagination2"
                      @vuetable-pagination:change-page="onSchoolClasesChangePage"
                    ></vuetable-pagination-bootstrap>
                  </div>
                </div>
              </div>
            </flex>
          </v-tab-content>
        </v-tabs>
      </div>
    </flex-card>
  </div>
</template>

<script>
import {
  Multiselect,
  VTabs,
  VTabContent,
  SearchBox,
  Loading,
  AlertBox,
  FlexCard,
  Flex,
  VButton,
  VTooltipButton,
  Vuetable,
  Swal,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  appPlugin
} from "@/Providers/defaultImports";

export default {
  name: "clases",
  computed: {
    isInvalid() {
      return (
        this.isTouched &&
        this.selectedClass.length === 0 &&
        this.selectedBranches.length === 0
      );
    }
  },
  data() {
    return {
      showClasesAlert: false,
      showBranchesAlert: false,
      activeTab: 0,
      txt: "",
      schoolClasesMoreParams: {},
      moreParams: {},
      isTouched: false,
      selectedClass: [],
      currentData: [],
      schoolClasesCurrentData: [],
      selectedBranches: [],
      loading: false,
      clases: {}
    };
  },
  methods: {
    onCloseClasesAlert($event) {
      this.showClasesAlert = false;
    },
    onCloseBranchesAlert($event) {
      this.showBranchesAlert = false;
    },
    getActiveTabs(data) {
      this.activeTab = data;
      this.onRefreshTableContent();
    },
    onFetchSchoolClasesApi(apiUrl, httpOptions) {
      var data;
      if (this.txt.trim() != "") {
        data = this.$store.dispatch("fetchSchoolClasesPivot", {
          httpOpt: httpOptions,
          urlparse: appPlugin.urlParse(
            "school_id=" + this.$route.params.schoolid + "& cName%" + this.txt
          )
        });
        data.then(res => {
          this.schoolClasesCurrentData = res;
        });
        return data;
      } else {
        data = this.$store.dispatch("fetchSchoolClasesPivot", {
          httpOpt: httpOptions,
          urlparse: appPlugin.urlParse(
            "school_id=" + this.$route.params.schoolid
          )
        });
        data.then(res => {
          this.schoolClasesCurrentData = res;
        });
        return data;
      }
    },
    onSuccessSchoolClases() {},
    onErrorSchoolClases() {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onCreateHandler() {
      let dataList = [];
      if (isNaN(+this.$route.params.schoolid) == false) {
        if (this.selectedClass.id == undefined) {
        } else if (this.selectedBranches.length < 1) {
        } else {
          this.selectedBranches.forEach(item => {
            dataList.push({
              school_id: +this.$route.params.schoolid,
              clases_id: this.selectedClass.id,
              branches_id: item.id
            });
          });
          this.loading = true;
          this.$store
            .dispatch("createSchoolClasesPivot", {
              clases_id: this.selectedClass.id,
              school_id: this.$route.params.schoolid,
              urlparse: appPlugin.urlParse(
                "school_id=" +
                  this.$route.params.schoolid +
                  "& clases_id=" +
                  this.selectedClass.id
              )
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  this.onResetData();
                  this.$store
                    .dispatch("createSchoolClasesBranchesPivot", {
                      created: dataList,
                      urlparse: appPlugin.urlParse("c%" + this.txt)
                    })
                    .then(res => {
                      if (res.status) {
                        if (res.status === 200) {
                          appPlugin.showalert(
                            this.$t("succescreatemessage"),
                            "",
                            "success",
                            this.$t("ok")
                          );
                        }
                      } else {
                        appPlugin.showalert(
                          this.$t("errorcreatemessage"),
                          "",
                          "error",
                          this.$t("ok")
                        );
                      }
                      this.onRefreshTableContent();
                      this.loading = false;
                    });
                }
              } else {
                appPlugin.showalert(
                  this.$t("errorcreatemessage"),
                  "",
                  "error",
                  this.$t("ok")
                );
              }
            });
        }
      } else {
        appPlugin.showalert(
          this.$t("invalidparam"),
          "",
          "error",
          this.$t("ok")
        );
        this.$router.replace("/schools");
      }
    },
    onSuccess() {},
    onDelete(item, i, type) {
      if (type === 0) {
        Swal.fire({
          title:
            "Okul :" +
            " " +
            item.sName +
            " " +
            "\n Sınıf : " +
            " " +
            item.cName +
            "" +
            "\nŞube : " +
            " " +
            item.bName +
            "\n" +
            this.$t("sureDelete"),
          confirmButtonText: this.$t("yes"),
          confirmButtonColor: "red",
          cancelButtonText: this.$t("no"),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true;
            this.$store
              .dispatch("deleteSchoolClasesBranchesPivot", {
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

                this.onRefreshTableContent();
                this.loading = false;
              });
          }
        });
      } else {
        Swal.fire({
          title:
            "Okul :" +
            " " +
            item.sName +
            " " +
            "\n Sınıf : " +
            " " +
            item.cName +
            "" +
            "\n" +
            this.$t("sureDelete"),
          confirmButtonText: this.$t("yes"),
          confirmButtonColor: "red",
          cancelButtonText: this.$t("no"),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true;
            this.$store
              .dispatch("deleteSchoolClasesPivot", {
                deleted: item,
                index: i,
                urlparse: appPlugin.urlParse(
                  "school_id=" +
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

                this.onRefreshTableContent();
                this.loading = false;
              });
          }
        });
      }
    },
    onTouch() {
      this.isTouched = true;
    },
    onFetchApi(apiUrl, httpOptions) {
      var data;
      if (this.txt.trim() != "") {
        data = this.$store.dispatch("fetchSchoolClasesBranchesPivot", {
          httpOpt: httpOptions,
          urlparse: appPlugin.urlParse(
            "school_id=" + this.$route.params.schoolid + "& cName%" + this.txt
          )
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      } else {
        data = this.$store.dispatch("fetchSchoolClasesBranchesPivot", {
          httpOpt: httpOptions,
          urlparse: appPlugin.urlParse(
            "schools.id=" + this.$route.params.schoolid
          )
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      }
    },
    onResetData() {
      this.selectedClass = [];
      this.selectedBranches = [];
    },
    onError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    exportExcel(type) {
      if (type === 0) {
        if (this.schoolClasesCurrentData.data.data.length) {
          let data = this.schoolClasesCurrentData.data.data;
          let keys = ["sName", "sCode", "cName", "cCode"];
          const header = ["Okul Adı", "Okul Kodu", "Sınıf Adı", "Sınıf Kodu"];
          appPlugin.exportExcelTable(
            data,
            this.currentData.data.data[0].sName + " Sınıf  Listesi",
            14,
            keys,
            header
          );
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      } else {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data;
          let keys = ["sName", "sCode", "cName", "cCode", "bName", "bCode"];
          const header = [
            "Okul Adı",
            "Okul Kodu",
            "Sınıf Adı",
            "Sınıf Kodu",
            "Şube Adı",
            "Şube Kodu"
          ];
          appPlugin.exportExcelTable(
            data,
            this.currentData.data.data[0].sName + " Sınıf ve Şube Listesi",
            14,
            keys,
            header
          );
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      }
    },
    showSchool() {
      this.$store
        .dispatch("showSchool", { id: this.$route.params.schoolid })
        .then(res => {
          if (res.id == undefined) {
            this.$router.replace("/schools");
          }
        })
        .catch(err => {});
    },
    onSchoolClasesSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable2.refresh();
      });
    },
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onSchoolClasesChangePage(page) {
      this.$refs.vuetable2.changePage(page);
    },
    onPaginationDataSchoolClases(paginationData) {
      this.$refs.pagination2.setPaginationData(paginationData);
      this.$refs.paginationInfo2.setPaginationData(paginationData);
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onSchoolClasesLoading() {
      this.loading = true;
    },
    onLoading() {
      this.loading = true;
    },
    onLoadedSchoolClases() {
      this.loading = false;
    },
    onLoaded() {
      this.loading = false;
    },
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
      this.$refs.vuetable2.reload();
    }
  },

  created() {
    this.loading = true;
    this.showSchool();
    this.$store.dispatch("fetchAllClases").then(res => {
      if (res.data.length < 1) {
        this.showClasesAlert = true;
      }
    });
    this.$store.dispatch("fetchAllBranches").then(res => {
      if (res.data.length < 1) {
        this.showBranchesAlert = true;
      }
    });

    this.loading = false;
  },
  components: {
    Multiselect,
    AlertBox,
    VTabs,
    Flex,
    FlexCard,
    VTabContent,
    SearchBox,
    Loading,
    VButton,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  }
};
</script>

<style scoped>
</style>
