<template>
  <div>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <select class="form-control" v-model="selectedptype">
        <option v-for="option in $store.getters.getSchoolProgramType" v-bind:value="option.programtypeid">
          {{ option.programtypename }}
        </option>

      </select>
    </flex>
    <div class="row mt-3">
      <Loading v-if="loading"></Loading>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>{{$t('ddate')}}</label>
          <div class="input-group input-group-alternative">
            <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
            </div>
            <datetime
              input-class="form-control"
              :week-start="7"
              v-model="today"
              :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
            ></datetime>
          </div>
        </div>


      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>{{$t('selectschool')}}</label>
          <multiselect
            v-model="selectedschool"
            track-by="sName"
            @input="onChangeSchool"
            :allow-empty="false"
            label="sName"
            selectedLabel="Seçili"
            selectLabel="Seç"
            :hide-selected="false"
            :multiple="false"
            deselectLabel
            :options="$store.getters.getSchools"
            :searchable="true"
            :close-on-select="true"
            :show-labels="true"
            :placeholder="$t('selectschool')"
          ></multiselect>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>{{$t('selectcls')}}</label>
          <multiselect
            v-model="selectedclass"
            track-by="cbName"
            :allow-empty="false"
            label="cbName"
            selectedLabel="Seçili"
            selectLabel="Seç"
            :hide-selected="false"
            :multiple="false"
            deselectLabel
            :options="schoolClasBranchData"
            :searchable="true"
            :close-on-select="true"
            :show-labels="true"
            :placeholder="$t('selectcls')"
          ></multiselect>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <v-button :btnName="$t('getrecord')" className="btn btn-primary mt-4" @onClick="fetchDiscont"></v-button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-lg-12">
        <div class="nav flex-column " id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <v-tabs style="padding: 25px" v-if="Object.keys(dstudentlist).length>0">
            <v-tab-content
              v-for="(item,i,k) in dstudentlist"
              :tabKey="i" :title="i" icon="fa fa-info">
              <label>{{$t('dtypeslist')}}</label>
              <select class="form-control" v-model="item.dtypefilter"
                      @change="onChangeDType(item,i,k,item.dtypefilter)">
                <option v-for="option in dtypes" v-bind:value="option">
                  {{ option.dtName }}
                </option>

              </select>
              <br/>
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="(student,j) in item">
                  {{student.fullname}}
                  <span class="badge badge-primary badge-pill">{{student.dtype}}</span>
                </li>
              </ul>
              <br/>
              <p class="text-center text-bold">{{$t('totalrecord')}} {{item.length}}</p>
            </v-tab-content>
          </v-tabs>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import { FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT } from '@/store/modules/schoolclasesbranchespivot/moduleNames'
  import { FETCH_ALL_SCHOOLS } from '@/store/modules/schools/moduleNames'
  import { FETCH_GETSTUDENT_DISCONT, SET_DISCONT_STUDENTS_LISTS } from '@/store/modules/discontinuity/moduleNames'
  import { FETCH_DTYPE } from '@/store/modules/dtype/moduleNames'
  import { FETCH_SCHOOL_P_TYPE } from '@/store/modules/schoolprogramtypepivot/moduleNames'
  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
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
    appPlugin
  } from '@/Providers/defaultImports'

  export default {
    created () {
      //TODO ptypes 1 olacak muhakkak default
      this.loading = true
      this.$store.dispatch(FETCH_SCHOOL_P_TYPE).then((res) => {
        this.loading = false
      }).catch((err) => {
        this.loading = false
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })

      this.$store.dispatch(FETCH_DTYPE).then((res) => {
        this.loading = false
        res.data.unshift({ id: 0, dtName: 'Tümü' })
        this.dtypes = res.data
      }).catch((err) => {
        this.loading = false

        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))

      })
      this.$store.dispatch(FETCH_ALL_SCHOOLS).then((res) => {

        this.loading = false
      }).catch((err) => {
        this.loading = false
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
    },
    name: 'schoolforclass',
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
      Datetime
    },
    methods: {
      onChangeDType (item, i, k, dtype) {
        //ptype
        this.loading = true
        let today = moment(this.today).format('YYYY-MM-DD')
        this.$store.dispatch(FETCH_GETSTUDENT_DISCONT, {
          day: today,
          clasesid: this.selectedclass.clases_id,
          schoolid: this.selectedschool.id,
          branchid: this.selectedclass.branches_id,
          dtype: dtype.id,
          key: i,
          ptype: this.selectedptype
        }).then((res) => {
          let keys = Object.keys(res.data)
          for (let j = 0; j < keys.length; j++) {
            if (keys[j] == i) {
              res.data[keys[j]].dtypefilter = dtype
            } else {
              res.data[keys[j]].dtypefilter = this.selecteddtype
            }
          }
          this.dstudentlist = res.data
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
        })
      },
      fetchDiscont () {
        if (this.today == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('selectday'), 'info', this.$t('ok'))
        } else if (this.selectedschool == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('personselectschool'), 'info', this.$t('ok'))
        } else if (this.selectedclass == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('pleaseselectclass'), 'info', this.$t('ok'))
        } else {
          debugger
          this.loading = true
          let today = moment(this.today).format('YYYY-MM-DD')
          debugger
          this.$store.commit(SET_DISCONT_STUDENTS_LISTS, [])
          this.$store.dispatch(FETCH_GETSTUDENT_DISCONT, {
            day: today,
            clasesid: this.selectedclass.clases_id,
            schoolid: this.selectedschool.id,
            branchid: this.selectedclass.branches_id,
            dtype: 0,
            ptype: this.selectedptype
          }).then((res) => {
            if (Object.keys(res.data).length < 1) {
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            } else {
              let keys = Object.keys(res.data)
              for (let i = 0; i < keys.length; i++) {
                res.data[keys[i]].dtypefilter = this.selecteddtype
              }
              this.dstudentlist = res.data
            }
            this.loading = false

          }).catch((err) => {
            this.loading = false
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))

          })
        }
      },
      onChangeSchool (data) {
        this.loading = true
        this.$store.dispatch(FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT, {
          urlparse: appPlugin.urlParse('school_id=' + data.id)
        }).then((res) => {
          if (res.data && res.status) {
            res.data.forEach((item) => {
              item.cbName = item.cName + ' ' + item.bName
            })
            this.schoolClasBranchData = res.data
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
        })
      }
    },
    data () {
      return {
        selectedptype: 1,
        dstudentlist: [],
        dtypes: [],
        selecteddtype: { id: 0, dtName: 'Tümü' },
        schoolClasBranchData: [],
        selectedclass: '',
        selectedschool: '',
        loading: false,
        today: new Date()
      }
    }
  }
</script>

<style scoped>

</style>
