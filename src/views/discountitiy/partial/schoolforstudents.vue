<template>
  <div>
    <Loading v-if="loading"/>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-lg-3">
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
      <div class="col-md-3 col-sm-3 col-lg-3">
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
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>Öğrenci Seçiniz</label>
          <multiselect
            v-model="selectedStudent"
            id="ajax"
            label="s_fullname"
            track-by="s_fullname"
            placeholder="Öğrenci Ara"
            open-direction="bottom"
            :options="students"
            :multiple="false"
            :searchable="true"
            :loading="isLoading"
            :internal-search="false"
            :clear-on-select="false"
            :close-on-select="true"
            :options-limit="300"
            :max-height="600"
            :show-no-results="false"
            :hide-selected="true"
            @search-change="fetchStudents">
            <span slot="noResult">Aradığınız Kayıt Bulunamadı</span>
          </multiselect>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">

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
  </div>
</template>

<script>
  import { FETCH_STUDENTS_D } from '@/store/modules/discontinuity/moduleNames'
  import { FETCH_DTYPE } from '@/store/modules/dtype/moduleNames'
  import { Datetime } from 'vue-datetime'
  import moment from 'moment'
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
  import { FETCH_STUDENT_FOR_D } from '@/store/modules/discontinuity/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    components: {
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
      Datetime
    },
    mixins: [loadingMixins],
    methods: {
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
      onReset () {
        this.startdate = ''
        this.enddate = ''
        this.selectedStudent = ''
      },
      fetchDiscont () {
        if (this.startdate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setstartdate'), 'warning', this.$t('ok'))
        } else if (this.enddate == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setenddate'), 'warning', this.$t('ok'))
        } else if (this.selectedStudent == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('selectstudent'), 'warning', this.$t('ok'))
        } else {
          debugger
          this.onOpenIndıcator()
          this.$store.dispatch(FETCH_DTYPE).then((res) => {
            debugger
            this.onCloseIndıcator()
            res.data.unshift({ id: 0, dtName: 'Tümü' })
            this.dtypes = res.data
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
          })
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
            this.onCloseIndıcator()
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
            this.onCloseIndıcator()
          })
        }
      },
      fetchStudents (data) {
        if (data == '') {
          this.isLoading = false
          this.students = []
        } else {
          this.isLoading = true
          let query = appPlugin.urlParse('is_active=1' + '& s_fullname%' + data)
          this.$store.dispatch(FETCH_STUDENTS_D, {
            urlparse: query
          }).then((res) => {
            debugger
            if (res.status === 200) {
              this.students = res.data
            }
            this.isLoading = false
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
            this.isLoading = false
          })
        }
      }
    },
    data () {
      return {
        selectedStudent: '',
        students: [],
        sdstudentlist: [],
        isLoading: false,
        startdate: '',
        enddate: '',
        dtypes: [],
        selecteddtype: { id: 0, dtName: 'Tümü' },
      }
    },
    name: 'schoolforstudents'
  }
</script>

<style scoped>

</style>
