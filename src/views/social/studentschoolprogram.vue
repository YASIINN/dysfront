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
          <label>Ders Programı Bilgisini Görüntülemek İstediğiniz Öğrencinizi Seçiniz</label>
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
        <div v-if="selectedStudent.s_fullname!=undefined">
          <div class="form-group">
            <select class="form-control" v-model="selectedprograms" @change="changeProgramTypes">
              <option v-for="option in programsTypeList" v-bind:value="option">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="selectedprograms.id!=0">
            <select class="form-control" v-model="selectedptype" @change="fetchStudentPrograms(selectedptype)">
              <option v-for="option in ptypeslist" v-bind:value="option">
                {{ option.ptName }}
              </option>
            </select>
          </div>

          <div class="form-group" v-if="selectedprograms.id==2 && studentactivities.length>0 && selectedptype.id!=0">
            <select class="form-control" v-model="selectedactivity"
                    @change="fetchStudentActivityPrograms(selectedactivity)">
              <option v-for="option in studentactivities" v-bind:value="option">
                {{ option.activity + ' '+ option.period+ ' '+option.grade }}
              </option>
            </select>
          </div>
        </div>
      </flex>

    </flex-card>
    <flex-card column="col-lg-12 col-sm-12 col-md-12" :headerTitle="cardHeader" v-if="view">
      <table-school v-if="view" title=""></table-school>

    </flex-card>
    <flex-card column="col-lg-12 col-sm-12 col-md-12" :headerTitle="cardHeader" v-if="activityView">
      <table-grade v-if="activityView"></table-grade>

    </flex-card>

  </div>
</template>

<script>
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
  import TableGrade from '@/views/activityschedule/viewpartial/tablegrade'
  import TableSchool from '@/views/activityschedule/viewpartial/tableschool'
  import { FETCH_USER_STUDENTS } from '../../store/modules/users/moduleNames'
  import studentcard from '@/components/studentcard/index'
  import {
    FETCH_SCHOOL_P_TYPE,
    GET_SCHOOL_P_TYPE
  } from '@/store/modules/schoolprogramtypepivot/moduleNames'
  import { mapGetters } from 'vuex'
  import loadingMixins from '@/mixins/loading'

  export default {
    created () {
      //TODO USERID
      this.fetchPTypes()
      this.fetchUserStudent()
    },
    mixins: [loadingMixins],
    data () {
      return {
        activityView: false,
        cardHeader: '',
        view: false,
        selectedactivity: {
          id: 0,
          activity: 'Faaliyet Seçiniz',
          period: '',
          grade: ''
        },
        selectedprograms: {
          id: 0,
          name: 'Program Seçiniz'
        },
        programsTypeList: [
          {
            id: 0,
            name: 'Program Seçiniz'
          },
          {
            id: 1,
            name: 'Okul'
          },
          {
            id: 2,
            name: 'Faaliyet'
          },
          {
            id: 3,
            name: 'Spor Kulübü'
          }
        ],
        selectedptype: { id: 0, ptName: 'Program Türü Seçiniz' },
        ptypeslist: [],
        selectedStudent: {},
      }
    },
    components: {
      TableGrade,
      TableSchool,
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
    computed: {
      ...mapGetters({
        activityptypes: 'activityptypes',
        studentactivities: 'studentactivities',
        ptypes: 'ptypes',
        schoolptypes: GET_SCHOOL_P_TYPE,
      })

    },
    methods: {
      async fetchStudentActivityPrograms (data) {
        debugger
        if (data.id == 0) {
          this.view = false
          this.activityView = false
        } else {
          let payloadPType = {
            activity_id: data.activity_id,
            period_id: data.period_id,
            p_type_id: this.selectedptype.id
          }
          await this.$store.dispatch('fetchActivityPTypes', payloadPType)
          if (this.activityptypes.length > 0) {
            let payload = {
              a_p_type_id: this.activityptypes[0].id,
              grade_id: data.grade_id
            }
            await this.$store.dispatch('fetchActivityPDays', { where: 'activity_p_type_id', id: payload.a_p_type_id })
            await this.$store.dispatch('fetchActivityPHours', { where: 'activity_p_type_id', id: payload.a_p_type_id })
            await this.$store.dispatch('fetchActivityPContents', payload)
            this.activityView = true
            this.view = false
          } else {
            appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            this.activityView = false
            this.view = false
          }
        }
      },
      async fetchStudentPrograms (data) {
        debugger
        if (data.id == 0) {
          this.view = false
          this.activityView = false
        } else {

          if (this.selectedprograms.id == 1 && data.id != 0) {
            debugger
            await this.$store.dispatch(FETCH_SCHOOL_P_TYPE)
            let ptype = this.schoolptypes.find(sp => sp.programtypeid === data.id)
            if (ptype) {
              console.log(ptype)
              let payload = {
                s_p_type_id: ptype.pivotid,
                school_id: this.selectedStudent.schools[0].id,
                class_id: this.selectedStudent.clases[0].id,
                branch_id: this.selectedStudent.branches[0].id
              }
              console.log(payload)
              await this.$store.dispatch('fetchSchoolDays', {
                urlparse: appPlugin.urlParse(
                  'school_p_type_id=' + payload.s_p_type_id
                )
              })

              await this.$store.dispatch('fetchSchoolHours', {
                urlparse: appPlugin.urlParse(
                  'school_p_type_id=' + payload.s_p_type_id
                )
              })
              await this.$store.dispatch('fetchSchoolPContents', payload)
              this.view = true
              this.activityView = false
              this.cardHeader = this.selectedStudent.schools[0].sName + ' ' + this.selectedStudent.clases[0].cName + ' ' + this.selectedStudent.branches[0].bName + ' ' + ptype.programtypename
            } else {
              this.activityView = false
              this.view = false
              appPlugin.showalert(this.$t('warning'), this.$t('noData'), 'info', this.$t('ok'))
            }
          } else if (this.selectedprograms.id == 3) {
            //TODO
          }
        }

      },
      fetchPTypes () {
        this.onOpenIndıcator()
        this.$store.dispatch('fetchPTypes').then((res) => {
          let data = this.$store.getters.ptypes
          data.unshift({
            id: 0,
            ptName: 'Program Türü Seçiniz'
          })
          this.ptypeslist = data
        }).catch((err) => {
          alert('a')
        })
      },
      async changeProgramTypes () {
        if (this.selectedprograms.id == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Program Türü Seçiniz', 'info', this.$t('ok'))
        } else {
          if (this.selectedprograms.id == 2) {
            await this.$store.dispatch('fetchStdActivities', {
              where: 'student_id',
              id: this.selectedStudent.id
            })
            if (this.studentactivities.length > 0) {
              this.studentactivities.unshift({
                id: 0,
                activity: 'Faaliyet Seçiniz',
                period: '',
                grade: ''
              })
              //      let a = this.studentactivities.find(sa=>sa.isActive === true);

            }
          }
        }
      },
      onChangeStudent (data) {
        debugger
        this.selectedStudent = data
        this.view = false
        this.activityView = false
        this.selectedptype = { id: 0, ptName: 'Program Türü Seçiniz' },
          this.selectedactivity = {
            id: 0,
            activity: 'Faaliyet Seçiniz',
            period: '',
            grade: ''
          },
          this.selectedprograms = {
            id: 0,
            name: 'Program Seçiniz'
          }
        /*  this.fetchDiscont()*/
        /*this.selectedStudent = {}*/
      },
      fetchUserStudent () {
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_USER_STUDENTS, {
          userid: 2
        }).then((res) => {
          if (res.data.length == 1) {
            this.selectedStudent = res.data[0]
            /*   this.fetchDiscont()*/
          }

          this.onCloseIndıcator()
        }).catch((err) => {
          debugger
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), 'Öğrenci Bilgileri Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin', 'error', this.$t('ok'))
        })
      }
    },
    name: 'studentschoolprogram'
  }
</script>

<style scoped>

</style>
