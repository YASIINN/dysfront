<template>
  <div>
    <Loading v-if="loading"/>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <select class="form-control" v-model="selectedptype">
        <option v-for="option in $store.getters.getSchoolProgramType" v-bind:value="option.programtypeid">
          {{ option.programtypename }}
        </option>

      </select>
    </flex>
    <div class="row mt-4">
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
      <div class="col-md-3 col-sm-3 col-lg-3 mt-4">
        <v-button btnName="Kayıtları Getir" @onClick="fetchDStatus" className="btn btn-primary"/>
      </div>
    </div>
    <flex column="col-md-12 col-sm-12 col-lg-12" v-if="keys.length>0">
      <v-tabs>
        <v-tab-content v-for="(item) in keys" :tabKey="item" :title="item" icon="fa fa-info">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center"
                v-for="(student,k) in studentData[item]">
              {{student.studentname}}
              <span class="badge  badge-pill">
                 <div class="form-group">
                            <div class="input-group input-group-merge">
                              <v-select
                                v-model.trim="student.dtypeid"
                                :propName="'dtName'"
                                :bindData="'id'"
                                :optionData="$store.getters.getDType"
                              ></v-select>
                            </div>
                          </div>
              </span>
            </li>

          </ul>
          <v-button btnName="Yoklama Al" @onClick="setDiscontStudent" className="btn btn-success float-right mt-4"/>

        </v-tab-content>
      </v-tabs>
    </flex>
  </div>
</template>

<script>
  import { FETCH_STUDENT_DISCONT_STATUS } from '@/store/modules/discontinuity/moduleNames'
  import { FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT } from '@/store/modules/schoolclasesbranchespivot/moduleNames'
  import { FETCH_ALL_SCHOOLS } from '@/store/modules/schools/moduleNames'
  import { FETCH_SCHOOL_P_TYPE } from '@/store/modules/schoolprogramtypepivot/moduleNames'
  import { FETCH_DTYPE } from '@/store/modules/dtype/moduleNames'
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
  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
  import { UPDATE_DISCONT } from '@/store/modules/discontinuity/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    data () {
      return {

        selectedschool: '',
        selectedclass: '',
        selectedptype: 1,
        schoolClasBranchData: [],
        today: '',
        updateMode: false,
        keys: [],
        studentData: []
      }
    },
    mixins: [loadingMixins],
    methods: {
      setDiscontStudent () {
        let data = []
        //contentid
        //type
        for (let i = 0; i < this.keys.length; i++) {
          this.studentData[this.keys[i]].forEach((item) => {
            data.push({
              contentid: item.discontid,
              type: item.dtypeid
            })
          })
        }
        this.onOpenIndıcator()
        this.$store.dispatch(UPDATE_DISCONT, { studentList: data, type: 1 }).then((res) => {
          this.onCloseIndıcator()

          this.onReset()
          appPlugin.showalert(this.$t('userinfo'), this.$t('updateSuccesMsg'), 'success', this.$t('ok'))

        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('updateErrorMsg'), 'error', this.$t('ok'))

        })
      },
      onReset () {
        this.keys = []
        this.studentData = []
        this.selectedschool = ''
        this.selectedclass = ''
        this.selectedptype = 1
        this.today = ''
        this.schoolClasBranchData = []
      },
      fetchDStatus () {
        if (this.selectedschool == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('selectschool'), 'info', this.$t('ok'))
        } else if (this.selectedclass == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('selectcls'), 'info', this.$t('ok'))
        } else if (this.today == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setstartdate'), 'info', this.$t('ok'))
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch(FETCH_STUDENT_DISCONT_STATUS, {
            date: moment(this.today).format('YYYY-MM-DD'),
            schoolid: this.selectedschool.id,
            clasid: this.selectedclass.clases_id,
            branchid: this.selectedclass.branches_id,
            type: this.selectedptype
          }).then((res) => {
            this.onCloseIndıcator()
            if (Object.keys(res.data).length > 0) {
              this.keys = Object.keys(res.data)
              this.studentData = res.data
            } else {
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            }
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
          })
        }
      },
      onChangeSchool (data) {
        this.schoolClasBranchData = []
        this.selectedclass = ''
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_ALL_SCHOOL_CLASES_BRANCHES_PIVOT, {
          urlparse: appPlugin.urlParse('school_id=' + data.id)
        }).then((res) => {
          if (res.data && res.status) {
            res.data.forEach((item) => {
              item.cbName = item.cName + ' ' + item.bName
            })
            this.schoolClasBranchData = res.data
          }
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))

        })
      }
    },
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
    created () {
      this.onOpenIndıcator()

      this.$store
        .dispatch(FETCH_DTYPE)
        .then(res => {
          this.onCloseIndıcator()
        })
        .catch(err => {
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
          this.onCloseIndıcator()
        })
      this.$store.dispatch(FETCH_SCHOOL_P_TYPE).then((res) => {
        this.onCloseIndıcator()
      }).catch((err) => {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
      this.$store.dispatch(FETCH_ALL_SCHOOLS).then((res) => {
        this.onCloseIndıcator()
      }).catch((err) => {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
    },
    name: 'discontstatus'
  }
</script>

<style scoped>

</style>
