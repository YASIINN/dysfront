<template>
  <div>
    <Loading v-if="loading"></Loading>
    <tooltip title="Öğretmen Olarak Ata" @onClick="schoolTaskStatus=0" className="btn-outline-success"
             text="Öğretmen Olarak Ata"></tooltip>
    <tooltip title="Görevli Ata " @onClick="schoolTaskStatus=1"
             className="float-right btn-outline-warning" text="Görevli Olarak Ata"></tooltip>
    <flex-card column="col-lg-12">

      <div class="card-body">
        <flex column="col-md-12 col-sm-12 col-lg-12">
          <label>Görevli Olduğu Okullar</label>
          <div class="form-group">
            <multiselect v-model="personSchoolData" track-by="sName" @close="onTouch"
                         @input="onChangeSchool"
                         :allow-empty="false" label="sName" selectedLabel="Seçili"
                         selectLabel="Seç"
                         :hide-selected="false" :multiple="false"
                         deselectLabel="" :options="$store.getters.getSchools"
                         :searchable="true"
                         :close-on-select="true" :show-labels="true"
                         placeholder="Okul Seçiniz"></multiselect>
            <small v-if="isInvalid" style="color: red"
            >Lütfen Okul Seçiniz</small
            >
          </div>

        </flex>
        <flex v-if="schoolTaskStatus==0" column="col-md-12 col-sm-12 col-lg-12">
          <label>{{personSchoolData.sName}} Görevli Olduğu
            Sınıflar</label>
          <div class="form-group">
            <multiselect v-model="personClasesData" track-by="cbName" @close="onTouch"
                         :allow-empty="true" label="cbName" selectedLabel="Seçili"
                         selectLabel="Seç"
                         :hide-selected="false" :multiple="true"
                         deselectLabel="" :options="schoolClasBranchData" :searchable="true"
                         :close-on-select="false" :show-labels="true"
                         placeholder="Sınıf Seçiniz"></multiselect>
            <small v-if="isInvalid" style="color: red"
            >Lütfen Sınıf Seçiniz</small
            >
          </div>
        </flex>
        <flex v-if="schoolTaskStatus==0" column="col-md-12 col-sm-12 col-lg-12">
          <label>{{personSchoolData.sName}} Görevli Olduğu
            Dersler</label>
          <div class="form-group">
            <multiselect v-model="personLessonData" track-by="lName" @close="onTouch"
                         :allow-empty="true" label="lName" selectedLabel="Seçili"
                         selectLabel="Seç"
                         :hide-selected="false" :multiple="true"
                         deselectLabel="" :options="schoolLessonsData" :searchable="true"
                         :close-on-select="false" :show-labels="true"
                         placeholder="Ders Seçiniz"></multiselect>
            <small v-if="isInvalid" style="color: red"
            >Lütfen Ders Seçiniz</small
            >
          </div>
        </flex>
        <div class="row from-group" v-if="personData.schools.length>0">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <table class="table table-striped table-responsive table-bordered">
              <thead>
              <th>Görevli Olduğu Okul</th>
              <th>Görevli Olduğı Sınıflar</th>
              <th>Görevli Olduğu Dersler</th>
              </thead>
              <tbody>
              <tr v-for="item in personData.schools">
                <td>{{item.sName}}</td>
                <td>
                  <ul>
                    <li v-for="(cls,index) in item.clases">
                      {{cls.cbName}}
                      <div class="form-check form-check-inline ml-4">
                        <input v-model="cls.type" class="form-check-input"
                               @change="onChangeType(item,cls,index)"
                               type="checkbox" :id="cls.clases_id"
                               :value="cls.type">
                        <label class="form-check-label" :for="cls.clases_id">Sınıf Öğretmeni Olarak
                          İşaretle</label>
                      </div>
                    </li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li v-for="lesson in item.lessons">{{lesson.lName}}</li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div class="row">

          <div class="col-md-12 col-sm-12 col-lg-12 mt-5">

            <v-button :btnIcon="'fa-plus-circle'" :className="'btn-primary'"
                      :btnName="'Yeni  Okul  Ekle'"
                      @onClick="addNewSchool"></v-button>
            <v-button :btnIcon="'fa-save'" :className="'btn-success float-right'"
                      :btnName="'Kaydet'"
                      @onClick="saveUserSchool"></v-button>
          </div>
        </div>
      </div>

    </flex-card>
  </div>
</template>

<script>
  import tooltip from '@/components/tooltip'
  import {
    VTabs,
    FlexCard,
    VTabContent,
    MaskedInput,
    SearchBox,
    Loading,
    Multiselect,
    VSelect,
    Flex,
    VButton,
    VInput,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import { Datetime } from 'vue-datetime'

  export default {
    name: 'schooltaskcreate',
    props: {
      user: {}
    },
    data () {
      return {
        personData: {
          schools: [],
          lessons: [],
          clases: [],
          activity: [],
          sporclub: [],
          status: {
            school: false,
            sporclub: false,
            activity: false
          },
        },
        schoolLessonsData: [],
        personClasesData: [],
        loading: false,
        isTouched: false,
        schoolTaskStatus: 0,
        personSchoolData: [],
        schoolClasBranchData: [],
        personLessonData: [],
      }
    },
    computed: {
      isInvalid () {
        return this.isTouched && this.personClasesData === 0
      }
    },
    methods: {
      addLessonUserData (userId) {
        this.loading = true
        let data = []
        let lessonsData = []
        this.personData.schools.forEach((item) => {
          lessonsData = lessonsData.concat(item.lessons)
        })
        lessonsData.forEach((item) => {
          data.push(
            {
              userid: userId,
              lessonid: item.id
            }
          )
        })
        this.$store.dispatch('createUserLessons', { userslessonslist: data }).then((res) => {

          if (res.status) {
            if (res.status == 200) {
              this.loading = false
              this.addUserSchoolLessonData(userId)
            }
          } else {
            this.loading = false
            appPlugin.showalert('Personel Derslere Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Personel Derslere Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          //personel ders eklenme hatası

        })

        //console.log(lessonsData)

      },
      addUserSchoolClasesBranchesData (userId) {

        this.loading = true
        this.personData.schools.forEach((item) => {
          var data = []
          item.clases.forEach((clases) => {
            data.push({
              userid: userId,
              classid: clases.clases_id,
              schoolid: item.id,
              branchid: clases.branches_id,
              type: clases.type == true ? '1' : 0
            })
          })
          this.$store.dispatch('createUserSchoolClasesBranches', {
            userscblist: data
          }).then((res) => {
            if (res.status) {
              if (res.status == 200) {
                appPlugin.showalert('Personel Görevlendirme İşlemi Başarılı', '', 'success', 'Tamam')
                this.personData.schools = []
                this.personSchoolData = []
                this.personClasesData = []
                this.personLessonData = []
                this.loading = false
              }
            } else {
              appPlugin.showalert('Personel İlgili Okul Sınıf ve Şube Atamaları Oluşturulurken Hata Gerçekleşti', '', 'error', 'Tamam')
              this.loading = false
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Personel İlgili Okul Sınıf ve Şube Atamaları Oluşturulurken Hata Gerçekleşti', '', 'error', 'Tamam')
            //user okul ders hata
          })
        })
      },
      addUserSchoolClasesData (userId) {
        this.loading = true
        this.addUserSchoolClasesBranchesData(userId)
        this.personData.schools.forEach((item) => {
          var data = []
          item.clases.forEach((clases) => {
            data.push({
              userid: userId,
              classid: clases.clases_id,
              schoolid: item.id
            })
          })
          this.$store.dispatch('createUserSchoolClases', {
            usersclist: data
          }).then((res) => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = true
              }
            } else {
              this.loading = false
              appPlugin.showalert('Personel İlgili Okul Ve Sınıfa Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
            }
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Personel İlgili Okul Ve Sınıfa Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          })
        })
      },
      addUserSchoolLessonData (userId) {

        this.loading = true
        this.addUserSchoolClasesData(userId)
        this.personData.schools.forEach((item) => {
          var data = []
          item.lessons.forEach((lesson) => {
            data.push({
              userid: userId,
              lessonid: lesson.id,
              schoolid: item.id
            })
          })
          this.$store.dispatch('createUserSchoolLesson', {
            usersllist: data
          }).then((res) => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = false
              } else {
                this.loading = false
              }
            } else {
              this.loading = false
            }
            console.log('userokulders', res.status)
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert('Personel Okul ve Derslere Eklenirken Hata Gerçekleşti', '', 'error', 'Tamam')
          })
        })
      },
      addSchoolUserData (userID) {
        let data = []
        this.personData.schools.forEach((item) => {
          data.push({
            schoolid: item.id,
            userid: userID
          })
        })
        this.$store.dispatch('createUserSchool', {
          userschoollist: data
        }).then((res) => {
          if (res.status) {
            if (res.status == 200) {
              this.loading = false
              if (this.schoolTaskStatus == 0) {
                this.addLessonUserData(userID)
              } else {
                this.showSchoolTask = !this.showSchoolTask
                this.personData.schools = []
                this.personSchoolData = []
                this.personClasesData = []
                this.personLessonData = []
              }
              appPlugin.showalert('Personel  Okullara Başarıyla Eklendi ', '', 'success', 'Tamam')
            }
          } else {
            this.loading = false
            appPlugin.showalert('Personel  Okullara Eklenirken Hata Gerçekleşti ', '', 'error', 'Tamam')
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert('Personel Okullara Eklenirken Hata Gerçekleşti ', '', 'error', 'Tamam')
        })

      },
      saveUserSchool () {
        if (this.personData.schools.length < 1) {
          appPlugin.showalert('Uyarı', 'Lütfen Personelin  görevli Olduğu Sınıf Ve Dersleri Seçiniz', 'warning', 'Tamam')
        } else {
          this.loading = true
          this.addSchoolUserData(this.user.id)
        }
      },
      addNewSchool () {
        if (this.schoolTaskStatus == 0) {
          if (this.personClasesData.length < 1 || this.personLessonData.length < 1) {
            appPlugin.showalert('Uyarı', 'Lütfen Personelin  görevli Olduğu Sınıf Ve Dersleri Seçiniz', 'warning', 'Tamam')
          } else {
            if (this.personData.schools.length > 0) {
              let findedSchool = this.personData.schools.filter((item) => {
                return item.id == this.personSchoolData.id
              })
              if (findedSchool.length) {
                /*        this.personClasesData.forEach((item) => {
                          item.type = false
                        })*/
                findedSchool[0].clases = this.personClasesData
                findedSchool[0].lessons = this.personLessonData
              } else {
                this.personClasesData.forEach((item) => {
                  item.type = false
                })
                this.personSchoolData.clases = this.personClasesData
                this.personSchoolData.lessons = this.personLessonData
                this.personData.schools.push(this.personSchoolData)
              }
            } else {
              this.personClasesData.forEach((item) => {
                item.type = false
              })
              this.personSchoolData.clases = this.personClasesData
              this.personSchoolData.lessons = this.personLessonData
              this.personData.schools.push(this.personSchoolData)
            }
            this.personSchoolData = {}
            this.personClasesData = []
            this.personLessonData = []
          }
        } else {
          if (this.personSchoolData && this.personSchoolData.id) {
            this.personData.schools.push(this.personSchoolData)
          } else {
            appPlugin.showalert('Uyarı', 'Lütfen Okul Seçimi Yapınız', 'info', 'Tamam')
          }
        }
      },
      onChangeType (item, cls, clsIndex) {
        item.clases[clsIndex].type = cls.type
      },
      onChangeSchool (data) {
        if (this.schoolTaskStatus == 0) {
          this.loading = true
          this.personClasesData = []
          this.$store.dispatch('fetchSchoolClasesBranchesPivotAll', {
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
          this.$store.dispatch('fetchAllSchoolLessonsPivot', {
            urlparse: appPlugin.urlParse('school_id=' + data.id)
          }).then((res) => {
            this.schoolLessonsData = res.data
          }).catch((err) => {
            this.loading = false
          })

          if (this.personData.schools.length > 0) {

            let finded = this.personData.schools.filter((item) => {
              return item.id == data.id
            })
            if (finded.length > 0) {
              this.personClasesData = finded[0].clases
              this.personLessonData = finded[0].lessons
            }
          }
        }
      },
      onTouch () {
        this.isTouched = true
      },
    },

    components: {
      tooltip,
      Flex,
      FlexCard,
      VSelect,
      VTabs,
      VTabContent,
      MaskedInput,
      SearchBox,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Multiselect,
      datetime: Datetime,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
    },
  }
</script>

<style scoped>

</style>
