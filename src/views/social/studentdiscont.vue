<template>
  <div>
    <Loading v-if="loading"/>
    <flex-card column="col-lg-12 col-md-12 col-sm-12" headerTitle="Öğrenci">

      <div class="row mt-5" v-if="selectedStudent.s_fullname!=undefined">
        <div class="col-md-3 ml-2">
          <studentcard :fullname="selectedStudent.s_fullname" :schoolname="selectedStudent.schools[0].sName"
                       :classname="selectedStudent.clases[0].cName"
                       :branchname="selectedStudent.branches[0].bName"
          ></studentcard>
        </div>
      </div>
      <flex column="col-lg-12 col-md-12 col-sm-12 p-3 pl-4 pr-4">
        <div class="form-group" v-if="$store.getters.getUserStudents.length>1">
          <label>Devamsızlık Bilgisini Görüntülemek İstediğiniz Öğrencinizi Seçiniz</label>
          <div class="input-group input-group-merge">
            <multiselect
              @select="onChangeStudent"
              v-model="selectedStudent"
              track-by="s_fullname"
              :allow-empty="true"
              label="s_fullname"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="false"
              deselectLabel
              :options="$store.getters.getUserStudents"
              :searchable="true"
              :close-on-select="true"
              :show-labels="true"
              placeholder="Öğrenci Seçiniz"
            ></multiselect>
          </div>
        </div>
      </flex>

    </flex-card>
    <flex-card column="col-lg-12 col-md-12 col-sm-12" headerTitle="Devamsızlıklar"
               v-if="selectedStudent.s_fullname!=undefined">
      <v-tabs @onActiveTab="getActiveTabs($event)" style="padding: 25px">
        <v-tab-content tabKey="schoold" title="Okul Devamsızlığı" icon="fa fa-info">

          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <label>{{$t('setstartdate')}}</label>
                <div class="input-group input-group-alternative">
                  <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
                  </div>
                  <datetime
                    input-class="form-control"
                    :week-start="7"
                    v-model="startdate"
                    :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                  ></datetime>
                </div>
              </div>


            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <label>{{$t('setenddate')}}</label>
                <div class="input-group input-group-alternative">
                  <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
                  </div>
                  <datetime
                    input-class="form-control"
                    :week-start="7"
                    v-model="enddate"
                    :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                  ></datetime>
                </div>
              </div>


            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <v-button :btnName="$t('getrecord')" className="btn btn-primary mt-4" @onClick="fetchDiscont"></v-button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <div class="nav flex-column " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <v-tabs style="padding: 25px" v-if="Object.keys(sdstudentlist).length>0">
                  <v-tab-content
                    v-for="(item,i,k) in sdstudentlist"
                    :tabKey="i" :title="i|formatToday" icon="fa fa-info">
                    <label>{{$t('dtypeslist')}}</label>
                    <select class="form-control" v-model="item.dtype" @change="onChangeFilter(item,i,k)">
                      <option v-for="option in dtypes" v-bind:value="option">
                        {{ option.dtName }}
                      </option>
                    </select>
                    <br/>
                    <div class="list-group">
                      <router-link
                        v-for="(student,j) in item"
                        :to="'/students/'+student.studentid"
                        class="list-group-item list-group-item-action flex-column align-items-start ">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">{{student.studentname.toUpperCase()}}</h5>
                          <span class="badge badge-primary badge-pill">{{student.dtypename}}</span>
                        </div>
                        <p class="mb-1">
                          Öğrenci Okul-Sınıf : {{student.schoolname}} {{student.clasname}}-{{student.branchname}}
                        </p>
                        <p class="mb-1">
                          Ders Saati Ve Günü : {{student.hourname}} {{student.dayname}}
                        </p>
                        <p class="mb-1">
                          Ders Adı :{{student.lessonname}}
                        </p>

                        <p class="mb-1">
                          Devamsızlık Yapılan Program Türü :{{student.programType}}
                        </p>
                      </router-link>
                    </div>
                    <p class="text-center text-bold">{{$t('totalrecord')}} {{item.length}}</p>
                  </v-tab-content>
                </v-tabs>
              </div>
            </div>
          </div>

        </v-tab-content>
        <v-tab-content tabKey="activityd" title="Faaliyet Devamsızlığı " icon="fa fa-info">
          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <label>{{$t('setstartdate')}}</label>
                <div class="input-group input-group-alternative">
                  <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
                  </div>
                  <datetime
                    input-class="form-control"
                    :week-start="7"
                    v-model="startdate"
                    :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                  ></datetime>
                </div>
              </div>


            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <div class="form-group">
                <label>{{$t('setenddate')}}</label>
                <div class="input-group input-group-alternative">
                  <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
                  </div>
                  <datetime
                    input-class="form-control"
                    :week-start="7"
                    v-model="enddate"
                    :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                  ></datetime>
                </div>
              </div>


            </div>
            <div class="col-md-4 col-sm-4 col-lg-4">
              <v-button :btnName="$t('getrecord')" className="btn btn-primary mt-4"
                        @onClick="fetchDiscontActivity"></v-button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <div class="nav flex-column " id="v-pills-tab2" role="tablist" aria-orientation="vertical">
                <v-tabs style="padding: 25px" v-if="Object.keys(sfordactivity).length>0">

                  <v-tab-content
                    v-for="(item,i,k) in sfordactivity"
                    :tabKey="i" :title="i|formatToday" icon="fa fa-info">
                    <label>{{$t('dtypeslist')}}</label>
                    <select class="form-control" v-model="item.dtype" @change="onChangeFilterActivity(item,i,k)">
                      <option v-for="option in dtypes" v-bind:value="option">
                        {{ option.dtName }}
                      </option>
                    </select>
                    <br/>
                    <div class="list-group">
                      <router-link
                        v-for="(student,j) in item"
                        :to="'/students/'+student.studentid"
                        class="list-group-item list-group-item-action flex-column align-items-start ">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">{{student.studentname.toUpperCase()}}</h5>
                          <span class="badge badge-primary badge-pill">{{student.dtypename}}</span>
                        </div>
                        <p class="mb-1">
                          Öğrenci Faaliyet - Hafta - Sınıf : {{student.activityname}}
                          {{student.periodname}}-{{student.gradename}}
                        </p>
                        <p class="mb-1">
                          Ders Saati Ve Günü : {{student.hourname}} {{student.dayname}}
                        </p>
                        <p class="mb-1">
                          Ders Adı :{{student.lessonname}}
                        </p>

                        <p class="mb-1">
                          Devamsızlık Yapılan Program Türü :{{student.programType}}
                        </p>
                      </router-link>
                    </div>
                    <p class="text-center text-bold">{{$t('totalrecord')}} {{item.length}}</p>
                  </v-tab-content>
                </v-tabs>
              </div>
            </div>
          </div>
        </v-tab-content>


      </v-tabs>

    </flex-card>
  </div>
</template>

<script>
  import { Datetime } from 'vue-datetime'

  var date1 = new Date().toISOString()
  var date2 = new Date().toISOString()
  import {
    Loading,
    VSelect,
    FlexCard,
    Flex,
    VTabs,
    VTabContent,
    VButton,
    Multiselect,
    VInput,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import studentcard from '@/components/studentcard/index'
  import {
    FETCH_USER_STUDENTS
  } from '../../store/modules/users/moduleNames'
  import moment from 'moment'
  import { FETCH_DTYPE } from '../../store/modules/dtype/moduleNames'
  import { FETCH_STUDENT_FOR_D, FETCH_STUDENTFOR_DISCONT_A } from '../../store/modules/discontinuity/moduleNames'
  import { FETCH_STUDENTS_D } from '@/store/modules/discontinuity/moduleNames'

  export default {
    created () {
      //TODO USER ID
      this.fetchUserStudent()
      this.fetchDType()
    },
    data () {
      return {
        sfordactivity: [],
        sdstudentlist: [],
        dtypes: [],
        startdate: date1,
        enddate: date2,
        selectedStudent: {},
        loading: false
      }
    },
    methods: {
      onChangeFilterActivity (item, i, k) {
        if (localStorage.getItem('sData') != undefined || localStorage.getItem('sData') != null) {
          let data = []
          let filtered = JSON.parse(localStorage.getItem('sData'))
          if (item.dtype.id == 0) {
            data = filtered[i]
            data.dtype = item.dtype
          } else {
            data = filtered[i].filter((data) => {
              return item.dtype.id == data.dtypeid
            })
            data.dtype = item.dtype
          }
          this.sfordactivity[i] = data
        } else {
          appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
        }
      },
      fetchDType () {
        this.$store.dispatch(FETCH_DTYPE).then((res) => {
          debugger
          this.loading = false
          res.data.unshift({ id: 0, dtName: 'Tümü' })
          this.dtypes = res.data
        }).catch((err) => {
          this.loading = false

          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))

        })
      },
      fetchDiscontActivity () {
        if (this.startdate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setstartdate'), 'warning', this.$t('ok'))
        } else if (this.enddate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setenddate'), 'warning', this.$t('ok'))
        } else if (this.selectedStudent.s_fullname == undefined) {
          appPlugin.showalert(this.$t('warning'), this.$t('selectstudent'), 'warning', this.$t('ok'))
        } else {
          debugger
          this.$store.dispatch(FETCH_STUDENTFOR_DISCONT_A, {
            studentid: this.selectedStudent.id,
            sdate: moment(this.startdate).format('YYYY-MM-DD'),
            edate: moment(this.enddate).format('YYYY-MM-DD'),
          }).then((res) => {
            this.onReset()
            localStorage.removeItem('sData')
            if (Object.keys(res.data).length < 1) {
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            }
            let keys = Object.keys(res.data)
            for (let i = 0; i < keys.length; i++) {
              debugger
              res.data[keys[i]].dtype = { id: 0, dtName: 'Tümü' }
            }
            let storageData = JSON.parse(JSON.stringify(res.data))
            localStorage.setItem('sData', JSON.stringify(storageData))
            this.sfordactivity = res.data
            this.loading = false
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
            this.loading = false
          })
        }
      },
      onReset () {
        this.startdate = date1
        this.enddate = date2
        /*  this.selectedStudent = {}*/
      },
      getActiveTabs () {
        localStorage.removeItem('sData')
      },
      getActivityChildTabs () {
        localStorage.removeItem('sData')
      },
      onChangeStudent (data) {
        debugger
        this.selectedStudent = data
        this.sdstudentlist = []
        this.startdate = date1
        this.enddate = date2
        this.fetchDiscont()
        /*this.selectedStudent = {}*/
      },
      onChangeFilter (item, i, k) {
        //TODO AYNISI OKUL TARAFINA DA YAPILACAK
        if (localStorage.getItem('sData') != undefined || localStorage.getItem('sData') != null) {
          let data = []
          let filtered = JSON.parse(localStorage.getItem('sData'))
          if (item.dtype.id == 0) {
            data = filtered[i]
            data.dtype = item.dtype
          } else {
            data = filtered[i].filter((data) => {
              return item.dtype.id == data.dtypeid
            })
            data.dtype = item.dtype
          }
          this.sdstudentlist[i] = data
        } else {
          appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
        }
      },
      fetchDiscont () {
        debugger
        if (this.startdate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setstartdate'), 'warning', this.$t('ok'))
        } else if (this.enddate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setenddate'), 'warning', this.$t('ok'))
        } else if (this.selectedStudent.s_fullname == undefined) {
          appPlugin.showalert(this.$t('warning'), this.$t('selectstudent'), 'warning', this.$t('ok'))
        } else {
          debugger
          this.loading = true
          this.$store.dispatch(FETCH_STUDENT_FOR_D, {
            studentid: this.selectedStudent.id,
            sdate: moment(this.startdate).format('YYYY-MM-DD'),
            edate: moment(this.enddate).format('YYYY-MM-DD'),
          }).then((res) => {
            this.onReset()
            if (Object.keys(res.data).length < 1) {
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            }
            let keys = Object.keys(res.data)
            for (let i = 0; i < keys.length; i++) {
              debugger
              res.data[keys[i]].dtype = { id: 0, dtName: 'Tümü' }
            }
            let storageData = JSON.parse(JSON.stringify(res.data))
            localStorage.setItem('sData', JSON.stringify(storageData))
            this.sdstudentlist = res.data
            this.loading = false
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
            this.loading = false
          })
        }
      },
      fetchUserStudent () {
        this.loading = true
        this.$store.dispatch(FETCH_USER_STUDENTS, {
          userid: 2
        }).then((res) => {
          if (res.data.length == 1) {
            this.selectedStudent = res.data[0]
            this.fetchDiscont()
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), 'Öğrenci Bilgileri Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', this.$t('ok'))
        })
      }
    },
    components: {
      Datetime,
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
      studentcard
    },
    name: 'studentdiscont'
  }
</script>

<style scoped>

</style>
