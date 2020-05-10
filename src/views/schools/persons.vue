<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card
      column="col-md-12 col-sm-12 col-lg-12"
      :headerTitle="$store.getters.getSchools.sName +' '+ $t('schooladdperson')"
    >
      <div class="card-body">
        <v-button
          :btnName="$t('assignteacher')"
          @onClick="schoolTaskStatus=0"
          class="btn-outline-success btn-sm"
        ></v-button>
        <v-button
          :btnName="$t('assignofficer')"
          @onClick="schoolTaskStatus=1"
          class="btn-outline-warning btn-sm float-right"
        ></v-button>
        <flex column="col-md-12 col-sm-12 col-lg-12 pt-3">
          <label>{{$t('selectschoolperson')}}</label>
          <div class="form-group">
            <multiselect
              v-model="selectedUser"
              track-by="uFullName"
              @close="onTouch"
              :allow-empty="false"
              label="uFullName"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="false"
              deselectLabel
              :options="userData"
              :searchable="true"
              :close-on-select="true"
              :show-labels="true"
              :placeholder="$t('pleaseselectperson')"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">{{$t('pleaseselectperson')}}</small>
          </div>
        </flex>
        <flex column="col-md-12 col-sm-12 col-lg-12" v-if="schoolTaskStatus==0">
          <label>
            Görevli Olduğu
            Sınıflar
          </label>
          <div class="form-group">
            <multiselect
              v-model="personClasesData"
              track-by="cbName"
              @close="onTouch"
              :allow-empty="true"
              label="cbName"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="true"
              deselectLabel
              :options="schoolClasBranchData"
              :searchable="true"
              :close-on-select="false"
              :show-labels="true"
              placeholder="Sınıf Seçiniz"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">Lütfen Sınıf Seçiniz</small>
          </div>
        </flex>
        <flex column="col-md-12 col-sm-12 col-lg-12" v-if="schoolTaskStatus==0">
          <label>
            Görevli Olduğu
            Dersler
          </label>
          <div class="form-group">
            <multiselect
              v-model="personLessonData"
              track-by="lName"
              @close="onTouch"
              :allow-empty="true"
              label="lName"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="true"
              deselectLabel
              :options="schoolLessonsData"
              :searchable="true"
              :close-on-select="false"
              :show-labels="true"
              placeholder="Ders Seçiniz"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">Lütfen Ders Seçiniz</small>
          </div>
        </flex>
        <v-button
          btnName="Kaydet"
          @onClick="saveUserSchoolTask"
          class="btn-success btn-sm float-right"
        ></v-button>
        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlertPersons"
          @onClose="onCloseAlertPersons($event)"
        >
          Okula Personel Atayabilmek İçin Sisteme Personel Kayıt Edilmelidir. Eklemek İçin
          <router-link tag="a" target="_blank" :to="'/createpersons'">Buraya Tıklayın.</router-link>
        </alert-box>

        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlertClases"
          @onClose="onCloseAlertClases($event)"
        >
          Okula Öğretmen Atayabilmek İçin Okula Ait Sınıflar Kayıt Edilmelidir. Eklemek İçin
          <router-link
            tag="a"
            target="_blank"
            :to="'/schools/'+$route.params.schoolid+'/clases'"
          >Buraya Tıklayın.
          </router-link>
        </alert-box>
        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlertLessons"
          @onClose="onCloseAlertLessons($event)"
        >
          Okula Öğretmen Atayabilmek İçin Okula Ait Dersler Kayıt Edilmelidir. Eklemek İçin
          <router-link
            tag="a"
            target="_blank"
            :to="'/schools/'+$route.params.schoolid+'/lessons'"
          >Buraya Tıklayın.
          </router-link>
        </alert-box>
      </div>
    </flex-card>

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6">
              <h3 class="mb-0">{{this.$store.getters.getSchools.sName }} Personeller</h3>
            </div>

            <div class="col-md-6 col-sm-6 col-lg-6 text-right">
              <v-button
                :btnName="$t('exportExcel')"
                class="btn btn-primary btn-sm"
                @onClick="exportExcel"
              />
              <v-button
                :btnName="$t('allexportexcel')"
                class="btn btn-primary btn-sm"
                @onClick="exportallData"
              />
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchPersonNameSurName')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getSchoolsPersonHeader"
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
            <!--      <template slot="actions" scope="props">
                    <div class="custom-actions">
                      <p>sss</p>
                    </div>
            </template>-->
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
  </div>
</template>

<script>
  import {
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
  } from '@/Providers/defaultImports'
  import { FETCH_ALL_PERSONS_EXPORT_EXCEL, FETCH_ALL_SCHOOL_PERSON } from '../../store/modules/users/moduleNames'

  export default {
    name: 'persons',
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
    },
    methods: {
      exportallData () {
        //TODO
        this.loading = true
        this.$store
          .dispatch(FETCH_ALL_SCHOOL_PERSON, {
            id: this.$route.params.schoolid,
            query: appPlugin.urlParse(
              'users.uİsActive=1' +
              '& schools.id=' +
              this.$route.params.schoolid +
              '& user_u_types.user_types_id=1'
            )
          })
          .then(res => {
            if (res.length > 0) {
              this.loading=false
              let keys = ['uName', 'uSurname', 'uPhone', 'uEmail']
              let data = res
              const header = [
                'Personel Adı',
                'Personel SoyAdı',
                'Telefon Numarası',
                'Email Adresi'
              ]
              appPlugin.exportExcelTable(
                data,
                this.$store.getters.getSchools.sName + ' ' + 'Okulu Personel Listesi',
                14,
                keys,
                header
              )
            } else {
              appPlugin.showalert(
                this.$t('warning'),
                this.$t('excelExportWarning'),
                'info',
                this.$t('ok')
              )
            }
          })
          .catch(err => {
            this.loading = false
          })
      },
      onCloseAlertLessons () {
        this.showAlertLessons = false
      },
      onCloseAlertClases () {
        this.showAlertClases = false
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onCloseAlertPersons () {
        this.showAlertPersons = false
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onLoading () {
        this.loading = true
      },
      onLoaded () {
        this.loading = false
      },
      onError (err) {
        this.loading = false

        appPlugin.showalert(
          'Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
          '',
          'error',
          'Tamam'
        )
      },
      onSuccess () {
      },
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length < 1) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        } else {
          let keys = ['uName', 'uSurname', 'uPhone', 'uEmail']
          const header = [
            'Personel Adı',
            'Personel SoyAdı',
            'Telefon Numarası',
            'Email Adresi'
          ]
          appPlugin.exportExcelTable(
            data,
            this.$store.getters.getSchools.sName + ' ' + 'Okulu Personel Listesi',
            14,
            keys,
            header
          )
        }
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onFetchApi (apiUrl, httpOptions) {
        if (isNaN(+this.$route.params.schoolid) == false) {
          let data
          if (this.txt.trim() != '') {
            data = this.$store.dispatch('fetchSchoolPerson', {
              httpOpt: httpOptions,
              id: this.$route.params.schoolid,
              query: appPlugin.urlParse(
                'users.uFullName%' +
                this.txt +
                '& users.uİsActive=1' +
                '& schools.id=' +
                this.$route.params.schoolid +
                '& user_u_types.user_types_id=1'
              )
            })
            data.then(res => {
              console.log('lalal', res)
              this.currentData = res
            })
            return data
          } else {
            data = this.$store.dispatch('fetchSchoolPerson', {
              httpOpt: httpOptions,
              id: this.$route.params.schoolid,
              query: appPlugin.urlParse(
                'users.uİsActive=1' +
                '& schools.id=' +
                this.$route.params.schoolid +
                '& user_u_types.user_types_id=1'
              )
            })
            data.then(res => {
              this.currentData = res
            })
            return data
          }
        } else {
          appPlugin.showalert(
            this.$t('invalidparam'),
            '',
            'error',
            this.$t('ok')
          )
          this.$router.replace('/schools')
        }
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      fetchSchoolData () {
        this.$store
          .dispatch('fetchSchoolClasesBranchesPivotAll', {
            urlparse: appPlugin.urlParse(
              'school_id=' + this.$route.params.schoolid
            )
          })
          .then(res => {
            if (res.data && res.status) {
              if (res.data.length > 0) {
                res.data.forEach(item => {
                  item.cbName = item.cName + ' ' + item.bName
                })
                this.schoolClasBranchData = res.data
              } else {
                this.showAlertClases = true
              }
            }
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })

        this.$store
          .dispatch('fetchAllSchoolLessonsPivot', {
            urlparse: appPlugin.urlParse(
              'school_id=' + this.$route.params.schoolid
            )
          })
          .then(res => {
            if (res.data.length > 0) {
              this.schoolLessonsData = res.data
            } else {
              this.showAlertLessons = true
            }
          })
          .catch(err => {
            this.loading = false
          })
      },
      addUserSchoolClasesBranchesData (userId) {
        this.loading = true
        var data = []
        this.personClasesData.forEach(item => {
          data.push({
            userid: userId,
            classid: item.clases_id,
            schoolid: this.$route.params.schoolid,
            branchid: item.branches_id,
            type: 0
          })
          this.$store
            .dispatch('createUserSchoolClasesBranches', {
              userscblist: data
            })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  this.$refs.vuetable.reload()
                  appPlugin.showalert(
                    'Personel Görevlendirme İşlemi Başarılı',
                    '',
                    'success',
                    'Tamam'
                  )
                  this.personClasesData = []
                  this.selectedUser = {}
                  this.personLessonData = []
                  this.loading = false
                }
              } else {
                appPlugin.showalert(
                  'Personel İlgili Okul Sınıf ve Şube Atamaları Oluşturulurken Hata Gerçekleşti',
                  '',
                  'error',
                  'Tamam'
                )
                this.loading = false
              }
            })
            .catch(err => {
              this.loading = false
              appPlugin.showalert(
                'Personel İlgili Okul Sınıf ve Şube Atamaları Oluşturulurken Hata Gerçekleşti',
                '',
                'error',
                'Tamam'
              )
            })
        })
      },
      addUserSchoolClasesData (userId) {
        this.loading = true
        this.addUserSchoolClasesBranchesData(userId)
        this.personClasesData.forEach(item => {
          var data = []
          data.push({
            userid: userId,
            classid: item.clases_id,
            schoolid: this.$route.params.schoolid
          })
          this.$store
            .dispatch('createUserSchoolClases', {
              usersclist: data
            })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  this.loading = true
                }
              } else {
                this.loading = false
                appPlugin.showalert(
                  'Personel İlgili Okul Ve Sınıfa Eklenirken Hata Gerçekleşti',
                  '',
                  'error',
                  'Tamam'
                )
              }
            })
            .catch(err => {
              this.loading = false
              appPlugin.showalert(
                'Personel İlgili Okul Ve Sınıfa Eklenirken Hata Gerçekleşti',
                '',
                'error',
                'Tamam'
              )
            })
        })
      },
      addUserSchoolLessonData (userId) {
        this.loading = true
        this.addUserSchoolClasesData(userId)
        var data = []
        this.personLessonData.forEach(item => {
          data.push({
            userid: userId,
            lessonid: item.id,
            schoolid: this.$route.params.schoolid
          })
          this.$store
            .dispatch('createUserSchoolLesson', {
              usersllist: data
            })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  this.loading = false
                } else {
                  this.loading = false
                }
              } else {
                this.loading = false
              }
              console.log('userokulders', res.status)
            })
            .catch(err => {
              this.loading = false
              appPlugin.showalert(
                'Personel Okul ve Derslere Eklenirken Hata Gerçekleşti',
                '',
                'error',
                'Tamam'
              )
              //user okul ders hata
            })
        })
      },
      addLessonUserData (userId) {
        this.loading = true
        let data = []
        this.personLessonData.forEach(item => {
          data.push({
            userid: userId,
            lessonid: item.id
          })
        })
        this.$store
          .dispatch('createUserLessons', { userslessonslist: data })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = false
                this.addUserSchoolLessonData(userId)
              }
            } else {
              this.loading = false
              appPlugin.showalert(
                'Personel Derslere Eklenirken Hata Gerçekleşti',
                '',
                'error',
                'Tamam'
              )
            }
          })
          .catch(err => {
            this.loading = false
            appPlugin.showalert(
              'Personel Derslere Eklenirken Hata Gerçekleşti',
              '',
              'error',
              'Tamam'
            )
            //personel ders eklenme hatası
          })

        //console.log(lessonsData)
      },
      addSchoolUserData (userID) {
        let data = []
        data.push({
          schoolid: this.$route.params.schoolid,
          userid: userID
        })
        this.loading = true
        this.$store
          .dispatch('createUserSchool', {
            userschoollist: data
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = false
                if (this.schoolTaskStatus == 0) {
                  this.addLessonUserData(userID)
                } else {
                  this.$refs.vuetable.reload()
                  appPlugin.showalert(
                    'Personel  Okullara Başarıyla Eklendi ',
                    '',
                    'success',
                    'Tamam'
                  )
                  this.personClasesData = []
                  this.selectedUser = {}
                  this.personLessonData = []
                }
              }
            } else {
              appPlugin.showalert(
                'Personel Okula Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
                '',
                'error',
                'Tamam'
              )
              this.loading = false
            }
          })
          .catch(err => {
            appPlugin.showalert(
              'Personel Okula Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
              '',
              'error',
              'Tamam'
            )
            this.loading = false
          })
      },
      showSchool () {
        this.$store
          .dispatch('showSchool', { id: this.$route.params.schoolid })
          .then(res => {
            if (res.id == undefined) {
              this.$router.replace('/schools')
            }
          })
          .catch(err => {
          })
      },
      saveUserSchoolTask () {
        if (this.schoolTaskStatus == 0) {
          if (!this.selectedUser.id) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personel Seçiniz',
              'info',
              'Tamam'
            )
          } else if (this.personClasesData.length < 1) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personelin Görevli Olduğu Sınıfları Seçiniz',
              'info',
              'Tamam'
            )
          } else if (this.personLessonData.length < 1) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personelin Görevli Olduğu Dersleri Seçiniz',
              'info',
              'Tamam'
            )
          } else {
            this.addSchoolUserData(this.selectedUser.id)
          }
        } else {
          if (!this.selectedUser.id) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personel Seçiniz',
              'info',
              'Tamam'
            )
          } else {
            this.addSchoolUserData(this.selectedUser.id)
          }
        }
      },
      onTouch () {
        this.isTouched = true
      }
    },
    computed: {
      isInvalid () {
      }
    },
    data () {
      return {
        showAlertLessons: false,
        showAlertClases: false,
        showAlertPersons: false,
        loading: false,
        moreParams: {},
        personClasesData: [],
        schoolTaskStatus: '0',
        schoolLessonsData: [],
        personLessonData: [],
        schoolClasBranchData: [],
        isTouched: false,
        userData: [],
        selectedUser: {},
        txt: ''
      }
    },
    created () {
      this.loading = true
      this.showSchool()
      this.fetchSchoolData()
      this.$store
        .dispatch(FETCH_ALL_PERSONS_EXPORT_EXCEL, {
          query: appPlugin.urlParse('uİsActive=1')
        })
        .then(res => {
          if (res && res.length > 0) {
            this.userData = res
            this.loading = false
          } else {
            this.loading = false
            this.showAlertPersons = true
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
</script>

<style scoped>
</style>
