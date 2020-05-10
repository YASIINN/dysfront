<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card
      column="col-md-12 col-sm-12 col-lg-12"
      :headerTitle="
        $store.getters.getSchools.sName + ' ' + $t('addschoollesson')
      "
    >
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <div
                  class="input-group input-group-merge"
                  :class="{ 'has-danger': isInvalid }"
                >
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
                    :options="$store.getters.getSchoolClasesPivot"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    :placeholder="$t('selectclass')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">{{
                    $t("pleaseselectclass")
                  }}</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <div
                  class="input-group input-group-merge"
                  :class="{ 'has-danger': isInvalid }"
                >
                  <multiselect
                    v-model="selectedLessons"
                    track-by="lName"
                    :hide-selected="false"
                    :multiple="true"
                    @close="onTouch"
                    :allow-empty="false"
                    label="lName"
                    :selectedLabel="$t('selected')"
                    :selectLabel="$t('select')"
                    deselectLabel
                    :options="$store.getters.getLessons"
                    :searchable="true"
                    :close-on-select="false"
                    :show-labels="true"
                    :placeholder="$t('selectlesson')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">{{
                    $t("selectlesson")
                  }}</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <v-button
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="'Ekle'"
                :disabled="
                  !(selectedLessons.length != 0 && selectedClass.length != 0)
                "
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>

        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showClasesAlert"
          @onClose="onCloseClasesAlert($event)"
        >
          Okula Ait Ders Ekleyebilmek İçin Okula Ait Sınıflar Sisteme Kayıt
          Edilmelidir. Eklemek İçin
          <router-link
            tag="a"
            target="_blank"
            :to="'/schools/' + $route.params.schoolid + '/clases'"
            >Buraya Tıklayın.</router-link
          >
        </alert-box>

        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showLessonsAlert"
          @onClose="onCloseLessonsAlert($event)"
        >
          Okula Ait Ders Ekleyebilmek İçin Sisteme Ders Kayıt Edilmelidir.
          Eklemek İçin
          <router-link tag="a" target="_blank" :to="'/lessons'"
            >Buraya Tıklayın.</router-link
          >
        </alert-box>
      </div>
    </flex-card>
    <flex-card
      column="col-md-12 col-sm-12 col-lg-12"
      :headerTitle="$store.getters.getSchools.sName + ' ' + 'Listeler'"
    >
      <div class="card-body">
        <v-tabs @onActiveTab="getActiveTabs($event)">
          <v-tab-content
            :title="$t('schoolclaseslessonlist')"
            icon="fas fa-code-branch"
          >
            <div class="row">
              <div class="col-md-12 col-sm-12 col-lg-12">
                <div class="card">
                  <div class="card-header border-0">
                    <div class="row">
                      <div class="col-md-6 col-sm-6 col-lg-6"></div>
                      <div class="col-md-6 col-sm-6 col-lg-6 text-right">
                        <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel(1)"/>


                      </div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <div class="col-md-12 col-sm-12 col-lg-12">
                      <div class="form-group">
                        <small>Dersleri Göster</small>
                        <div class="input-group input-group-merge">
                          <select
                            class="form-control"
                            data-toggle="select"
                            v-model="selectedLessonFilter"
                            @change="onFilterChange"
                          >
                            <option value="0">Normal</option>
                            <option value="1">Seçmeli</option>
                            <option value="2">Tümü</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <small class="text ml-3">{{$t('searchLesson')}}</small>
                    <SearchBox @search="onSearchHandler($event)"></SearchBox>
                    <vuetable
                      ref="vuetable"
                      :append-params="moreParams"
                      :fields="$store.getters.getSchoolLessonsClasesHeader"
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
                            @onClick="
                              onDelete(props.rowData, props.rowIndex, 0)
                            "
                          ></v-tooltip-button>
                        </div>
                      </template>
                    </vuetable>
                    <vuetable-pagination-info
                      ref="paginationInfo"
                    ></vuetable-pagination-info>
                    <div
                      class="dataTables_paginate paging_simple_numbers float-right"
                    >
                      <vuetable-pagination-bootstrap
                        class="float-right"
                        ref="pagination"
                        @vuetable-pagination:change-page="onChangePage"
                      ></vuetable-pagination-bootstrap>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-content>
          <v-tab-content :title="$t('schoollessonlist')" icon="fas fa-school">
            <flex column="col-md-12 col-sm-12 col-lg-12">
              <div class="card">
                <div class="card-header border-0">
                  <div class="row">
                    <div class="col-md-6 col-sm-6 col-lg-6"></div>
                    <div class="col-md-6 col-sm-6 col-lg-6 text-right">
                      <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel(0)"/>
                    </div>
                  </div>
                </div>
                <div class="table-responsive">
                  <div class="col-md-12 col-sm-12 col-lg-12">
                    <div class="form-group">
                      <small>Dersleri Göster</small>
                      <div class="input-group input-group-merge">
                        <select
                          class="form-control"
                          data-toggle="select"
                          v-model="selectedSchoolLessonFilter"
                          @change="onSchoolLessonFilterChange"
                        >
                          <option value="0">Normal</option>
                          <option value="1">Seçmeli</option>
                          <option value="2">Tümü</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <SearchBox
                    @search="onSchoolLessonsSearchHandler($event)"
                  ></SearchBox>
                  <vuetable
                    ref="vuetable2"
                    noDataTemplate="Kayıt Bulunamadı"
                    :append-params="schoolLessonsMoreParams"
                    :fields="$store.getters.getSchoolLessonsPivotHeader"
                    :http-fetch="onFetchSchoolLessonApi"
                    pagination-path
                    :per-page="5"
                    @vuetable:load-success="onSuccessSchoolLessons"
                    @vuetable:load-error="onErrorSchoolLessons"
                    @vuetable:pagination-data="onPaginationDataSchoolLessons"
                    @vuetable:loading="onSchoolLessonsLoading"
                    @vuetable:loaded="onLoadedSchoolLessons"
                  >
                    <template slot="actions" scope="props">
                      <div class="custom-actions">
                        <v-tooltip-button
                          :icon="'fas fa-trash'"
                          :title="'Sil'"
                          :btnColor="'red'"
                          @onClick="onDelete(props.rowData, props.rowIndex, 1)"
                        ></v-tooltip-button>
                      </div>
                    </template>
                  </vuetable>
                  <vuetable-pagination-info
                    ref="paginationInfo2"
                  ></vuetable-pagination-info>
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <vuetable-pagination-bootstrap
                      class="float-right"
                      ref="pagination2"
                      @vuetable-pagination:change-page="
                        onSchoolLessonsChangePage
                      "
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
  Swal,
  SearchBox,
  Loading,
  VSelect,
  AlertBox,
  FlexCard,
  Flex,
  VButton,
  VTabs,
  VTabContent,
  Multiselect,
  VTooltipButton,
  Vuetable,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  appPlugin
} from "@/Providers/defaultImports";

export default {
  name: "lesson",
  created() {
    this.loading = true;
    if (isNaN(+this.$route.params.schoolid) == false) {
      this.showSchool();
      this.$store
        .dispatch("fetchAllSchoolClasesPivot", {
          urlparse: appPlugin.urlParse(
            "schools.id=" + this.$route.params.schoolid
          )
        })
        .then(res => {
          if (res.data.length < 1) {
            this.showClasesAlert = true;
          }
        });
      this.$store.dispatch("fetchAllLessons").then(res => {
        if (res.data.length < 1) {
          this.showLessonsAlert = true;
        }
      });
    } else {
      appPlugin.showalert(this.$t("invalidparam"), "", "error", this.$t("ok"));
      this.$router.replace("/schools");
    }
    this.loading = false;
  },
  methods: {
    onCloseClasesAlert($event) {
      this.showClasesAlert = false;
    },
    onCloseLessonsAlert($event) {
      this.showLessonsAlert = false;
    },
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
            "\nDers : " +
            " " +
            item.lName +
            " " +
            "\nDers Türü :" +
            item.type +
            " " +
            "Ders" +
            "\n" +
            this.$t("sureDelete"),
          confirmButtonText: this.$t("yes"),
          icon: "info",
          confirmButtonColor: "red",
          cancelButtonText: this.$t("no"),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true;
            this.$store
              .dispatch("deleteSchoolLessonsClasesPivot", {
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
            "\n Ders : " +
            " " +
            item.lName +
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
              .dispatch("deleteSchoolLessonsPivot", {
                deleted: item,
                index: i,
                urlparse: appPlugin.urlParse(
                  "school_id=" +
                    item.school_id +
                    "& lesson_id=" +
                    item.lesson_id
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
    exportExcel(type) {
      if (type === 0) {
        if (this.schoolLessonCurrentData.data.data) {
          let data = this.schoolLessonCurrentData.data.data;
          let keys = ["sName", "sCode", "lName", "lCode", "type"];
          const header = [
            "Okul Adı",
            "Okul Kodu",
            "Ders Adı",
            "Ders Kodu",
            "Ders Türü"
          ];
          appPlugin.exportExcelTable(
            data,
            this.schoolLessonCurrentData.data.data[0].sName + " Ders  Listesi",
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
          let keys = [
            "sName",
            "sCode",
            "cName",
            "cCode",
            "lName",
            "lCode",
            "type"
          ];
          const header = [
            "Okul Adı",
            "Okul Kodu",
            "Sınıf Adı",
            "Sınıf Kodu",
            "Ders Adı",
            "Ders Kodu",
            "Ders Türü"
          ];
          appPlugin.exportExcelTable(
            data,
            this.currentData.data.data[0].sName + " Sınıf ve Ders Listesi",
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
          console.log("gelen", res);
          if (res.id == undefined) {
            this.$router.replace("/schools");
          }
        })
        .catch(err => {});
    },
    onFetchSchoolLessonApi(apiUrl, httpOptions) {
      var data;
      let query;
      if (this.txt.trim() != "") {
        if (this.selectedSchoolLessonFilter == 2) {
          query = appPlugin.urlParse(
            "school_id=" +
              this.$route.params.schoolid +
              "& lName%" +
              this.txt +
              "& parent_id=0"
          );
        } else {
          query = appPlugin.urlParse(
            "lName%" +
              this.txt +
              "& type=" +
              this.selectedSchoolLessonFilter +
              "& parent_id=0" +
              "& school_id=" +
              this.$route.params.schoolid
          );
        }
        data = this.$store.dispatch("fetcSchoolLessonsPivot", {
          httpOpt: httpOptions,
          urlparse: query

          //appPlugin.urlParse('school_id=' + this.$route.params.schoolid + '& lName%' + this.txt),
        });
        data.then(res => {
          this.schoolLessonCurrentData = res;
        });
        return data;
      } else {
        if (this.selectedSchoolLessonFilter == 2) {
          query = appPlugin.urlParse(
            "parent_id=0" + "& school_id=" + this.$route.params.schoolid
          );
        } else {
          query = appPlugin.urlParse(
            "type=" +
              this.selectedSchoolLessonFilter +
              "& parent_id=0" +
              "& school_id=" +
              this.$route.params.schoolid
          );
        }
        data = this.$store.dispatch("fetcSchoolLessonsPivot", {
          httpOpt: httpOptions,
          urlparse: query
          //appPlugin.urlParse('school_id=' + this.$route.params.schoolid)
        });
        data.then(res => {
          this.schoolLessonCurrentData = res;
        });
        return data;
      }
    },
    onSchoolLessonsSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable2.refresh();
      });
    },
    onSuccessSchoolLessons() {},
    onSuccess() {
      /* succesFetchDataApi */
    },
    onTouch() {
      this.isTouched = true;
    },
    getActiveTabs(data) {
      this.activeTab = data;
      this.txt = "";
      this.selectedSchoolLessonFilter = 2;
      this.selectedLessonFilter = 2;
      this.onRefreshTableContent();
    },
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
      this.$refs.vuetable2.reload();
    },
    onErrorSchoolLessons(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
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
    onSchoolLessonsChangePage(page) {
      this.$refs.vuetable2.changePage(page);
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onPaginationDataSchoolLessons(paginationData) {
      this.$refs.pagination2.setPaginationData(paginationData);
      this.$refs.paginationInfo2.setPaginationData(paginationData);
    },
    onSchoolLessonsLoading() {
      this.loading = true;
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onLoadedSchoolLessons() {
      this.loading = false;
    },
    onFetchApi(apiUrl, httpOptions) {
      var data;
      let query;
      if (this.txt.trim() != "") {
        if (this.selectedLessonFilter == 2) {
          query = appPlugin.urlParse(
            "school_id=" +
              this.$route.params.schoolid +
              "& lName%" +
              this.txt +
              "& parent_id=0"
          );
        } else {
          query = appPlugin.urlParse(
            "lName%" +
              this.txt +
              "& type=" +
              this.selectedLessonFilter +
              "& parent_id=0" +
              "& school_id=" +
              this.$route.params.schoolid
          );
        }
        data = this.$store.dispatch("fetchSchoolLessonsClasesPivot", {
          httpOpt: httpOptions,
          urlparse: query
          //appPlugin.urlParse('school_id=' + this.$route.params.schoolid + '& lName%' + this.txt),
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      } else {
        if (this.selectedLessonFilter == 2) {
          query = appPlugin.urlParse(
            "parent_id=0" + "& school_id=" + this.$route.params.schoolid
          );
        } else {
          query = appPlugin.urlParse(
            "type=" +
              this.selectedLessonFilter +
              "& parent_id=0" +
              "& school_id=" +
              this.$route.params.schoolid
          );
        }
        data = this.$store.dispatch("fetchSchoolLessonsClasesPivot", {
          httpOpt: httpOptions,
          urlparse: query
          //appPlugin.urlParse('school_id=' + this.$route.params.schoolid)
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      }
    },
    onResetData() {
      this.selectedClass = [];
      this.selectedLessons = [];
    },
    onSchoolLessonFilterChange() {
      this.$nextTick(function() {
        this.$refs.vuetable2.refresh();
      });
    },
    onFilterChange() {
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onCreateHandler() {
      let dataList = [];
      if (isNaN(+this.$route.params.schoolid) == false) {
        if (this.selectedClass.id == undefined) {
          appPlugin.showalert(
            "Uyarı",
            "Lütfen Sınıf Seçiniz",
            "error",
            "Tamam"
          );
        } else if (this.selectedLessons.length < 1) {
          appPlugin.showalert("Uyarı", "Lütfen Ders Seçiniz", "error", "Tamam");
        } else {
          this.selectedLessons.forEach(item => {
            dataList.push({
              school_id: +this.$route.params.schoolid,
              clases_id: this.selectedClass.id,
              lesson_id: item.id
            });
          });
          this.loading = true;
          this.$store
            .dispatch("createSchoolLessonsPivot", {
              created: dataList,
              urlparse: appPlugin.urlParse("c%" + this.txt)
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  //       appPlugin.showalert('Kayıt Eklendi', '', 'success', this.$t('ok'))
                  this.$store
                    .dispatch("createSchoolLessonsClasesPivot", {
                      created: dataList,
                      urlparse: appPlugin.urlParse("c%" + this.txt)
                    })
                    .then(res => {
                      if (res.status) {
                        appPlugin.showalert(
                          this.$t("succescreatemessage"),
                          "",
                          "success",
                          this.$t("ok")
                        );
                      } else {
                        appPlugin.showalert(
                          this.$t("errorcreatemessage"),
                          "",
                          "error",
                          this.$t("ok")
                        );
                      }
                    })
                    .catch(err => {
                      appPlugin.showalert(
                        this.$t("errorcreatemessage"),
                        "",
                        "error",
                        this.$t("ok")
                      );
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
              this.onRefreshTableContent();
              this.onResetData();
              this.loading = false;
            })
            .catch(err => {
              appPlugin.showalert(
                this.$t("errorcreatemessage"),
                "",
                "error",
                this.$t("ok")
              );
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
    }
  },
  computed: {
    isInvalid() {
      return (
        this.isTouched &&
        this.selectedClass.length === 0 &&
        this.selectedLessons.length === 0
      );
    }
  },
  data() {
    return {
      showLessonsAlert: false,
      showClasesAlert: false,
      activeTab: 0,
      txt: "",
      schoolLessonsMoreParams: {},
      moreParams: {},
      currentData: [],
      slCurrentData: [],
      loading: false,
      isTouched: false,
      selectedClass: [],
      selectedLessons: [],
      schoolLessonCurrentData: [],
      selectedSchoolLessonFilter: 2,
      selectedLessonFilter: 2,
      lessonTxt: "Normal Ders"
    };
  },
  components: {
    AlertBox,
    Multiselect,
    VSelect,
    VTabs,
    FlexCard,
    Flex,
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

<style scoped></style>
