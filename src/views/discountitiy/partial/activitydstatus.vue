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
          <label>Faaliyet Seçiniz</label>
          <multiselect
            v-model="selectedActivity"
            track-by="aName"
            @input="onChangeActivity"
            :allow-empty="false"
            label="aName"
            selectedLabel="Seçili"
            selectLabel="Seç"
            :hide-selected="false"
            :multiple="false"
            deselectLabel
            :options="$store.getters.activities"
            :searchable="true"
            :close-on-select="true"
            :show-labels="true"
            placeholder="Faaliyet Seçiniz"
          ></multiselect>
        </div>

      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>Haftalar/ Dönemler</label>
          <multiselect
            v-model="selectedperiods"
            track-by="pName"
            @input="onChangePeriods"
            :allow-empty="false"
            label="pName"
            selectedLabel="Seçili"
            selectLabel="Seç"
            :hide-selected="false"
            :multiple="false"
            deselectLabel
            :options="$store.getters.getActivityGradesD"
            :searchable="true"
            :close-on-select="true"
            :show-labels="true"
            placeholder="Hafta/Dönem Seçiniz"
          ></multiselect>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-lg-3">
        <div class="form-group">
          <label>Sınıflar</label>
          <multiselect
            v-model="selectedgroups"
            track-by="gName"
            :allow-empty="false"
            label="gName"
            selectedLabel="Seçili"
            selectLabel="Seç"
            :hide-selected="false"
            :multiple="false"
            deselectLabel
            :options="$store.getters.getActivitiyGraderPeriods"
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
    </div>
    <div class="row">
      <div class="col">
        <v-button className="btn btn-primary float-right" @onClick="fetchDStatusA" btnName="Kayıtları Getir"></v-button>
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
  import {
    UPDATE_DISCONT,
    FETCH_ACTIVITY_GRADES_D, FETCH_ACTIVITY_GRADES_DP,
    SET_ACTIVITIY_GRADES_D,
    SET_ACTIVITY_GRADERS_DP,
    FETCH_ACTDIS_STUDENT
  } from '@/store/modules/discontinuity/moduleNames'

  export default {
    name: 'activitydstatus',
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
    data () {
      return {
        selectedActivity: '',
        selectedperiods: '',
        selectedgroups: '',
        today: '',
        selectedptype: 1,
        loading: false,
        studentData: [],
        keys: []
      }
    },
    methods: {
      onReset () {
        this.keys = []
        this.studentData = []
        this.selectedActivity = ''
        this.selectedperiods = ''
        this.selectedptype = 1
        this.today = ''
        this.selectedgroups = []
      },
      setDiscontStudent () {
        debugger
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
        this.$store.dispatch(UPDATE_DISCONT, { studentList: data, type: 2 }).then((res) => {
          this.loading = false
          this.onReset()
          appPlugin.showalert(this.$t('userinfo'), this.$t('updateSuccesMsg'), 'success', this.$t('ok'))

        }).catch((err) => {
          debugger
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('updateErrorMsg'), 'error', this.$t('ok'))

        })
      },
      fetchDStatusA () {
        debugger
        if (this.selectedActivity == '') {
          appPlugin.showalert(this.$t('warning'), 'Faaliyet Seç', 'info', this.$t('ok'))
        } else if (this.selectedperiods == '') {
          appPlugin.showalert(this.$t('warning'), 'Period Seç', 'info', this.$t('ok'))
        } else if (this.selectedgroups == '') {
          appPlugin.showalert(this.$t('warning'), 'Sınıf Seç', 'info', this.$t('ok'))
        } else if (this.today == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('setstartdate'), 'info', this.$t('ok'))
        } else {
          this.loading = true
          debugger
          this.$store.dispatch(FETCH_ACTDIS_STUDENT, {
            date: moment(this.today).format('YYYY-MM-DD'),
            activityid: this.selectedActivity.id,
            periodid: this.selectedperiods.id,
            gradeid: this.selectedgroups.id,
            type: this.selectedptype
          }).then((res) => {
            debugger
            this.loading = false
            if (Object.keys(res.data).length > 0) {
              this.keys = Object.keys(res.data)
              this.studentData = res.data
            } else {
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
              this.keys = []
              this.studentData = []
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
          })
        }
      },
      onChangePeriods (data) {
        debugger
        this.$store.commit(SET_ACTIVITY_GRADERS_DP, [])
        this.selectedgroups = ''
        this.loading = true
        this.$store.dispatch(FETCH_ACTIVITY_GRADES_DP, {
          actid: this.selectedActivity.id,
          perid: data.id
        }).then((res) => {
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
        })
      },
      onChangeActivity (data) {
        debugger
        this.$store.commit(SET_ACTIVITIY_GRADES_D, [])
        this.$store.commit(SET_ACTIVITY_GRADERS_DP, [])
        this.selectedgroups = ''
        this.selectedperiods = ''
        this.loading = true
        this.$store.dispatch(FETCH_ACTIVITY_GRADES_D, { id: data.id }).then((res) => {
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
        })
      }
    },
    created () {
      this.loading = true
      this.$store.dispatch('fetchActivities').then((res) => {
        this.loading = false
      }).catch((err) => {
        this.loading = false
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
      this.$store
        .dispatch(FETCH_DTYPE)
        .then(res => {
          this.loading = false
        })
        .catch(err => {
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
          this.loading = false
        })
      this.$store.dispatch(FETCH_SCHOOL_P_TYPE).then((res) => {
        this.loading = false
      }).catch((err) => {
        this.loading = false
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
    },
  }
</script>

<style scoped>

</style>
