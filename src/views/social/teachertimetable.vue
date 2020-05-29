<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="'Programlar'">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12  col-sm-12 col-lg-12">
              <ATabs fill class="flex-column flex-xs-row" :value="filterTab[0].name" v-if="filterTab.length>0">
                <br/>
                <ATabPane
                  @getId="getId(tabItem,i)"
                  v-for="(tabItem, i) in filterTab"
                  :key="i"
                  :title="tabItem.name"
                >
                  <div class="form-group" v-if="$store.getters.getUserPrograms.length>0">
                    <label>Ders Programları</label>
                    <div class="input-group input-group-merge">
                      <multiselect
                        @select="onChangeProgram"
                        v-model="selectedProgram"
                        track-by="schoolprogramname"
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
                    </div>
                  </div>
                  <h4 class="text text-center" v-if="$store.getters.getUserPrograms.length<1"> Program Bulunamadı</h4>

                </ATabPane>
              </ATabs>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <flex-card column="col-md-12 col-sm-12 col-lg-12 mt-5" v-if="!isInvalid">
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

    <!--   <p class="text text-center" v-if="$store.getters.getUserPost.length!=0"> Toplam Paylaşım :
         {{$store.getters.getUserPost.length}}
       </p>
       <p class="text text-center" v-if="$store.getters.getUserPost.length==0">
         Henüz Paylaşımınız Yok
         <router-link tag="a" to="/social">Buraya</router-link>
         Tıklayarak Paylaşım Oluşturabilirsiniz.
       </p>-->

  </div>
</template>

<script>
  import {
    Loading,
    FlexCard,
    Flex,
    VButton,
    VInput,
    appPlugin,
    Multiselect
  } from '@/Providers/defaultImports'
  import { Datetime } from 'vue-datetime'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import _ from 'underscore'
  import Vue from 'vue'
  import {
    FETCH_ACTIVITY_PROGRAM,
    FETCH_ALL_USER_APROGRAM,
    FETCH_ALL_USER_PROGRAM,
    FETCH_USER_SPORCLUB_PROGRAM, SET_USER_PROGRAMS_ALL
  } from '../../store/modules/users/moduleNames'
  import { FETCH_USER_SCHOOL_PROGRAM } from '../../store/modules/schoolprogram/moduleNames'
  import { FETCH_SCHOOL_DAYS } from '../../store/modules/schooldays/moduleNames'
  import { FETCH_SCHOOL_HOURS } from '../../store/modules/schoolhours/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    name: 'teachertimetable',
    mixins: [loadingMixins],
    components: {
      FlexCard,
      Flex,
      Loading,
      VInput,
      VButton,
      Datetime,
      Multiselect

    },
    computed: {
      isInvalid () {
        return this.selectedProgram.programid == undefined
      }
    },
    methods: {
      onChangeProgram (data) {
        debugger
        //TODO LOGIN USERID
        this.onOpenIndıcator()
        if (this.currentTabItem.id == 0) {
          let query = {
            userid: 2,
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
        } else if (this.currentTabItem.id == 1) {
          this.getActivityHoursDate(data.programid)
          let query = {
            userid: 2,
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
        } else if (this.currentTabItem.id == 2) {
          this.getSporClubHoursDate(data.programid)
          let query = {
            userid: 2,
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
      getTotalHour () {
        let totalCount = 0
        if (this.currentTabItem.id == 0) {
          if (this.$store.getters.getSchoolProgramUser.length > 0) {
            this.$store.getters.getSchoolProgramUser.forEach(item => {
              if (item.school_p_type_id == this.selectedProgram.programid) {
                totalCount++
              }
            })
          }
        } else if (this.currentTabItem.id == 1) {
          if (this.$store.getters.getActivityUserPrograms.length > 0) {
            this.$store.getters.getActivityUserPrograms.forEach(item => {
              if (item.activity_p_type_id == this.selectedProgram.programid) {
                totalCount++
              }
            })
          }
        } else if (this.currentTabItem.id == 2) {
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
        if (this.currentTabItem.id == 0) {
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
        } else if (this.currentTabItem.id == 1) {
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
        } else if (this.currentTabItem.id == 2) {
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
        if (this.currentTabItem.id == 0) {
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
        } else if (this.currentTabItem.id == 1) {
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
        } else if (this.currentTabItem.id == 2) {
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
        if (this.currentTabItem.id == 0) {
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
        } else if (this.currentTabItem.id == 1) {
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
        } else if (this.currentTabItem.id == 2) {
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
      getId (tabItem, i) {
        this.currentTab = i
        this.currentTabItem = tabItem
        this.selectedProgram = {}
        switch (tabItem.id) {
          case 0:

            this.getUserProgram()

            return
          case 1:

            this.getUserActivityProgram()
            return
          case 2:

            this.getUserSporClubProgram()
            return
        }
      },
      getUserSporClubProgram () {
        //TODO BAK
        //TODO USER ID LOGIN

        this.onOpenIndıcator()
        this.$store.commit(SET_USER_PROGRAMS_ALL, [])

        this.$store
          .dispatch(FETCH_USER_SPORCLUB_PROGRAM, { id: 2 })
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
        //TODO USER ID LOGIN

        this.onOpenIndıcator()
        this.$store.commit(SET_USER_PROGRAMS_ALL, [])

        this.$store
          .dispatch(FETCH_ALL_USER_APROGRAM, { id: 2 })
          .then(res => {
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))

          })
      },
      getUserProgram () {
        //TODO USER ID LOGIN
        this.onOpenIndıcator()
        this.$store.commit(SET_USER_PROGRAMS_ALL, [])
        this.$store
          .dispatch(FETCH_ALL_USER_PROGRAM, { id: 2 })
          .then(res => {

            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))

          })
      },
    },
    data () {
      return {
        hoursData: [],
        daysData: [],
        filterTab: [
          {
            id: 0,
            name: 'Okul Programı'
          },
          {
            id: 1,
            name: 'Faaliyet Programı'
          },
          {
            id: 2,
            name: 'Spor Kulübü Programı'
          }
        ],
        selectedProgram: {},
        currentTab: 1,
        currentTabItem: '',
        loading: false
      }
    }
  }
</script>

<style scoped>

</style>
