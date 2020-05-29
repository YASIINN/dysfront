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
          <label>Faaliyet Seç</label>
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
          <label>Haftalar/Dönemler</label>
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
            placeholder="Haftalar/Dönemler Seçiniz"
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

    </div>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <v-button :btnName="$t('getrecord')" className="btn btn-primary mt-4 float-right"
                @onClick="fetchDiscont"></v-button>

    </flex>
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
  import { FETCH_DTYPE } from '@/store/modules/dtype/moduleNames'
  import { FETCH_SCHOOL_P_TYPE } from '@/store/modules/schoolprogramtypepivot/moduleNames'
  import {
    FETCH_ACTIVITY_GRADES_D,
    FETCH_ACTIVITY_GRADES_DP,
    SET_ACTIVITY_GRADERS_DP,
    SET_ACTIVITIY_GRADES_D,
    FETCH_GETSTUDENTS_DISCONTS_GP
  } from '../../../store/modules/discontinuity/moduleNames'

  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
  import loadingMixins from '@/mixins/loading'

  export default {
    name: 'activityforclass',
    components: {
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
        selectedptype: 1,
        today: '',
        selectedActivity: '',
        selectedperiods: '',
        selectedgroups: '',
        dstudentlist: [],
        selecteddtype: { id: 0, dtName: 'Tümü' },
      }
    },
    mixins: [loadingMixins],
    methods: {
      onChangeDType (item, i, k, dtype) {
        //ptype
        this.onOpenIndıcator()

        let today = moment(this.today).format('YYYY-MM-DD')
        this.$store.dispatch(FETCH_GETSTUDENTS_DISCONTS_GP, {
          day: today,
          gradeid: this.selectedgroups.id,
          activityid: this.selectedActivity.id,
          periodid: this.selectedperiods.id,
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
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
        })
      },
      onChangePeriods (data) {
        debugger
        this.$store.commit(SET_ACTIVITY_GRADERS_DP, [])
        this.selectedgroups = ''
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_ACTIVITY_GRADES_DP, {
          actid: this.selectedActivity.id,
          perid: data.id
        }).then((res) => {
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
        })
      },
      fetchDiscont () {
        debugger
        if (this.today == '') {
          appPlugin.showalert(this.$t('warning'), this.$t('selectday'), 'info', this.$t('ok'))
        } else if (this.selectedActivity == '') {
          appPlugin.showalert(this.$t('warning'), 'Faaliyet Seçiniz', 'info', this.$t('ok'))
        } else if (this.selectedperiods == '') {
          appPlugin.showalert(this.$t('warning'), 'Faaliyet Dönem Seç', 'info', this.$t('ok'))
        } else if (this.selectedgroups == '') {
          appPlugin.showalert(this.$t('warning'), 'Faaliyet Sınıf Seç', 'info', this.$t('ok'))
        } else {
          this.$store.dispatch(FETCH_GETSTUDENTS_DISCONTS_GP, {
            dtype: 0,
            gradeid: this.selectedgroups.id,
            activityid: this.selectedActivity.id,
            periodid: this.selectedperiods.id,
            ptype: this.selectedptype,
            day: moment(this.today).format('YYYY-MM-DD'),
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
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
          })

        }
      },
      onChangeActivity (data) {
        debugger
        this.$store.commit(SET_ACTIVITIY_GRADES_D, [])
        this.$store.commit(SET_ACTIVITY_GRADERS_DP, [])
        this.selectedgroups = ''
        this.selectedperiods = ''
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_ACTIVITY_GRADES_D, { id: data.id }).then((res) => {
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
        })
      }
    },

    created () {
      this.onOpenIndıcator()
      this.$store.dispatch(FETCH_DTYPE).then((res) => {
        this.onCloseIndıcator()
        res.data.unshift({ id: 0, dtName: 'Tümü' })
        this.dtypes = res.data
      }).catch((err) => {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
      this.$store.dispatch('fetchActivities').then((res) => {
        this.onCloseIndıcator()
      }).catch((err) => {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
      this.$store.dispatch(FETCH_SCHOOL_P_TYPE).then((res) => {
        this.onCloseIndıcator()
      }).catch((err) => {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
      })
    }
  }
</script>

<style scoped>

</style>
