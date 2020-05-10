<template>
  <div>
    <Loading v-if="loading"></Loading>
    <modal
      @close="onCloseModal"
      v-if="modals.modal"
      :show.sync="modals.modal"
      modal-classes=" modal-dialog-centered"
    >
      <Loading v-if="changePersonLoading"></Loading>
      <div slot="header">
        <h6
          class="modal-title"
          id="modal-title-notification"
        >{{ 'Gün : ' + ' ' + selectedDay.sdName }}</h6>
        <br />
        <h6 class="modal-title">{{ 'Ders : ' + selectedHours.shName }}</h6>
        <br />
        <h6 class="modal-title">
          {{ 'Başlangıç Saati : ' + selectedHours.beginDate }} -
          {{ 'Bitiş Saati : ' + selectedHours.endDate }}
        </h6>
      </div>
      <div class="form-group">
        <label>Ders Seçiniz</label>
        <multiselect
          @input="onChangeLesson"
          v-model="selectedLesson"
          track-by="lName"
          :allow-empty="false"
          label="lName"
          selectedLabel="Seçili"
          selectLabel="Seç"
          :hide-selected="false"
          :multiple="false"
          deselectLabel
          :options="schoollesson"
          :searchable="true"
          :close-on-select="true"
          :show-labels="true"
          placeholder="Ders Seçiniz"
        ></multiselect>
      </div>
      <div class="form-group">
        <label>Personel Seçiniz</label>
        <multiselect
          v-model="selectedPersons"
          track-by="uFullName"
          :allow-empty="false"
          label="uFullName"
          selectedLabel="Seçili"
          selectLabel="Seç"
          :hide-selected="false"
          :multiple="true"
          deselectLabel
          :options="schoollessonData"
          :searchable="true"
          :close-on-select="false"
          :show-labels="true"
          placeholder="Personel Seçiniz"
        ></multiselect>
      </div>
      <div class="form-group">
        <v-button
          v-if="updateMode"
          btnName="Güncelle"
          @onClick="updateSchoolProgram"
          class="btn-warning float-right"
        ></v-button>

        <v-button
          v-if="!updateMode"
          btnName="Kaydet"
          @onClick="saveSchoolProgram"
          class="btn-primary float-right"
        ></v-button>
      </div>
    </modal>
    <!-- {{$store.getters.getSchoolProgram}} -->
    <!-- v-if="$store.getters.getSchoolProgram.length>0" -->

    <table class="table table-bordered table-responsive table-hover table-striped">
      <thead>
        <th></th>
        <th v-for="(item, i) in daysData">
          <h5 class="text-center">{{ item.sdName }}</h5>
        </th>
      </thead>
      <tbody>
        <tr v-for="(hours, j) in daysData[0].hours" v-if="daysData[0].hours">
          <td>
            <h5>
              {{ hours.shName }}
              <br />
              {{ hours.beginDate }} - {{ hours.endDate }}
            </h5>
          </td>
          <td v-for="(program, i) in daysData">
            <p class="text-center">Ders Adı : {{ getLessons(i, j) }}</p>
            <div class="form-group">
              <p class="text-center">Görevli Personeller :</p>
              <ul>
                <li v-for="item in getPersons(i, j)">
                  <router-link
                    :to="'/userdetail/' + item.user_id"
                    tag="a"
                    target="_blank"
                  >{{ item.uFullName }}</router-link>
                </li>
              </ul>
            </div>
            <div class="form-group">
              <v-button
                btnIcon="fa fa-plus"
                v-if="
                  showVisible == undefined
                    ? getLessons(i, j) == '' && getPersons(i, j).length == 0
                    : showVisible
                "
                class="btn-sm btn-success"
                @onClick="openModal(i, j)"
              ></v-button>

              <v-button
                v-if="
                  showVisible == undefined
                    ? getLessons(i, j) != '' && getPersons(i, j).length != 0
                    : showVisible
                "
                btnIcon="fa fa-trash"
                @onClick="deleteSchoolProgram(i, j)"
                class="btn-sm btn-danger"
              ></v-button>
              <v-button
                v-if="
                  showVisible == undefined
                    ? getLessons(i, j) != '' && getPersons(i, j).length != 0
                    : showVisible
                "
                btnIcon="fa fa-edit"
                @onClick="openUpdateModal(i, j)"
                class="btn-sm btn-warning"
              ></v-button>
              <v-button
                v-if="
                  showVisible == undefined
                    ? getLessons(i, j) != '' && getPersons(i, j).length != 0
                    : showVisible
                "
                btnIcon="fa fa-copy"
                @onClick="copyProgramData(i, j)"
                class="btn-sm btn-info"
              ></v-button>
              <v-button
                v-if="showVisible == undefined ? true : showVisible"
                btnIcon="fa fa-paste"
                @onClick="pasteProgramData(i, j)"
                class="btn-sm btn-primary"
              ></v-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Modal from "@/components/amodal/Modal";
import Vue from "vue";
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
  appPlugin
} from "@/Providers/defaultImports";

export default {
  name: "createprogramtable",
  props: {
    showVisible: {},
    school: {},
    fetchscoollesson: {},
    selectedClass: {}
  },
  watch: {
    fetchscoollesson(val) {
      if (val == true) {
        this.onFetchScoolLesson();
      }
    },
    selectedClass(val) {
      this.fetchHourDays();
      this.fetchPrograms();
    }
  },
  async created() {
    this.loading = true;
    let schooldays = this.$store.getters.getSchoolDays;
    // await this.$store.dispatch("fetchSchoolDays", {
    //   urlparse: appPlugin.urlParse("school_p_type_id=" + this.$route.params.id)
    // });
    let schoolhour = this.$store.getters.getSchoolHour;
    // await this.$store.dispatch("fetchSchoolHours", {
    //   urlparse: appPlugin.urlParse("school_p_type_id=" + this.$route.params.id)
    // });
    //     let activitydays = this.$store.getters.activitypdays;
    // let activityhour = this.$store.getters.activityphours;
    this.loading = false;
    // this.onFetchScoolLesson();
    schooldays.forEach(item => {
      item.hours = [];
      schoolhour.forEach(hour => {
        item.hours.push({
          shName: hour.shName,
          beginDate: hour.beginDate,
          endDate: hour.endDate,
          hourid: hour.id,
          lessonid: "",
          personData: []
        });
      });
    });
    this.hoursData = schoolhour;
    this.daysData = schooldays;
  },
  data() {
    return {
      modals: {
        modal: false
      },
      updateMode: false,
      changePersonLoading: false,
      loading: false,
      selectedDay: {},
      selectedHours: {},
      selectedLesson: {},
      selectedPersons: [],
      schoollessonData: [],
      hoursData: [],
      daysData: [],
      programData: [],
      schoolProgram: [],
      schoollesson: [],
      selectedData: {
        data: "",
        index: ""
      }
    };
  },
  methods: {
    async fetchHourDays() {
      this.loading = true;
      let schooldays = this.$store.getters.getSchoolDays;
      let schoolhour = this.$store.getters.getSchoolHour;
      this.loading = false;
      schooldays.forEach(item => {
        item.hours = [];
        schoolhour.forEach(hour => {
          item.hours.push({
            shName: hour.shName,
            beginDate: hour.beginDate,
            endDate: hour.endDate,
            hourid: hour.id,
            lessonid: "",
            personData: []
          });
        });
      });
      this.hoursData = schoolhour;
      this.daysData = schooldays;
    },
    copyProgramData(i, j) {
      let finded = this.$store.getters.getSchoolProgram.find(item => {
        return (
          item.school_day_id == this.daysData[i].id &&
          item.school_hour_id == this.daysData[i].hours[j].hourid
        );
      });
      let findexIndex = this.$store.getters.getSchoolProgram.findIndex(
        (item, index) => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        }
      );
      if ((finded.schoolprogramid = !undefined && findexIndex > -1)) {
        this.selectedData.data = finded;
        this.selectedData.index = findexIndex;
        Vue.$toast.open({
          message: "Kopyalandı",
          type: "success",
          position: "top"
        });
      }
    },
    pasteProgramData: function(i, j) {
      if (this.selectedData.data.schoolprogramid == undefined) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Önce Kopyalama İşlemi Gerçekleştirini",
          "info",
          "Tamam"
        );
      } else {
        let finded = this.$store.getters.getSchoolProgram.find(item => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        });
        let findexIndex = this.$store.getters.getSchoolProgram.findIndex(
          (item, index) => {
            return (
              item.school_day_id == this.daysData[i].id &&
              item.school_hour_id == this.daysData[i].hours[j].hourid
            );
          }
        );
        if (finded && finded.schoolprogramid != undefined && findexIndex > -1) {
          let updatedData = {
            lessonid: this.selectedData.data.lessons.lesson_id,
            lName: this.selectedData.data.lessons.lName,
            spcontentid: finded.scoolprogramcontentid,
            urlparse: appPlugin.urlParse("id=" + finded.scoolprogramcontentid),
            userData: this.selectedData.data.users,
            findexIndex: findexIndex,
            dayid: finded.school_day_id,
            hourid: finded.school_hour_id
          };
          this.loading = true;
          this.$store
            .dispatch("updateSchoolProgram", updatedData)
            .then(res => {
              if (res && res.status === 200) {
                this.onCloseModal();
                appPlugin.showalert(
                  this.$t("updateSuccesMsg"),
                  "",
                  "success",
                  this.$t("ok")
                );
              } else if (res.status == 204) {
                appPlugin.showalert(
                  "Uyarı",
                  "Personel Başka Bir Sınıfta Aynı Gün Ve Saatte Görevli",
                  "info",
                  this.$t("ok")
                );
              }
              this.loading = false;
            })
            .catch(err => {
              appPlugin.showalert(
                this.$t("updateErrorMsg"),
                "",
                "error",
                this.$t("ok")
              );
              this.loading = false;
            });
        } else {
          let data = {
            ptypeid: this.$route.params.id,
            schoolid: this.school.schoolid,
            classid: this.selectedData.data.clases_id,
            branchid: this.selectedData.data.branches_id,
            programUserData: this.selectedData.data.users,
            programContentData: [
              {
                dayid: this.daysData[i].id,
                hourid: this.daysData[i].hours[j].hourid,
                lessonid: this.selectedData.data.lessons.lesson_id,
                lname: this.selectedData.data.lessons.lName
              }
            ]
          };
          this.$store
            .dispatch("createSchoolProgram", data)
            .then(res => {
              if (res.status && res.status === 200) {
                appPlugin.showalert(
                  this.$t("succescreatemessage"),
                  "",
                  "success",
                  this.$t("ok")
                );
              } else if (res.status == 204) {
                appPlugin.showalert(
                  "Uyarı",
                  "Personel Başka Bir Sınıfta Aynı Gün Ve Saatte Görevli",
                  "info",
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
      }
    },
    deleteSchoolProgram(i, j) {
      this.loading = true;
      let finded = this.$store.getters.getSchoolProgram.find(item => {
        return (
          item.school_day_id == this.daysData[i].id &&
          item.school_hour_id == this.daysData[i].hours[j].hourid
        );
      });
      let findexIndex = this.$store.getters.getSchoolProgram.findIndex(
        (item, index) => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        }
      );
      this.$store
        .dispatch("deleteSchoolProgram", {
          deletedIndex: findexIndex,
          deleted: finded,
          urlparse: appPlugin.urlParse(
            "school_program_id=" +
              finded.schoolprogramid +
              "& school_day_id=" +
              finded.school_day_id +
              "& school_hour_id=" +
              finded.school_hour_id
          )
        })
        .then(res => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("deleteRecordMsg"),
            "",
            "success",
            this.$t("ok")
          );
        })
        .catch(err => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("deleteRecordErrMsg"),
            "",
            "error",
            this.$t("ok")
          );
        });
    },
    getPersons(i, j) {
      if (this.$store.getters.getSchoolProgram.length > 0) {
        let finded = this.$store.getters.getSchoolProgram.find(item => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        });
        if (finded != undefined) {
          return finded.users;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    getLessons(i, j) {
      if (this.$store.getters.getSchoolProgram.length > 0) {
        let finded = this.$store.getters.getSchoolProgram.find(item => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        });
        if (finded != undefined) {
          return finded.lessons.lName;
        } else {
          return "";
        }
      }
      return "";
    },
    updateSchoolProgram() {
      if (this.selectedClass.clases_id == undefined) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Sınıf Seçiniz Seçiniz",
          "info",
          "Tamam"
        );
      } else if (this.selectedLesson.lesson_id == undefined) {
        appPlugin.showalert("Uyarı", "Lütfen Ders Seçiniz", "info", "Tamam");
      } else if (this.selectedPersons.length < 1) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Personel Seçiniz",
          "info",
          "Tamam"
        );
      } else {
        let updatedData = {
          dayid: this.selectedData.data.school_day_id,
          hourid: this.selectedData.data.school_hour_id,
          lessonid: this.selectedLesson.lesson_id,
          lName: this.selectedLesson.lName,
          spcontentid: this.selectedData.data.scoolprogramcontentid,
          urlparse: appPlugin.urlParse(
            "id=" + this.selectedData.data.scoolprogramcontentid
          ),
          contentid: "",
          userData: this.selectedPersons,
          findexIndex: this.selectedData.index
        };
        this.loading = true;
        this.$store
          .dispatch("updateSchoolProgram", updatedData)
          .then(res => {
            this.onCloseModal();

            if (res && res.status === 200) {
              appPlugin.showalert(
                this.$t("updateSuccesMsg"),
                "",
                "success",
                this.$t("ok")
              );
            } else if (res.status === 204) {
              appPlugin.showalert(
                "Uyarı",
                "Personel Başka Bir Sınıfta Aynı Gün Ve Saatte Görevli",
                "info",
                this.$t("ok")
              );
            }
            this.loading = false;
          })
          .catch(err => {
            appPlugin.showalert(
              this.$t("updateErrorMsg"),
              "",
              "error",
              this.$t("ok")
            );
            this.loading = false;
          });
      }
    },
    fetchPrograms() {
      this.selectedData = {
        data: "",
        index: ""
      };
      this.loading = true;
      this.$store
        .dispatch("fetchSchoolProgram", {
          urlparse: appPlugin.urlParse(
            "clases_id=" +
              this.selectedClass.clases_id +
              "& branches_id=" +
              this.selectedClass.branches_id +
              "& school_p_type_id=" +
              this.$route.params.id +
              "& school_id=" +
              this.school.schoolid
          )
        })
        .then(res => {
          this.loading = false;
          this.getLessons();
        })
        .catch(err => {
          this.loading = false;
        });
    },
    saveSchoolProgram() {
      if (this.selectedClass.clases_id == undefined) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Sınıf Seçiniz Seçiniz",
          "info",
          "Tamam"
        );
      } else if (this.selectedLesson.id == undefined) {
        appPlugin.showalert("Uyarı", "Lütfen Ders Seçiniz", "info", "Tamam");
        this.onCloseModal();
      } else if (this.selectedPersons.length < 1) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Personel Seçiniz",
          "info",
          "Tamam"
        );
        this.onCloseModal();
      } else {
        let data = {
          ptypeid: this.$route.params.id,
          schoolid: this.school.schoolid,
          classid: this.selectedClass.clases_id,
          branchid: this.selectedClass.branches_id,
          programUserData: this.selectedPersons,
          programContentData: [
            {
              dayid: this.selectedDay.id,
              hourid: this.selectedHours.hourid,
              lessonid: this.selectedLesson.lesson_id,
              lname: this.selectedLesson.lName
            }
          ]
        };
        this.$store
          .dispatch("createSchoolProgram", data)
          .then(res => {
            this.onCloseModal();
            if (res.status && res.status === 200) {
              appPlugin.showalert(
                this.$t("succescreatemessage"),
                "",
                "success",
                this.$t("ok")
              );
            } else if (res.status === 204) {
              appPlugin.showalert(
                "Uyarı",
                "Personel Başka Bir Sınıfta Aynı Gün Ve Saatte Görevli",
                "info",
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
    },
    onCloseModal() {
      this.updateMode = false;
      this.selectedData = {
        data: "",
        index: ""
      };
      this.selectedPersons = [];
      this.selectedLesson = {};
      this.selectedDay = {};
      this.selectedHours = [];
      this.modals.modal = false;
    },
    openUpdateModal(i, j) {
      let finded = this.$store.getters.getSchoolProgram.find(item => {
        return (
          item.school_day_id == this.daysData[i].id &&
          item.school_hour_id == this.daysData[i].hours[j].hourid
        );
      });
      let findexIndex = this.$store.getters.getSchoolProgram.findIndex(
        (item, index) => {
          return (
            item.school_day_id == this.daysData[i].id &&
            item.school_hour_id == this.daysData[i].hours[j].hourid
          );
        }
      );
      this.selectedData.data = finded;
      this.selectedData.index = findexIndex;
      this.onChangeLesson({
        lesson_id: this.selectedData.data.lessons.lesson_id,
        school_id: this.school.schoolid
      });
      this.onFetchScoolLesson();
      this.updateMode = true;
      this.selectedPersons = finded.users;
      this.selectedLesson = finded.lessons;
      this.selectedDay = this.daysData[i];
      this.selectedHours = this.daysData[i].hours[j];
      this.modals.modal = true;
    },
    openModal(i, j) {
      this.selectedDay = this.daysData[i];
      this.selectedHours = this.daysData[i].hours[j];
      this.modals.modal = true;
      this.onFetchScoolLesson();
    },
    onChangeLesson(data) {
      this.selectedPersons = [];
      this.changePersonLoading = true;
      this.$store
        .dispatch("fetchAllSchoolLesson", {
          lessonid: data.lesson_id,
          schoolid: data.school_id,
          urlparse: appPlugin.urlParse(
            "school_id=" + data.school_id + "& lesson_id=" + data.lesson_id
          )
        })
        .then(res => {
          this.changePersonLoading = false;
          if (res.status == 200 && res.data.length > 0) {
            this.schoollessonData = res.data;
          }
        })
        .catch(err => {
          this.changePersonLoading = false;
          appPlugin.showalert(
            "Uyarı",
            "Beklenmeyen Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
            "error",
            "Tamam"
          );
        });
    },
    onFetchScoolLesson() {
      this.loading = true;
      this.$store
        .dispatch("fetchSchoolLessonProgramData", {
          urlparse: appPlugin.urlParse("school_id=" + this.school.schoolid)
        })
        .then(res => {
          if (res.status == 200 && res.data.length > 0) {
            this.schoollesson = res.data;
          }
        })
        .catch(err => {});
      this.loading = false;
    }
  },
  components: {
    Modal,
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
    VTooltipButton
  }
};
</script>

<style scoped></style>
