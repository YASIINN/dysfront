<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="card-body">
      <tooltip title="Öğretmen Olarak Ata" @onClick="activityTaskStatus=0" className="btn-outline-success"
               text="Öğretmen Olarak Ata"></tooltip>
      <tooltip title="Görevli Ata " @onClick="activityTaskStatus=1"
               className="float-right btn-outline-warning" text="Görevli Olarak Ata"></tooltip>
      <flex column="col-md-12 col-sm-12 col-lg-12">
        <label>Görevli Olduğu Faaliyetler</label>
        <div class="form-group">
          <multiselect v-model="personActivityData" track-by="aName" @close="onTouch"
                       @input="onChangeActivity"
                       :allow-empty="false" label="aName" selectedLabel="Seçili"
                       selectLabel="Seç"
                       :hide-selected="false" :multiple="false"
                       deselectLabel="" :options="$store.getters.getUserRelationActivity"
                       :searchable="true"
                       :close-on-select="true" :show-labels="true"
                       placeholder="Faaliyet Seçiniz"></multiselect>
          <small v-if="isInvalid" style="color: red"
          >Lütfen Faaliyet Seçiniz</small
          >
        </div>
        <div class="form-group" v-if="activityTaskStatus==0">
          <label>Görevli Olduğu Haftalar</label>
          <select class="form-control" v-model="activityweekData" @change="onChangeWeek(activityweekData)">
            <option value="0" selected hidden disabled>Hafta Seçiniz</option>
            <option v-for="item in groupedData" v-bind:value="item">
              {{item[0].pName}}
            </option>
          </select>

          <small v-if="isInvalid" style="color: red"
          >Lütfen Faaliyet Seçiniz</small
          >
        </div>
        <div class="form-group" v-if="activityTaskStatus==0">
          <label>Görevli Olduğu Sınıflar</label>
          <multiselect track-by="gName" @close="onTouch"
                       v-model="activityClases"
                       :allow-empty="false" label="gName" selectedLabel="Seçili"
                       selectLabel="Seç"
                       :hide-selected="false" :multiple="true"
                       deselectLabel="" :options="activityClasesWeekClasesData"
                       :searchable="true"
                       :close-on-select="false" :show-labels="true"
                       placeholder="Sınıf Seçiniz"></multiselect>
          <small v-if="isInvalid" style="color: red"
          >Lütfen Sınıf Seçiniz</small
          >
        </div>
        <div class="form-group" v-if="activityTaskStatus==0">
          <label>Görevli Olduğu Dersler</label>
          <multiselect track-by="lName" @close="onTouch"
                       v-model="activityLessons"
                       :allow-empty="false" label="lName" selectedLabel="Seçili"
                       selectLabel="Seç"
                       :hide-selected="false" :multiple="true"
                       deselectLabel="" :options="activityLessonData"
                       :searchable="true"
                       :close-on-select="false" :show-labels="true"
                       placeholder="Ders Seçiniz"></multiselect>
          <small v-if="isInvalid" style="color: red"
          >Lütfen Ders Seçiniz</small
          >
        </div>
      </flex>
      <div class="row">

        <div class="col-md-12 col-sm-12 col-lg-12 mt-5">

          <!--           <v-button :btnIcon="'fa-plus-circle'" :className="'btn-primary'"
                               :btnName="'Yeni  Faaliyet   Ekle'"
                               @onClick="addNewActivity"></v-button>-->
          <v-button :btnIcon="'fa-save'" :className="'btn-success float-right'"
                    :btnName="'Kaydet'"
                    @onClick="saveUserActivity"></v-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import tooltip from '@/components/tooltip'
  import _ from 'underscore'
  import {
    VTabs,
    FlexCard,
    VTabContent,
    MaskedInput,
    SearchBox,
    Loading,
    Multiselect,
    VSelect,
    Flex,
    VButton,
    VInput,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'

  export default {
    props: {
      user: {}
    },
    computed: {
      isInvalid () {
        return this.isTouched && this.personActivityData === 0
      }
    },
    methods: {
      getActivityWeekLessons () {
        this.loading = true
        this.$store.dispatch('fetchActivityWeekLesson', {
          query: appPlugin.urlParse('activity_id=' + this.personActivityData.id + '& pCode=' + this.activityweekData[0].pCode)
        }).then((res) => {
          this.loading = false
          this.activityLessonData = res.data
        }).catch((err) => {
          this.loading = false
        })
      },

      onChangeWeek (item) {
        this.loading = true
        this.getActivityWeekLessons()
        this.activityClasesWeekClasesData = item
        this.loading = false
      },
      onTouch () {
        //TODO
        this.isTouched = true
      },
      addActivityUserPeriod (userID) {
        this.loading = true
        this.$store.dispatch('createUserActivityPeriod', {
          userid: userID,
          activityid: this.personActivityData.id,
          periodid: this.activityweekData[0].period_id
        }).then((res) => {
          if (res.status) {

            if (res.status == 200) {

              this.addActivityUserClases(userID)
              this.loading = false
            }
          } else {
            this.loading = false
            appPlugin.showalert('Personel Faaliyet Dönemlerine Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')

          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Personel Faaliyet Dönemlerine Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
        })
      },
      addActivityUserLessons (userID) {
        let data = []
        this.loading = true
        this.activityLessons.forEach((item) => {
          data.push({
            lessonid: item.lessons_id,
            activityid: this.personActivityData.id,
            userid: userID,
            periodid: this.activityweekData[0].period_id
          })
        })
        this.$store.dispatch('createUserActivityLessons', { userList: data }).then((res) => {
          if (res.status) {
            if (res.status == 200) {
              appPlugin.showalert('Personel Faaliyetlere Başarıyla Görevlendirildi', '', 'success', 'Tamam')
              this.activityClases = []
              this.activityLessons = []
              this.activityLessonData = []
              this.activityClasesWeekClasesData = []
              this.activityweekData = []
              this.groupedData = {}
              this.personActivityData = {}
              this.loading = false
            }
          } else {
            appPlugin.showalert('Personel Faaliyet Derslerine Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          }
        }).catch((err) => {
          appPlugin.showalert('Personel Faaliyet Derslerine Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
        })
      },
      addActivityUserClases (userID) {
        this.loading = true
        let data = []
        this.activityClases.forEach((item) => {
          data.push({
            gradeid: item.grade_id,
            activityid: this.personActivityData.id,
            userid: userID,
            periodid: this.activityweekData[0].period_id
          })
        })

        this.$store.dispatch('createUserActivityClases', { userList: data }).then((res) => {
          if (res.status) {
            if (res.status == 200) {
              this.addActivityUserLessons(userID)
              this.loading = false
            }
          } else {
            this.loading = false
            appPlugin.showalert('Personel Faaliyet Sınıflarına Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Personel Faaliyet Sınıflarına Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
        })
      },
      addActivityUserData (userID) {
        this.loading = true
        /*   this.user.uStatus.activity = true*/
        /*     this.$store
               .dispatch('updatePersonStatus', {
                 id: userID,
                 status: this.user.uStatus
               }).then((res) => {
               if (res.status) {
                 if (res.status == 200) {*/
        this.$store.dispatch('createUserActivity', {
          userid: userID,
          activityid: this.personActivityData.id
        }).then((res) => {
          if (res.status) {
            if (res.status == 200) {
              if (this.activityTaskStatus == 1) {
                this.personActivityData = []
                appPlugin.showalert('Personel Görevlendirme İşlemi Başarılı', '', 'success', 'Tamam')
                this.loading = false
              } else {
                this.addActivityUserPeriod(userID)
                this.loading = false
              }
            }
          } else {
            this.loading = false
            appPlugin.showalert('Personel Faaliyetlere Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Personel Faaliyetlere Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
        })
        /*      } else {
                appPlugin.showalert('Personel Faaliyet Durumu Güncellenirken Hata Gerçekleşti')
              }
            } else {
              appPlugin.showalert('Personel Faaliyet Durumu Güncellenirken Hata Gerçekleşti')
            }
          }).catch((err) => {
            appPlugin.showalert('Personel Faaliyet Durumu Güncellenirken Hata Gerçekleşti')
          })*/

      },

      saveUserActivity () {

        if (this.activityTaskStatus == 0) {
          if (!this.personActivityData.id) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin Görevli Olduğu Faaliyeti Seçiniz', 'info', 'Tamam')
          } else if (this.activityweekData == 0) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin Görevli Olduğu Haftayı Seçiniz', 'info', 'Tamam')
          } else if (this.activityClases.length < 1) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin Görevli Olduğu Haftanın Sınıflarını Seçiniz', 'info', 'Tamam')
          } else if (this.activityLessons.length < 1) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin Görevli Olduğu Dersleri Seçiniz', 'info', 'Tamam')
          } else {
            this.loading = true
            console.log('personel edit', this.user)
            this.addActivityUserData(this.user.id)
          }
        } else {
          if (!this.personActivityData.id) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin Görevli Olduğu Faaliyeti Seçiniz', 'info', 'Tamam')
          } else {
            this.loading = true
            this.addActivityUserData(this.user.id)
          }
        }

      },

      onChangeActivity () {

        let query = appPlugin.urlParse('activity_id=' + this.personActivityData.id)
        this.$store.dispatch('getActivityInfo', { query }).then((res) => {
          if (res.status) {
            if (res.status == 200) {

              let data = _.groupBy(res.data, 'period_id')
              this.groupedData = data

            }
          }
        }).catch((err) => {
          appPlugin.showalert('Uyarı', 'Faaliyete Bağlı Kayıtlar Getirilirken Hata Gerçekleşti', 'error', 'Tamam')
        })
      },
    },
    data () {
      return {
        activityweekData: 0,
        groupedData: {},
        loading: false,
        activityTaskStatus: '0',
        personActivityData: [],
        activityClasesWeekClasesData: [],
        activityClases: [],
        activityLessonData: [],
        activityLessons: [],
      }
    },
    name: 'activitytaskcreate',
    components: {
      tooltip,
      Flex,
      FlexCard,
      VSelect,
      VTabs,
      VTabContent,
      MaskedInput,
      SearchBox,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Multiselect,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
    },
  }
</script>

<style scoped>

</style>
