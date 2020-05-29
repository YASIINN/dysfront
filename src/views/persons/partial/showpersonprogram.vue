<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="header">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <div class="form-group">
                <label>Program Seçiniz</label>
                <div class="input-group input-group-merge">
                  <multiselect
                    @select="onChangeType"
                    v-model="selectedType"
                    track-by="name"
                    @close="onTouch"
                    :allow-empty="true"
                    label="name"
                    selectedLabel="Seçili"
                    selectLabel="Seç"
                    :hide-selected="false"
                    :multiple="false"
                    deselectLabel
                    :options="programType"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    placeholder="Personel Seçiniz"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red"
                  >Lütfen Program Seçiniz</small
                  >
                </div>
              </div>
              <div class="form-group" v-if="selectedType.id != undefined">
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
                  <small v-if="isInvalid" style="color: red"
                  >Lütfen Program Seçiniz</small
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" v-if="!isInvalid">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <table
                class="table table-bordered table-responsive table-hover table-striped"
              >
                <thead>
                <th :colspan="daysData.length + 1">
                  <h4 class="text-center">
                    Toplam Ders Saati : {{ getTotalHour() }} Saat
                  </h4>
                </th>
                </thead>
                <tbody>
                <tr>
                  <th></th>
                  <th v-for="(item, i) in daysData">
                    <h5 class="text-center">{{ item.sdName }}</h5>
                  </th>
                </tr>
                <tr
                  v-for="(hours, j) in daysData[0].hours"
                  v-if="daysData[0].hours != undefined"
                >
                  <td>
                    <h5>
                      {{ hours.shName }}
                      <br/>
                      {{ hours.beginDate }} - {{ hours.endDate }}
                    </h5>
                  </td>
                  <td v-for="(program, i) in daysData">
                    <p class="text-center">
                      Ders Adı :
                      <strong>{{ getLessons(i, j) }}</strong>
                    </p>
                    <p class="text-center">
                      Sınıf Adı :
                      <strong>{{ getClases(i, j) }}</strong>
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="form-group pt-5">
                <h4>{{ header }} {{ ' ' }} <!--Dersler Ve--> Toplam Saatler</h4>

                <ul class="list-group">
                  <li
                    v-for="(subTotal, key) in getSubTotal()"
                    class="list-group-item"
                  >
                    <p class="text-underline text-blue font-weight-bold">
                      Sınıf Adı : {{ key }}
                    </p>
                    <ul>
                      <li v-for="(t,l,k) in subTotal.sbLesson">
                        <p>Ders Adı : {{ l }} X {{t.length}}</p>
                      </li>
                    </ul>
                    <p>Toplam Ders Saati : {{ subTotal.length }} Saat</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  import {
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
  import _ from 'underscore'
  import {
    FETCH_ALL_USER_APROGRAM,
    FETCH_ALL_USER_PROGRAM,
    FETCH_ACTIVITY_PROGRAM,
    FETCH_USER_SPORCLUB_PROGRAM
  } from '../../../store/modules/users/moduleNames'
  import { FETCH_SCHOOL_DAYS } from '../../../store/modules/schooldays/moduleNames'
  import { FETCH_SCHOOL_HOURS } from '../../../store/modules/schoolhours/moduleNames'
  import { FETCH_USER_SCHOOL_PROGRAM } from '../../../store/modules/schoolprogram/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    props: {
      header: {}
    },
    computed: {
      isInvalid () {
        return this.selectedProgram.programid == undefined
      }
    },
    data () {
      return {
        programType: [
          {
            id: 1,
            name: 'Okul Programı'
          },
          {
            id: 2,
            name: 'Faaliyet Programı'
          },
          {
            id: 3,
            name: 'Spor Kulübü Programı'
          }
        ],
        selectedType: {},
        onselectProgramType: false,
        hoursData: [],
        daysData: [],
        ontouch: false,
        selectedProgram: {},
      }
    },
    methods: {
      onChangeType (data) {
        this.selectedProgram = {}
        if (data.id == 1) {
          this.getUserProgram()
        } else if (data.id == 2) {
          this.getUserActivityProgram()
        } else if (data.id == 3) {
          this.getUserSporClubProgram()
        }
      },
      getTotalHour () {
        let totalCount = 0
        if (this.selectedType.id == 1) {
          if (this.$store.getters.getSchoolProgramUser.length > 0) {
            this.$store.getters.getSchoolProgramUser.forEach(item => {
              if (item.school_p_type_id == this.selectedProgram.programid) {
                totalCount++
              }
            })
          }
        } else if (this.selectedType.id == 2) {
          if (this.$store.getters.getActivityUserPrograms.length > 0) {
            this.$store.getters.getActivityUserPrograms.forEach(item => {
              if (item.activity_p_type_id == this.selectedProgram.programid) {
                totalCount++
              }
            })
          }
        } else if (this.selectedType.id == 3) {
          if (this.$store.getters.getUserSporClubProgramD.length > 0) {
            this.$store.getters.getUserSporClubProgramD.forEach(item => {
              if (item.club_p_type_id == this.selectedProgram.programid) {
                totalCount++
              }
            })
          }
        }
        return totalCount
      },
      getSubTotal () {
        let subTotal = []
        if (this.selectedType.id == 1) {
          if (this.$store.getters.getSchoolProgramUser.length > 0) {
            this.$store.getters.getSchoolProgramUser.forEach(item => {
              if (item.school_p_type_id == this.selectedProgram.programid) {
                item.lesName = item.lessons.lName
                subTotal.push(item)
              }
            })
          }
          let groupedSubTotal = _.groupBy(subTotal, 'classBranchName')
          let keys = Object.keys(groupedSubTotal)
          for (let i = 0; i < keys.length; i++) {
            let sl = _.groupBy(groupedSubTotal[keys[i]], 'lesName')
            groupedSubTotal[keys[i]]['sbLesson'] = sl
          }
          return groupedSubTotal
        } else if (this.selectedType.id == 2) {
          debugger
          if (this.$store.getters.getActivityUserPrograms.length > 0) {
            this.$store.getters.getActivityUserPrograms.forEach(item => {
              if (item.activity_p_type_id == this.selectedProgram.programid) {
                item.lesName = item.slesson.lName
                item.lessons = item.slesson
                subTotal.push(item)
              }
            })
          }
          let groupedSubTotal = _.groupBy(subTotal, 'gradeBranchName')
          let keys = Object.keys(groupedSubTotal)
          for (let i = 0; i < keys.length; i++) {
            let sl = _.groupBy(groupedSubTotal[keys[i]], 'lesName')
            debugger
            groupedSubTotal[keys[i]]['sbLesson'] = sl
          }
          return groupedSubTotal
        } else if (this.selectedType.id == 3) {
          if (this.$store.getters.getUserSporClubProgramD.length > 0) {
            this.$store.getters.getUserSporClubProgramD.forEach((item) => {
              if (item.club_p_type_id == this.selectedProgram.programid) {
                item.lesName = item.lessons.lName
                subTotal.push(item)
              }
            })
            let groupedSubTotal = _.groupBy(subTotal, 'classBranchName')
            let keys = Object.keys(groupedSubTotal)
            for (let i = 0; i < keys.length; i++) {
              let sl = _.groupBy(groupedSubTotal[keys[i]], 'lesName')
              groupedSubTotal[keys[i]]['sbLesson'] = sl
            }
            return groupedSubTotal
          }
        }
      },
      getClases (i, j) {
        if (this.selectedType.id == 1) {
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
        } else if (this.selectedType.id == 2) {
          if (this.$store.getters.getActivityUserPrograms.length > 0) {
            let finded = this.$store.getters.getActivityUserPrograms.find(
              item => {
                return (
                  item.activity_day_id == this.daysData[i].id &&
                  item.activity_hour_id == this.daysData[i].hours[j].hourid
                )
              }
            )
            if (finded != undefined) {
              return finded.sgrade.name
            } else {
              return ''
            }
          }
        } else if (this.selectedType.id == 3) {
          if (this.$store.getters.getUserSporClubProgramD.length > 0) {
            let finded = this.$store.getters.getUserSporClubProgramD.find(
              item => {
                return (
                  item.club_day_id == this.daysData[i].id &&
                  item.club_hour_id == this.daysData[i].hours[j].hourid
                )
              }
            )
            if (finded != undefined) {
              return finded.classBranchName
            } else {
              return ''
            }
          }
        }
        return ''
      },
      getLessons (i, j) {
        if (this.selectedType.id == 1) {
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
        } else if (this.selectedType.id == 2) {
          if (this.$store.getters.getActivityUserPrograms.length > 0) {
            let finded = this.$store.getters.getActivityUserPrograms.find(
              item => {
                return (
                  item.activity_day_id == this.daysData[i].id &&
                  item.activity_hour_id == this.daysData[i].hours[j].hourid
                )
              }
            )
            if (finded != undefined) {
              return finded.slesson.lName
            } else {
              return ''
            }
          }
        } else if (this.selectedType.id == 3) {
          if (this.$store.getters.getUserSporClubProgramD.length > 0) {
            let finded = this.$store.getters.getUserSporClubProgramD.find(
              item => {
                return (
                  item.club_day_id == this.daysData[i].id &&
                  item.club_hour_id == this.daysData[i].hours[j].hourid
                )
              }
            )
            if (finded != undefined) {
              return finded.lessons.lName
            } else {
              return ''
            }
          }
        }
        return ''
      },
      getUserSporClubProgram () {
        //TODO BAK
        this.onOpenIndıcator()
        this.$store
          .dispatch(FETCH_USER_SPORCLUB_PROGRAM, { id: this.$route.params.id })
          .then(res => {
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))

          })
      },
      getUserActivityProgram () {
        //bura
        this.onOpenIndıcator()
        this.$store
          .dispatch(FETCH_ALL_USER_APROGRAM, { id: this.$route.params.id })
          .then(res => {
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))

          })
      },
      getUserProgram () {
        this.onOpenIndıcator()
        this.$store
          .dispatch(FETCH_ALL_USER_PROGRAM, { id: this.$route.params.id })
          .then(res => {
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))

          })
      },
      onTouch () {
        this.ontouch = true
      },
      async getSporClubHoursDate (id) {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchClubPHours', { where: 'club_p_type_id', id: id })
        await this.$store.dispatch('fetchClubPDays', { where: 'club_p_type_id', id: id })

        let sporclubdays = this.$store.getters.clubpdays
        let sporclubhours = this.$store.getters.clubphours
        console.log(sporclubdays)
        this.onCloseIndıcator()
        sporclubdays.forEach(item => {
          item.sdName = item.adname
          item.hours = []
          sporclubhours.forEach(hour => {
            item.hours.push({
              shName: hour.chname,
              beginDate: hour.begin,
              endDate: hour.end,
              hourid: hour.id,
              lessonid: '',
              personData: []
            })
          })
        })
        this.hoursData = sporclubhours
        this.daysData = sporclubdays
      },
      async getActivityHoursDate (id) {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchActivityPDays', {
          where: 'activity_p_type_id',
          id: id
        })
        await this.$store.dispatch('fetchActivityPHours', {
          where: 'activity_p_type_id',
          id: id
        })

        let activitydays = this.$store.getters.activitypdays
        let activityhour = this.$store.getters.activityphours
        this.onCloseIndıcator()
        activitydays.forEach(item => {
          item.sdName = item.adname
          item.hours = []
          activityhour.forEach(hour => {
            item.hours.push({
              shName: hour.ahname,
              beginDate: hour.begin,
              endDate: hour.end,
              hourid: hour.id,
              lessonid: '',
              personData: []
            })
          })
        })
        this.hoursData = activityhour
        this.daysData = activitydays
      },
      async getHoursDate (id) {
        this.onOpenIndıcator()
        let schooldays = await this.$store.dispatch(FETCH_SCHOOL_DAYS, {
          urlparse: appPlugin.urlParse('school_p_type_id=' + id)
        })
        let schoolhour = await this.$store.dispatch(FETCH_SCHOOL_HOURS, {
          urlparse: appPlugin.urlParse('school_p_type_id=' + id)
        })
        this.onCloseIndıcator()
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
      },
      onChangeProgram (data) {
        debugger
        this.onOpenIndıcator()
        if (this.selectedType.id == 1) {
          let query = {
            userid: this.$route.params.id,
            programid: data.programid
          }
          this.getHoursDate(data.programid)
          this.$store
            .dispatch(FETCH_USER_SCHOOL_PROGRAM, query)
            .then(res => {
              this.onCloseIndıcator()
            })
            .catch(err => {
              this.onCloseIndıcator()
            })
        } else if (this.selectedType.id == 2) {
          this.getActivityHoursDate(data.programid)
          let query = {
            userid: this.$route.params.id,
            programid: data.programid
          }
          this.$store
            .dispatch(FETCH_ACTIVITY_PROGRAM, query)
            .then(res => {
              this.onCloseIndıcator()
            })
            .catch(err => {
              this.onCloseIndıcator()
            })
        } else if (this.selectedType.id == 3) {
          this.getSporClubHoursDate(data.programid)
          let query = {
            userid: this.$route.params.id,
            programid: data.programid
          }
          this.$store.dispatch('fetchUserSporClubProgramD', query).then((res) => {
            this.onCloseIndıcator()
            console.log('response', res)

          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
          })
        }
      }
    },

    name: 'showpersonprogram',
    components: {
      AlertBox,
      Multiselect,
      VSelect,
      VTabs,
      FlexCard,
      Flex,
      VTabContent,
      Loading,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    }
  }
</script>

<style scoped></style>
