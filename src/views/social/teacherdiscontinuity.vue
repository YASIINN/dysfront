<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12 col-sm-12 col-lg-12" headerTitle="Yoklama Oluştur">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <div class="form-group">
                <v-tabs @onActiveTab="getParentActive($event)" activeTab="schooldiscontinuity">
                  <v-tab-content
                    tabKey="schooldiscontinuity"
                    title="Okul Devamsızlığı"
                    icon="fa fa-school"
                  >
                    <div class="form-group">
                      <label>Ders Programları</label>
                      <div class="input-group input-group-merge">
                        <multiselect
                          @select="onChangeProgram"
                          v-model="selectedProgram"
                          track-by="schoolprogramname"
                          @close="onTouch"
                          :allow-empty="true"
                          label="schoolprogramname"
                          selectedLabel="Seçili"
                          selectLabel="Seç"
                          :hide-selected="false"
                          :multiple="false"
                          deselectLabel
                          :options="$store.getters.getUserPrograms"
                          :searchable="true"
                          :close-on-select="true"
                          :show-labels="true"
                          placeholder="Personel Seçiniz"
                        ></multiselect>
                        <small v-if="isInvalid" style="color: red">Lütfen Program Seçiniz</small>
                      </div>
                    </div>
                    <div class="form-group"
                         v-if="
                        !isInvalid &&
                          $store.getters.getSchoolDays.length > 0 &&
                          $store.getters.getSchoolHour.length > 0
                      "
                    >
                      <label>Görevli Olunan Kayıtlar</label>
                      <div
                        class="input-group input-group-merge"

                      >
                        <multiselect
                          @select="showStudentList"
                          v-model="selectedUserProgram"
                          track-by="fullText"
                          @close="onTouch"
                          :allow-empty="true"
                          label="fullText"
                          selectedLabel="Seçili"
                          selectLabel="Seç"
                          :hide-selected="false"
                          :multiple="false"
                          deselectLabel
                          :options="userProgram"
                          :searchable="true"
                          :close-on-select="true"
                          :show-labels="true"
                          placeholder="Personel Seçiniz"
                        ></multiselect>
                      </div>
                    </div>
                    <h3 class="text text-center"
                        v-if="(!isInvalid && isInvalidHour) && $store.getters.getSelectedProgramStudents.length<1">

                      Öğrenci Bulunamadı
                    </h3>
                    <flex column="col-md-12 col-sm-12 col-lg-12"
                          v-if="$store.getters.getSelectedProgramStudents.length>0">
                      <p class="text-center">
                        Ders Adı : {{selectedData.data.lesson}}<br/>

                        Sınıf Adı : {{selectedData.data.clases}}<br/>
                        Yoklama Günü ve Saati :{{new Date() | formatToday}}</p>
                      <ul class="list-group">
                        <li
                          v-for="(item,i) in $store.getters.getSelectedProgramStudents"
                          :key="i"
                          class="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {{item.s_fullname}}
                          <div class="form-group">
                            <div class="input-group input-group-merge">
                              <v-select
                                v-model.trim="item.selectedDType"
                                :propName="'dtName'"
                                :bindData="'id'"
                                :optionData="$store.getters.getDType"
                              ></v-select>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <p class="text-center">Toplam Öğrenci Sayısı :
                        {{$store.getters.getSelectedProgramStudents.length}}</p>
                      <v-button btnName="Yoklama Al"
                                :btnIcon="'fa-check'"
                                @onClick="createDiscont($event)"
                                className="btn btn-primary float-right pt-2 mt-2"></v-button>

                    </flex>
                  </v-tab-content>
                  <v-tab-content
                    tabKey="activitydiscontinuity"
                    title="Faaliyet Devamsızlığı"
                    icon="fa fa-school"
                  >

                    <div class="form-group">
                      <label>Ders Programları</label>
                      <div class="input-group input-group-merge">
                        <multiselect
                          @select="onChangeActivityProgram"
                          v-model="selectedAProgram"
                          track-by="schoolprogramname"
                          @close="onTouch"
                          :allow-empty="true"
                          label="schoolprogramname"
                          selectedLabel="Seçili"
                          selectLabel="Seç"
                          :hide-selected="false"
                          :multiple="false"
                          deselectLabel
                          :options="$store.getters.getUserPrograms"
                          :searchable="true"
                          :close-on-select="true"
                          :show-labels="true"
                          placeholder="Personel Seçiniz"
                        ></multiselect>
                        <small v-if="isInvalidActivity" style="color: red">Lütfen Program Seçiniz</small>
                      </div>
                    </div>
                    <div class="form-group"
                         v-if="
                        !isInvalidActivity && userAProgram.length>0"
                    >
                      <label>Görevli Olunan Kayıtlar</label>
                      <div
                        class="input-group input-group-merge"

                      >
                        <multiselect
                          @select="showAStudentList"
                          v-model="selectedAUserProgram"
                          track-by="fulltext"
                          @close="onTouch"
                          :allow-empty="true"
                          label="fulltext"
                          selectedLabel="Seçili"
                          selectLabel="Seç"
                          :hide-selected="false"
                          :multiple="false"
                          deselectLabel
                          :options="userAProgram"
                          :searchable="true"
                          :close-on-select="true"
                          :show-labels="true"
                          placeholder="Devamsız Kaydı Seçiniz"
                        ></multiselect>
                      </div>
                    </div>
                    <h3 class="text text-center"
                        v-if="(isInvalidAHour && !isInvalidActivity) && $store.getters.getSelectedProgramStudents.length<1">
                      Öğrenci Bulunamadı
                    </h3>
                    <flex column="col-md-12 col-sm-12 col-lg-12"
                          v-if="selectedAData.data!='' && $store.getters.getSelectedProgramStudents.length>0 ">
                      <p class="text-center">
                        Ders Adı : {{selectedAData.data.slesson.lName}}<br/>

                        Dönem Adı : {{selectedAData.data.period}}<br/>
                        Grup Adı : {{selectedAData.data.gradeBranchName}}<br/>
                        Yoklama Günü ve Saati :{{new Date() | formatToday}}</p>
                      <ul class="list-group">
                        <li
                          v-for="(item,i) in $store.getters.getSelectedProgramStudents"
                          :key="i"
                          class="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {{item.s_fullname}}
                          <div class="form-group">
                            <div class="input-group input-group-merge">
                              <v-select
                                v-model.trim="item.selectedDType"
                                :propName="'dtName'"
                                :bindData="'id'"
                                :optionData="$store.getters.getDType"
                              ></v-select>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <p class="text-center">Toplam Öğrenci Sayısı :
                        {{$store.getters.getSelectedProgramStudents.length}}</p>
                      <v-button btnName="Yoklama Al"
                                :btnIcon="'fa-check'"
                                @onClick="createADiscont($event)"
                                className="btn btn-primary float-right pt-2 mt-2"></v-button>

                    </flex>
                  </v-tab-content>
                </v-tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  //normalde aktif olan kullanıcınn id si ile programlar çekilecek şimdilik test olarak
  //rast gele bir id ile getirilecek
  import _ from 'underscore'
  import {
    SearchBox,
    Loading,
    VSelect,
    FlexCard,
    Flex,
    VTabs,
    VTabContent,
    VButton,
    required,
    Multiselect,
    VInput,
    VTooltipButton,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import {
    FETCH_SELECTEDPROGRAM_STUDENTS,
    GET_SELECTEDPROGRAM_STUDENTS
  } from '@/store/modules/discontinuity/moduleNames'
  import { FETCH_DTYPE } from '@/store/modules/dtype/moduleNames'
  import {
    CREATE_DISCONT,
    DELETE_DISCONT,
    UPDATE_DISCONT,
    SET_SELECTEDPROGRAM_STUDENTS,
    FETCH_ASELECTEDPROGRAM_STUDENTS
  } from '@/store/modules/discontinuity/moduleNames'
  import { FETCH_ALL_USER_APROGRAM_TODAY, FETCH_USER_PROGRAM_TODAY } from '../../store/modules/users/moduleNames'

  export default {
    created () {
      //aktif tab okul
      this.getDType()
      this.getUserProgram()
    },
    computed: {
      isInvalidActivity () {
        return this.ontouch && this.selectedAProgram.programid == undefined

      },
      isInvalidHour () {
        return this.selectedUserProgram.dayname != undefined
      },
      isInvalid () {
        return this.ontouch && this.selectedProgram.programid == undefined
      },
      isInvalidAHour () {
        return this.selectedAUserProgram.id != undefined
      }
    },
    methods: {
      getParentActive (data) {
        if (data.componentOptions.propsData.tabKey == 'schooldiscontinuity') {
          this.getUserProgram()
          this.onReset()
        } else {
          this.onReset()

          this.getActivityProgram()
        }
      },
      createADiscont () {
        let students = []
        this.loading = true
        if (this.$store.getters.getSelectedProgramStudents[0].filter != undefined) {
          debugger
          this.$store.getters.getSelectedProgramStudents.forEach((item) => {
            debugger
            students.push({
              contentid: item.filter.id,
              type: item.selectedDType
            })
          })
          debugger
          this.$store.dispatch(UPDATE_DISCONT, { studentList: students, type: 2 }).then((res) => {
            this.loading = false
            if (res.status == 200) {
              this.onReset()
              appPlugin.showalert('Bilgilendirme', 'Devamsızlık Kayıtları Başarıyla Eklendi', 'success', 'Tamam')
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')

          })
        } else {
          this.$store.getters.getSelectedProgramStudents.forEach((item) => {
            students.push({
              id: item.id,
              type: item.selectedDType
            })
          })
          this.$store.dispatch(CREATE_DISCONT, {
            studentList: students,
            id: this.selectedAData.data.id,
            type: 2
          }).then((res) => {
            debugger
            if (res.status == 204) {
              this.loading = false
              Swal.fire({
                title: 'Uyarı',
                text: 'Bugün İçin Okullarda Devamsızlık Kaydı Atanmıştır. Yinede Devam Etmek İstiyor Musunuz ? Faaliyet Devamsızlığına Ait Bugünün Kayıtları Silinecektir.',
                confirmButtonText: this.$t('yes'),
                icon: 'info',
                confirmButtonColor: 'red',
                cancelButtonText: this.$t('no'),
                showCancelButton: true
              }).then((res) => {
                if (res.value) {
                  this.loading = true
                  this.$store.dispatch(DELETE_DISCONT, {
                    id: this.selectedAData.data.id,
                  }).then((res) => {
                    if (res.status === 200) {
                      this.createADiscont()
                    }
                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')
                  })
                }
              })
            } else if (res.status == 200) {
              this.onReset()
              this.loading = false
              appPlugin.showalert('Bilgilendirme', 'Devamsızlık Kayıtları Başarıyla Eklendi', 'success', 'Tamam')
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')

          })
        }
      },
      createDiscont (e) {
        debugger
        let students = []
        this.loading = true
        if (this.$store.getters.getSelectedProgramStudents[0].filter != undefined) {
          //contentid
          this.$store.getters.getSelectedProgramStudents.forEach((item) => {
            debugger
            students.push({
              contentid: item.filter.id,
              type: item.selectedDType
            })
          })
          this.$store.dispatch(UPDATE_DISCONT, { studentList: students, type: 1 }).then((res) => {
            this.loading = false
            if (res.status == 200) {
              this.onReset()
              appPlugin.showalert('Bilgilendirme', 'Devamsızlık Kayıtları Başarıyla Eklendi', 'success', 'Tamam')
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')

          })
        } else {
          this.$store.getters.getSelectedProgramStudents.forEach((item) => {
            students.push({
              id: item.id,
              type: item.selectedDType
            })
          })
          this.$store.dispatch(CREATE_DISCONT, {
            studentList: students,
            id: this.selectedData.data.scoolprogramcontentid,
            type: 1
          }).then((res) => {
            debugger
            if (res.status == 204) {
              this.loading = false
              Swal.fire({
                title: 'Uyarı',
                text: 'Bugün İçin Faaliyetlerde Devamsızlık Kaydı Atanmıştır. Yinede Devam Etmek İstiyor Musunuz ? Faaliyet Devamsızlığına Ait Bugünün Kayıtları Silinecektir.',
                confirmButtonText: this.$t('yes'),
                icon: 'info',
                confirmButtonColor: 'red',
                cancelButtonText: this.$t('no'),
                showCancelButton: true
              }).then((res) => {
                if (res.value) {
                  this.loading = true
                  this.$store.dispatch(DELETE_DISCONT, {
                    id: this.selectedData.data.scoolprogramcontentid,
                  }).then((res) => {
                    if (res.status === 200) {
                      this.createDiscont()
                    }
                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')
                  })
                }
              })
            } else if (res.status == 200) {
              this.onReset()
              this.loading = false
              appPlugin.showalert('Bilgilendirme', 'Devamsızlık Kayıtları Başarıyla Eklendi', 'success', 'Tamam')
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')

          })
        }

      },
      getDType () {
        this.loading = true
        this.$store
          .dispatch(FETCH_DTYPE)
          .then(res => {
            console.log('res', res)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      showAStudentList (data) {
        debugger
        this.loading = true
        this.selectedAData.data = data
        this.selectedAData.index = 0
        this.$store.dispatch(FETCH_ASELECTEDPROGRAM_STUDENTS, {
          contentid: this.selectedAData.data.id,
          activityid: this.selectedAProgram.activityid,
          gradeid: data.sgrade.id,
          periodid: this.selectedAProgram.periodid
        }).then((res) => {
          this.loading = false
          debugger
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Uyarı', 'Devamsızlık Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')
        })
      },
      showStudentList (data) {
        debugger
        data.lesson = data.lessons.lName
        data.clases = data.classBranchName
        this.loading = true
        this.selectedData.data = data
        this.selectedData.index = 0
        this.$store
          .dispatch(FETCH_SELECTEDPROGRAM_STUDENTS, {
            contentid: this.selectedData.data.scoolprogramcontentid,
            schoolid: data.school_id,
            classid: data.clases_id,
            branchid: data.branches_id
          })
          .then(res => {
            this.loading = false
            console.log('ba', this.$store.getters.getSelectedProgramStudents)
          })
          .catch(err => {
            this.loading = false
            appPlugin.showalert(
              'Seçilen Kayda Ait Öğrenci Listesi Getirilirken Hata Gerçekleşti',
              '',
              'error',
              'Tamam'
            )
          })
        //okul sınıf sube
        //
        //clases_id
        //branches_id
        console.log('seçilen', this.selectedData)
        /*   }*/
      },
      getClases (i, j) {
        if (this.$store.getters.getSchoolProgramUser.length > 0) {
          let finded = this.$store.getters.getSchoolProgramUser.find(item => {
            return (
              item.school_day_id == this.daysData[i].id &&
              item.school_hour_id == this.daysData[i].hours[j].hourid
            )
          })
          if (finded != undefined) {
            return finded.classBranchName
          } else {
            return ''
          }
        }
        return ''
      },
      getLessons (i, j) {
        if (this.$store.getters.getSchoolProgramUser.length > 0) {
          let finded = this.$store.getters.getSchoolProgramUser.find(item => {
            return (
              item.school_day_id == this.daysData[i].id &&
              item.school_hour_id == this.daysData[i].hours[j].hourid
            )
          })
          if (finded != undefined) {
            return finded.lessons.lName
          } else {
            return ''
          }
        }
        return ''
      },
      onReset () {
        this.$store.commit(SET_SELECTEDPROGRAM_STUDENTS, [])
        this.selectedUserProgram = {}
        this.selectedAUserProgram = {}
        this.selectedAData = {}
        this.selectedAProgram = {}
        this.userProgram = []
        this.selectedAData = { data: '', index: '' }
        this.selectedData = { data: '', index: '' }
        this.selectedProgram = {}
      },
      async getHoursDate (id, data) {
        debugger
        this.loading = true
        let schooldays = await this.$store.dispatch('fetchSchoolDays', {
          urlparse: appPlugin.urlParse('school_p_type_id=' + id)
        })
        let schoolhour = await this.$store.dispatch('fetchSchoolHours', {
          urlparse: appPlugin.urlParse('school_p_type_id=' + id)
        })
        schooldays.forEach(item => {
          item.hours = []
          schoolhour.forEach(hour => {
            item.hours.push({
              shName: hour.shName,
              beginDate: hour.beginDate,
              endDate: hour.endDate,
              hourid: hour.id,
              lessonid: '',
              personData: []
            })
          })
        })

        this.hoursData = schoolhour
        this.daysData = schooldays
        data.forEach((item) => {
          this.daysData.forEach((days, i) => {
            debugger
            this.daysData[0].hours.forEach((hour, j) => {
              if (item.school_day_id == this.daysData[i].id &&
                item.school_hour_id == this.daysData[i].hours[j].hourid) {
                item.sdName = days.sdName
                item.shName = hour.shName
                item.date = hour.beginDate + '-' + hour.endDate
                item.fullText = days.sdName + ' ' + hour.shName + ' ' + hour.beginDate + '-' + hour.endDate + ' ' + item.lessons.lName
              }
            })
          })

        })
        this.userProgram = data
        this.loading = false
      },
      onChangeActivityProgram (data) {
        //look a for
        this.selectedAUserProgram = {}
        this.$store.commit(SET_SELECTEDPROGRAM_STUDENTS, [])
        this.loading = true
        let query = {
          userid: 2,
          programid: data.programid
        }
        this.$store.dispatch(FETCH_ALL_USER_APROGRAM_TODAY, query).then((res) => {
          this.userAProgram = res.data
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Uyarı', 'Kayıtlar Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', 'Tamam')
        })
      },
      getActivityProgram () {
        this.loading = true
        this.$store
          .dispatch('fetchAllUserActivityProgram', { id: 2 })
          .then(res => {
            debugger
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      },
      onChangeProgram (data) {
        //userid gelecek
        debugger
        debugger
        this.selectedProgram = {}
        this.$store.commit(SET_SELECTEDPROGRAM_STUDENTS, [])
        this.loading = true
        let query = {
          userid: 2,
          programid: data.programid
        }
        this.$store
          .dispatch(FETCH_USER_PROGRAM_TODAY, query)
          .then(res => {
            console.log('gelen', res)
            this.loading = false
            this.getHoursDate(data.programid, res.data)
          })
          .catch(err => {
            this.loading = false
          })
      },
      onTouch () {
        this.ontouch = true
      },
      getUserProgram () {
        this.loading = true
        //TODO
        //user id geçilecek
        this.$store
          .dispatch('fetchAllUserSchoolProgram', { id: 2 })
          .then(res => {
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      }
    },
    components: {
      SearchBox,
      FlexCard,
      Multiselect,
      Flex,
      Loading,
      VInput,
      VTabs,
      VTabContent,
      VButton,
      VSelect,
      VTooltipButton
    },
    data () {
      return {
        selectedUserProgram: {},
        selectedAUserProgram: {},
        userProgram: [],
        userAProgram: [],
        selectedAData: { data: '', index: '' },
        selectedData: { data: '', index: '' },
        selectedProgram: {},
        selectedAProgram: {},
        hoursData: [],
        daysData: [],
        ontouch: false,

        loading: false
      }
    }
  }
</script>
