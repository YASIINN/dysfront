<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="header">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label>Personeller</label>
                <div class="input-group input-group-merge">
                  <multiselect
                    @select="onChangePerson"
                    v-model="selectedPerson"
                    track-by="uFullName"
                    @close="onTouch"
                    :allow-empty="true"
                    label="uFullName"
                    selectedLabel="Seçili"
                    selectLabel="Seç"
                    :hide-selected="false"
                    :multiple="false"
                    deselectLabel
                    :options="personsProgramList"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    placeholder="Personel Seçiniz"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red"
                  >Lütfen Personel Seçiniz</small
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <flex-card column="col-lg-12" v-if="!isInvalid">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12">
              <table
                class="table table-bordered  table-responsive table-hover table-striped"
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
                <h4>{{ header }} {{ ' ' }} Dersler Ve Toplam Saatler</h4>

                <ul class="list-group">
                  <li
                    v-for="(subTotal, key) in getSubTotal()"
                    class="list-group-item"
                  >
                    <p class="text-underline text-blue font-weight-bold">
                      Sınıf Adı : {{ key }}
                    </p>

                    <ul>
                      <li>
                        <p>Ders Adı : {{ subTotal[0].lessons.lName }}</p>
                      </li>
                    </ul>
                    <p>Ders Saati : {{ subTotal.length }} Saat</p>
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
  import Createprogramtable from './createprogramtable'
  import _ from 'underscore'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'showpersonprogram',
    data () {
      return {
        hoursData: [],
        daysData: [],
        ontouch: false,
        selectedPerson: {},
        personsProgramList: [],
      }
    },
    async created () {
      this.fetchPersonsProgram()
      this.onOpenIndıcator()

      let schooldays = this.$store.getters.getSchoolDays
      // await this.$store.dispatch("fetchSchoolDays", {
      //   urlparse: appPlugin.urlParse("school_p_type_id=" + this.$route.params.id)
      // });
      let schoolhour = this.$store.getters.getSchoolHour
      // await this.$store.dispatch("fetchSchoolHours", {
      //   urlparse: appPlugin.urlParse("school_p_type_id=" + this.$route.params.id)
      // });
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
    computed: {
      isInvalid () {
        return this.selectedPerson.id == undefined
      }
    },
    props: {
      onreset: {},
      showVisible: {},
      school: {},
      header: {}
    },
    watch: {
      onreset (val) {
        if (val == true) {
          this.selectedPerson = {}
        }
      }
    },
    methods: {
      getTotalHour () {
        let totalCount = 0
        if (this.$store.getters.getSchoolProgramUser.length > 0) {
          this.$store.getters.getSchoolProgramUser.forEach(item => {
            if (item.school_p_type_id == this.$route.params.id) {
              totalCount++
            }
          })
        }
        return totalCount
      },
      getSubTotal () {
        let subTotal = []
        if (this.$store.getters.getSchoolProgramUser.length > 0) {
          this.$store.getters.getSchoolProgramUser.forEach(item => {
            if (item.school_p_type_id == this.$route.params.id) {
              subTotal.push(item)
            }
          })
        }
        let groupedSubTotal = _.groupBy(subTotal, 'classBranchName')
        return groupedSubTotal
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
      onChangePerson (data) {
        let query = {
          userid: data.id,
          programid: this.$route.params.id
        }
        this.onOpenIndıcator()
        this.$store
          .dispatch('fetchSchoolProgramUser', query)
          .then(res => {
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      },
      onTouch () {
        this.ontouch = true
      },

      fetchPersonsProgram () {
        this.onOpenIndıcator()
        this.$store
          .dispatch('getUserSchoolProgram', {
            schoolid: this.school.schoolid
          })
          .then(res => {
            this.onCloseIndıcator()
            if (res.status == 200 && res.data.length > 0) {
              this.personsProgramList = res.data
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(
              'Uyarı',
              'Beklenmeyen Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
              'info',
              'Tamam'
            )
          })
      }
    },
    components: {
      Createprogramtable,
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
